'use strict'

import _ from 'lodash'
import { app, BrowserWindow, Menu, Tray, ipcMain, electron, shell } from 'electron'
import {log} from '../renderer/utils'
import {checkDBs, createDBs, queryHanzi, queryDBs} from './createDBs'
// import { autoUpdater } from 'electron-updater'

const path = require('path')

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
if (isDev) {
  console.log('Running in development')
} else {
  console.log('Running in production')
}

let tray
let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })

  mainWindow.loadURL(winURL)

  let pckg = require('../../package.json')
  let name = pckg.name
  let version = pckg.version
  mainWindow.setTitle([name, 'v.', version].join(' '))
  // console.log('TITLE', mainWindow.getTitle())

  mainWindow.on('closed', () => {
    mainWindow = null
    tray = null
  })

  mainWindow.webContents.on('crashed', function (err) {
    console.log('err: CRASHED', err)
    app.quit()
  })

  mainWindow.on('unresponsive', function (err) {
    console.log('err: unresponsive', err)
    app.quit()
  })

  let template = require('./menu-template')(mainWindow, electron)
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  let trayicon = path.join(__dirname, '../../build/icons/64x64.png')
  // let trayicon = path.join(__dirname, '../build/book.png')
  tray = new Tray(trayicon)
  const contextMenu = Menu.buildFromTemplate([
    {label: 'help', role: 'help'},
    {label: 'learn more', click () { shell.openExternal('http://diglossa.org') }},
    {label: 'quit', role: 'quit'}
  ])
  tray.setToolTip('Morpheus-eastern')
  tray.setContextMenu(contextMenu)

  // HACK
  app.setPath('userData', app.getPath('userData').replace(/Electron/i, 'morpheus-vue'))

  // == HERE WE ARE ==
  let upath = app.getPath('userData')
  let config = checkDBs(upath)
  if (!config || !config.dbns.length) {
    log('no dbs found')
    app.quit()
  }

  ipcMain.on('config', function (event, seg) {
    mainWindow.webContents.send('config', config)
  })
  // log('send config', config)

  createDBs(upath, config).then(dbs => {
    if (!dbs) return
    ipcMain.on('data', function (event, str) {
      queryDBs(dbs, str)
        .then(function (arrayOfResults) {
          let flats = _.flatten(_.compact(arrayOfResults))
          let data = {str: str, res: flats}
          mainWindow.webContents.send('data', data)
        }).catch(function (err) {
          console.log('ERR queryDBs', err)
        })
    })

    ipcMain.on('hanzi', function (event, seg) {
      queryHanzi(dbs, upath, seg).then(function (doc) {
        if (!doc) return
        mainWindow.webContents.send('hanzi', doc)
      }).catch(function (err) {
        log('catched hanzi err', err)
      })
    })
  }).catch(err => {
    console.log('err creating dbns', err)
  })
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

// autoUpdater.on('update-downloaded', () => {
//   autoUpdater.quitAndInstall()
// })

// app.on('ready', () => {
//   if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
// })
