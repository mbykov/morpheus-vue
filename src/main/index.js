'use strict'

// import { app, BrowserWindow, Menu, Tray, ipcMain, electron, shell } from 'electron'
import { app, BrowserWindow, Menu, Tray, ipcMain, electron, shell } from 'electron'
import {log} from '../renderer/utils'
import {createdbs, queryHanzi} from './createDBs'

// import {segmenter} from '../../../segmenter'
const _ = require('lodash')
const path = require('path')
// const util = require('util')

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

function queryDBs (dbns, str, cb) {
  let keys = parseKeys(str)
  Promise.all(dbns.map(function (dbn) {
    let db = dbn.db
    return db.allDocs({
      keys: keys,
      include_docs: true
    }).then(function (res) {
      if (!res || !res.rows) throw new Error('no dbn result')
      let rdocs = _.compact(res.rows.map(row => { return row.doc }))
      if (!rdocs.length) return
      // rdocs.forEach(d => { d.dname = db.dname })
      rdocs.forEach(rd => {
        rd.docs.forEach(d => {
          d.dname = db.dname
          d.dict = rd._id
        })
      })
      // return _.flatten(_.compact(docs))
      return rdocs
    }).catch(function (err) {
      cb(err, null)
      console.log('ERR 1', err)
    })
  })).then(function (arrayOfResults) {
    let flats = _.flatten(_.compact(arrayOfResults))
    cb(null, flats)
  }).catch(function (err) {
    console.log('ERR 2', err)
    cb(err, null)
  })
}

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

function parseKeys (str) {
  let h, t
  let padas = []
  for (let idx = 1; idx < str.length + 1; idx++) {
    h = str.slice(0, idx)
    t = str.slice(idx)
    padas.push(h)
    let h_
    for (let idy = 1; idy < t.length + 1; idy++) {
      h_ = t.slice(0, idy)
      padas.push(h_)
    }
  }
  return padas
}

// function plog (o, d) {
//   if (!d) d = 3
//   // console.log(util.inspect(o, false, null))
//   console.log(util.inspect(o, {showHidden: false, depth: d}))
// }
