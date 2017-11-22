//

import {ipcRenderer} from 'electron'
import { EventBus } from '../bus.js'
import {log} from '../utils'
import _ from 'lodash'

const checkpng = 'static/check.png'

export default {
  name: 'active',
  data: function () {
    return {
      chcksrc: checkpng,
      cfg: ''
    }
  },
  created () {
    ipcRenderer.send('cfg')
    EventBus.$once('cfg', (cfg) => {
      log('ACTIVETABLE', cfg)
      this.$nextTick(function () {
        this.drawTable(cfg)
      })
    })
  },

  methods: {
    drawTable: function (cfg) {
      let sorted = _.sortBy(cfg, 'weight')
      this.cfg = sorted
    },
    toggleDict: function (ev) {
      if (ev.target.classList.contains('radio-dict')) {
        let name = ev.target.getAttribute('name')
        this.cfg.forEach((info, idx) => {
          if (info.path === 'hanzi') return // hanzi can not be unactive
          if (!info.active) info.active = false
          if (info.path === name) info.active = !info.active
          if (!info.active) info.weight = 100 + idx
        })
        this.cfg = _.sortBy(this.cfg, 'weight')
        ipcRenderer.send('cfg', this.cfg)
      }
    },
    first: function (ev) {
      let cfg = this.cfg
      let name = ev.target.textContent.trim()
      cfg.forEach((info, idx) => { info.weight = idx + 1 })
      cfg.forEach(info => { if (info.name === name) info.weight = 0 })
      this.cfg = _.sortBy(cfg, 'weight')
      ipcRenderer.send('cfg', this.cfg)
    },

    remove: function (ev) {
    }
  }
}
