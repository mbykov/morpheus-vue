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

  let promise = new Promise((resolve, reject) => {
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

export function queryDBs (dbns, str, cb) {
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
