'use strict'

// import {log} from '../renderer/utils'
import _ from 'lodash'
import { app, BrowserWindow, Menu, Tray, ipcMain, electron, shell } from 'electron'
import {getWindowState, defaultDBs, readCfg, writeCfg, createDBs, queryHanzi, queryDBs, cleanupDBs} from './createDBs'
import { autoUpdater } from 'electron-updater'

const path = require('path')

const decompress = require('decompress')
const decompressTargz = require('decompress-targz')

// HACK
app.setPath('userData', app.getPath('userData').replace(/Electron/i, 'morpheus-vue'))
let upath = app.getPath('userData')

const Storage = require('node-localstorage').JSONStorage
const nodeStorage = new Storage(upath)

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason)
  // application specific logging, throwing an error, or other logic here
  app.quit()
})

process.on('uncaughtException', function (err) {
  console.log('err: uncaughtException', err)
  app.quit()
})

// Can be overridden by setting the ELECTRON_IS_DEV environment variable to 1.
const isDev = require('electron-is-dev')
// if (isDev) {
//   console.log('Running in development')
// } else {
//   console.log('Running in production')
// }

var windowState = getWindowState()
let mainWindow

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    title: 'morpheus-vue',
    backgroundColor: '#002b36',
    useContentSize: true,
    x: (windowState.bounds && windowState.bounds.x) || undefined,
    y: (windowState.bounds && windowState.bounds.y) || undefined,
    width: (windowState.bounds && windowState.bounds.width) || 550,
    height: (windowState.bounds && windowState.bounds.height) || 450
  })

  mainWindow.loadURL(winURL)

  mainWindow.webContents.openDevTools()

  // let pckg = require('../../package.json')
  // let name = pckg.name
  // let version = pckg.version
  // mainWindow.setTitle([name, 'v.', version].join(' '))

  mainWindow.webContents.on('did-finish-load', () => {
    let pckg = require('../../package.json')
    let name = pckg.name
    let version = pckg.version
    mainWindow.setTitle([name, 'v.', version].join(' '))
    checkForUpdates(isDev)
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.webContents.on('crashed', function (err) {
    console.log('err: CRASHED', err)
    app.quit()
  })

  mainWindow.on('unresponsive', function (err) {
    console.log('err: unresponsive', err)
    app.quit()
  })

  let states = ['resize', 'move', '.close']
  states.forEach(function (e) {
    mainWindow.on(e, function () {
      windowState.bounds = mainWindow.getBounds()
      nodeStorage.setItem('windowstate', windowState)
    })
  })

  let template = require('./menu-template')(mainWindow, electron)
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  let trayicon = path.join(__dirname, '../../build/icons/64x64.png')
  // let trayicon = path.join(__dirname, '../build/book.png')
  let tray = new Tray(trayicon)
  const contextMenu = Menu.buildFromTemplate([
    {label: 'help', role: 'help'},
    {label: 'learn more', click () { shell.openExternal('http://diglossa.org') }},
    {label: 'quit', role: 'quit'}
  ])
  tray.setToolTip('Morpheus-eastern')
  tray.setContextMenu(contextMenu)

  // HACK
  // app.setPath('userData', app.getPath('userData').replace(/Electron/i, 'morpheus-vue'))
  // let upath = app.getPath('userData')
  defaultDBs(upath)

  ipcMain.on('cfg', function (event, newcfg) {
    let cfg
    if (newcfg) {
      cfg = newcfg
      writeCfg(upath, cfg)
    } else {
      cfg = readCfg(upath)
    }
    // mainWindow.webContents.send('status', 'teststatus')
    mainWindow.webContents.send('cfg', cfg)
    // createDBs(upath, cfg).then(dbs => {
    Promise.resolve(createDBs(upath, cfg)).then(dbs => {
      if (!dbs) return
      ipcMain.removeAllListeners('data')
      ipcMain.on('data', function (event, str) {
        queryDBs(dbs, str)
          .then(function (arrayOfResults) {
            let flats = _.flatten(_.compact(arrayOfResults))
            if (!flats.length) return
            let data = {str: str, res: flats}
            mainWindow.webContents.send('data', data)
          }).catch(function (err) {
            console.log('ERR queryDBs', err)
          })
      })

      ipcMain.removeAllListeners('hanzi')
      ipcMain.on('hanzi', function (event, seg) {
        queryHanzi(dbs, upath, seg).then(function (doc) {
          if (!doc) return
          mainWindow.webContents.send('hanzi', doc)
        }).catch(function (err) {
          console.log('catched hanzi err', err)
        })
      })
    }).catch(err => {
      console.log('err creating dbns', err)
    })
    // log('CFG', cfg)
  })

  ipcMain.on('ipath', function (event, ipath) {
    let dbpath = path.resolve(upath, 'pouch')
    decompress(ipath, dbpath, {
      plugins: [
        decompressTargz()
      ]
    }).then(() => {
      // console.log('Files decompressed')
      mainWindow.webContents.send('section', 'active')
    })
  })

  ipcMain.on('cleanup', function (event, ipath) {
    cleanupDBs(upath)
    mainWindow.webContents.send('section', 'active')
  })
  // checkForUpdates()
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

// function sendStatus (text) {
//   mainWindow.webContents.send('status', text)
// }

// // autoUpdater.on('update-downloaded', () => {
// //   autoUpdater.quitAndInstall()
// // })

function checkForUpdates (isDev) {
  if (!isDev) {
    autoUpdater.checkForUpdates()
  }
}

// app.on('ready', () => {
//   if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
//   sendStatus('ready for update')
//   mainWindow.webContents.send('status', 'teststatus')
// })

// autoUpdater.on('checking-for-update', () => {
//   sendStatus('Checking for update...')
// })
// autoUpdater.on('update-available', (ev, info) => {
//   sendStatus('Update available, downloading', info)
// })
// // // autoUpdater.on('update-not-available', (ev, info) => {
// // // sendStatus('Update not available.')
// // // })
// autoUpdater.on('error', (ev, err) => {
//   sendStatus('Error in auto-updater: ' + err)
// })

// autoUpdater.on('download-progress', (progressObj) => {
//   let message = 'Download speed: ' + progressObj.bytesPerSecond
//   message = message + ' - Downloaded ' + progressObj.percent + '%'
//   message = message + ' (' + progressObj.transferred + '/' + progressObj.total + ')'
//   sendStatus(message)
// })
