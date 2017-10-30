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

// 古
// 件
export function queryHanzi (upath, seg) {
  console.log('=====> BEFORE', seg)
  let keys = [seg]
  let dpath = path.resolve(upath, 'hanzi')
  // log('DPATH', dpath)

  let dstate = jetpack.exists(dpath)
  if (dstate) {
    let pouch = new PouchDB(dpath)
    return pouch.allDocs({
      keys: keys,
      include_docs: true
    }).then(function (res) {
      log('-->', res)
      if (!res || !res.rows) throw new Error('no dbn result')
      let rdocs = _.compact(res.rows.map(row => { return row.doc }))
      return rdocs
    }).catch(function (err) {
      log('ERR query HANZI', err)
    })
  } else {
    log('NO DB query HANZI', dpath)
  }
}

// 根據中央社報導，童子賢今天出 席科技部記者會，
// function queryHanzi (seg, cb) {
// function recursive(data){
//   return newThenable(data).then(function(val){
//     if (val.a){
//       return val
//     } else {
//       return recursive(val)
//     }
//   })
// }

//   Promise.all(dbns.map(function (dbn) {
//     let db = dbn.db
//     return db.allDocs({
//       keys: keys,
//       include_docs: true
//     }).then(function (res) {
//       if (!res || !res.rows) throw new Error('no dbn result')
//       let rdocs = _.compact(res.rows.map(row => { return row.doc }))
//       if (!rdocs.length) return
//       // rdocs.forEach(d => { d.dname = db.dname })
//       rdocs.forEach(rd => {
//         rd.docs.forEach(d => {
//           d.dname = db.dname
//           d.dict = rd._id
//         })
//       })
//       // return _.flatten(_.compact(docs))
//       return rdocs
//     }).catch(function (err) {
//       cb(err, null)
//       log('ERR 1', err)
//     })
//   })).then(function (arrayOfResults) {
//     let flats = _.flatten(_.compact(arrayOfResults))
//     // log('FLATS', flats)
//     cb(null, flats)
//   }).catch(function (err) {
//     log('ERR 2', err)
//     cb(err, null)
//   })
// }
