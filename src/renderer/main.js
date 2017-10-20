import Vue from 'vue'
import axios from 'axios'
import App from './App'

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
    console.log('TEXT:', currentText)
    let pars = zh(currentText)
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

    // let code = 'zh'
    // let clauses = band(code, currentText)
    // let zh = clauses.map(cl => { return cl.cl }).join('')
    // if (!zh.length) return
    // // log('CL', clauses)
    // clauses.forEach((clause) => {
    //   let el
    //   if (clause.cl) {
    //     el = span(clause.cl)
    //     el.classList.add('clause')
    //     text.appendChild(el)
    //   } else {
    //     let strs = clause.sp.split('\n\n')
    //     log('STRS', strs)
    //     strs.forEach((str, idx) => {
    //       el = span(str)
    //       text.appendChild(el)
    //       if (idx !== strs.length - 1) text.appendChild(br())
    //     })
    //     el.classList.add('space')
    //   }
    // })
    log('PARS:', pars)

    // router.push({ path: '/main',  query: { clauses: clauses } })
  })
  .startWatching()

/* eslint-disable no-new */
new Vue({
  components: { App },
  template: '<App/>'
}).$mount('#app')
