import Vue from 'vue'
import axios from 'axios'
import App from './App'

import {log, q, span, br, empty} from './utils'
import band from '../../../speckled-band'
const clipboard = require('electron-clipboard-extended')

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

// 根據中央社報導，童子賢今天出席科技部記者會，
clipboard
  .on('text-changed', () => {
    let currentText = clipboard.readText()
    console.log('TEXT:', currentText)
    let code = 'zh'
    let clauses = band(code, currentText)
    let zh = clauses.map(cl => { return cl.cl }).join('')
    if (!zh.length) return
    // log('CL', clauses)
    let text = q('#text')
    empty(text)
    clauses.forEach((clause) => {
      let el
      if (clause.cl) {
        el = span(clause.cl)
        el.classList.add('clause')
        text.appendChild(el)
      } else {
        let strs = clause.sp.split('\n\n')
        log('STRS', strs)
        strs.forEach((str, idx) => {
          el = span(str)
          text.appendChild(el)
          if (idx !== strs.length - 1) text.appendChild(br())
        })
        el.classList.add('space')
      }
    })

    // router.push({ path: '/main',  query: { clauses: clauses } })
  })
  .startWatching()

/* eslint-disable no-new */
new Vue({
  components: { App },
  template: '<App/>'
}).$mount('#app')
