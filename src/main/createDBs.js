const path = require('path')
const jetpack = require("fs-jetpack")
const _ = require('lodash')
let PouchDB = require('pouchdb')

module.exports = createDBs

function createDBs(app) {
  // HACK!
  app.setPath('userData', app.getPath('userData').replace(/Electron/i, 'morpheus-eastern'));
  let upath = app.getPath('userData')
  let fname = 'morpheus-config.json'
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
