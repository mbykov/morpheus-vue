'use strict'

import {app} from 'electron'
import {log} from '../renderer/utils'
import _ from 'lodash'

const path = require('path')
const fse = require('fs-extra')
let PouchDB = require('pouchdb')

export function checkDBs (upath) {
  let dest = path.resolve(upath, 'pouch')
  let src = path.resolve(__dirname, '../..', 'pouch')

  try {
    let dstate = fse.pathExistsSync(dest)
    dstate = false // FIX:
    if (!dstate) {
      fse.copySync(src, dest, { matching: '**/*' })
    }
  } catch (err) {
    log('ERR creating pouch', err)
    app.quit()
    return
  }

  let infos = []
  fse.readdirSync(dest).forEach(fn => {
    if (path.extname(fn) !== '.json') return
    if (fn === 'active.json') return
    let ipath = path.resolve(dest, fn)
    let info = fse.readJsonSync(ipath)
    infos.push(info)
  })
  let dbns = infos.map(info => { return info.path })

  let apath = path.resolve(dest, 'active.json')
  let active
  try {
    active = fse.readJsonSync(apath)
  } catch (err) {
    active = dbns
    let json = JSON.stringify(active)
    fse.writeFileSync(apath, json)
  }
  return {dbns: dbns, active: active, infos: infos}
}

export function createDBs (upath, config) {
  if (!config) return
  let promis = new Promise(function (resolve, reject) {
    resolve(manyDBs(upath, config))
  })
  return promis
}

function manyDBs (upath, config) {
  let databases = []
  config.dbns.forEach(dn => {
    let dpath = path.resolve(upath, 'pouch', dn)
    let dstate = fse.exists(dpath)
    if (dstate) {
      let pouch = new PouchDB(dpath)
      pouch.dname = dn
      databases.push(pouch)
    } else {
      console.log('NO DB', dn, dpath)
    }
  })
  return databases
}

export function queryDBs (dbs, str) {
  let keys = parseKeys(str)
  let active = _.filter(dbs, db => { return db.dname !== 'hanzi' })
  return Promise.all(active.map(function (db) {
    return db.allDocs({
      keys: keys,
      include_docs: true
    }).then(function (res) {
      if (!res || !res.rows) throw new Error('no dbn result')
      let rdocs = _.compact(res.rows.map(row => { return row.doc }))
      if (!rdocs.length) return
      rdocs.forEach(rd => {
        rd.docs.forEach(d => {
          d.dname = db.dname
          d.dict = rd._id
        })
      })
      return rdocs
    }).catch(function (err) {
      console.log('ERR 1', err)
    })
  }))
}

export function queryHanzi (dbs, upath, seg) {
  let keys = [seg]
  let active = _.find(dbs, db => { return db.dname === 'hanzi' })
  let opt = {keys: keys, include_docs: true}
  let promise = new Promise((resolve, reject) => {
    active.allDocs(opt).then(function (res) {
      if (!res || !res.rows) throw new Error('no dbn result')
      let docs = _.compact(res.rows.map(row => { return row.doc }))
      return Promise.all(docs.map(function (doc) {
        return doc
      }))
    }).then(function (docs) {
      let doc = docs[0]
      if (doc) delete doc._rev
      resolve(doc)
    }).catch(function (err) {
      log('ERR query HANZI', err)
      reject(err)
    })
  })
  return promise
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
