//

import {log} from './utils'
import {ipcRenderer, shell} from 'electron'
import { EventBus } from './bus'
import router from './router'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

let zh = require('speckled-band')
const rpng = 'static/right.png'
const lpng = 'static/left.png'
const clipboard = require('electron-clipboard-extended')
var Mousetrap = require('mousetrap')

export default {
  name: 'morpheus-vue',
  created () {
    ipcRenderer.send('cfg')
    clipboard
      .on('text-changed', () => {
        let text = clipboard.readText().trim()
        let pars = zh(text)
        if (!pars) return
        router.push({path: 'main', query: {text: text}})
      })
      .startWatching()

    let that = this
    ipcRenderer.on('section', function (event, name) {
      that.showSection(name)
    })
    Mousetrap.bind('esc', function () { EventBus.$emit('clean') }, 'keyup')
    Mousetrap.bind('alt+left', function () { router.go(-1) }, 'keyup')
    Mousetrap.bind('alt+right', function () { router.go(1) }, 'keyup')
  },
  data: function () {
    return {
      rpng: rpng,
      lpng: lpng
    }
  },
  methods: {
    externaLink (ev) {
      if (!ev.target.classList.contains('external')) return
      let href = ev.target.getAttribute('href')
      shell.openExternal(href)
    },
    goBack () {
      // log('arrow <---')
      EventBus.$emit('clean')
      router.go(-1)
    },
    goForward () {
      // log('arrow --->')
      EventBus.$emit('clean')
      router.go(1)
    },
    showSection (name) {
      log('togo sec', name)
      router.push({path: name, query: {text: name}})
    }
  }
}

ipcRenderer.on('before-quit', function (event) {
  clipboard.off('text-changed')
  // clipboard.stopWatching()
})

ipcRenderer.on('hanzi', function (event, doc) {
  EventBus.$emit('show-hanzi', doc)
})

ipcRenderer.on('cfg', function (event, cfg) {
  EventBus.$emit('cfg', cfg)
})
