'use strict'

// import { app, BrowserWindow, Menu, Tray, ipcMain, electron, shell } from 'electron'
import { app, BrowserWindow, Menu, Tray, ipcMain, electron, shell } from 'electron'
import {log} from '../renderer/utils'
import {createdbs, queryHanzi, queryDBs} from './createDBs'
import { autoUpdater } from 'electron-updater'

const path = require('path')
// const util = require('util')
// const _ = require('lodash')

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

  app.setPath('userData', app.getPath('userData').replace(/Electron/i, 'morpheus-eastern'))
  let upath = app.getPath('userData')
  let dbns = createdbs(upath)

  ipcMain.on('data', function (event, str) {
    queryDBs(dbns, str, function (err, res) {
      if (err) return console.log('err dbs')
      else {
        let data = {str: str, res: res}
        mainWindow.webContents.send('data', data)
      }
    })
  })

  ipcMain.on('hanzi', function (event, seg) {
    queryHanzi(upath, seg).then(function (doc) {
      mainWindow.webContents.send('hanzi', doc)
    }).catch(function (err) {
      log('catched hanzi err', err)
    })
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

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
