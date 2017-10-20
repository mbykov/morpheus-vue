import Vue from 'vue'
import axios from 'axios'
import App from './App'

import {ipcRenderer} from 'electron'
import {log, q, span, empty, create} from './utils'
import {zh} from '../../../speckled-band'
const clipboard = require('electron-clipboard-extended')

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

// 根據中央社報導，童子賢今天出席科技部記者會，
clipboard
  .on('text-changed', () => {
    let currentText = clipboard.readText()
    // log('TEXT:', currentText)
    let pars = zh(currentText)
    if (!pars) return
    let text = q('#text')
    empty(text)
    pars.forEach((cls) => {
      let par = create('p')
      cls.forEach((cl) => {
        let spn = span(cl.text)
        spn.classList = (cl.type === 'cl') ? 'cl' : 'sp'
        par.appendChild(spn)
      })
      text.appendChild(par)
    })
    log('PARS:', pars)
  })
  .startWatching()

ipcRenderer.on('section', function (event, name) {
  log('section start')
})

ipcRenderer.on('before-quit', function (event) {
  clipboard.off('text-changed')
  // clipboard.stopWatching()
})

/* eslint-disable no-new */
new Vue({
  components: { App },
  template: '<App/>'
}).$mount('#app')
