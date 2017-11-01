import {log} from '../renderer/utils'
const path = require('path')
const jetpack = require('fs-jetpack')
const _ = require('lodash')
let PouchDB = require('pouchdb')

// module.exports = createDBs

export function createdbs (upath) {
  // HACK!
  // app.setPath('userData', app.getPath('userData').replace(/Electron/i, 'morpheus-eastern'))
  // let upath = app.getPath('userData')
  // ================ NEW !!!!!!!!!!!!
  let fname = 'morpheus-config-new.json'
  let cpath = path.join(upath, fname)
  let dbns
  try {
    let config = jetpack.read(cpath, 'json')
    dbns = config.dbns
  } catch (err) {
    console.log('ERR', err)
  }
  let databases = []
  dbns.forEach(dn => {
    let dpath = path.resolve(upath, 'pouch', dn, 'db')
    let dstate = jetpack.exists(dpath)
    if (dstate) {
      let pouch = new PouchDB(dpath)
      pouch.dname = dn
      let infopath = path.resolve(upath, 'pouch', dn, 'info.json')
      let info = jetpack.read(infopath, 'json')
      let db = {info: info, db: pouch}
      databases.push(db)
    } else {
      console.log('NO DB', dn, dpath)
    }
  })
  return databases
}

// 古 件
export function queryHanzi (upath, seg) {
  console.log('=====> BEFORE', seg)
  let keys = [seg]
  let dpath = path.resolve(upath, 'hanzi')
  let dstate = jetpack.exists(dpath)
  if (!dstate) {
    log('NO DB query HANZI', dpath)
    return
  }
  let pouch = new PouchDB(dpath)
  let opt = {keys: keys, include_docs: true}

  let promise =  new Promise((resolve, reject) => {
    pouch.allDocs(opt).then(function (res) {
      if (!res || !res.rows) throw new Error('no dbn result')
      let docs = _.compact(res.rows.map(row => { return row.doc }))
      return Promise.all(docs.map(function (doc) {
        return doc
      }))
    }).then(function (docs) {
      let doc = docs[0]
      delete doc._rev
      resolve(doc)
    }).catch(function (err) {
      log('ERR query HANZI', err)
      reject(err)
    })
  })
  return promise
}
