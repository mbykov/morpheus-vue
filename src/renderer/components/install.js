//

import {ipcRenderer} from 'electron'
import { EventBus } from './bus.js'
import {log, span} from '../utils'
import _ from 'lodash'

const checkpng  = 'static/check.png'

export default {
  name: 'dicts',
  data: function () {
    return {
      chcksrc: checkpng,
      cfg: ''
    }
  },
  created () {
    let that  = this
    EventBus.$on('show-install', () => {
      new Promise(function (resolve, reject) {
        if (EventBus.config) {
          resolve(EventBus.config);
        } else {
          ipcRenderer.on('config', function (event, config) {
            EventBus.config = config
            resolve(EventBus.config);
          })
          ipcRenderer.send('config')
        }
      }).then(function(res) {
        that.drawTable()
      });

    })
  },

  methods: {
    drawTable: function () {
      let cfg = EventBus.config
      let rows = []
      cfg.infos.forEach(info => {
        if (info.path == 'hanzi') info.active = true
      })
      this.cfg = cfg
    },
    toggleDict: function (ev) {
      if (ev.target.classList.contains('active')) {
        log('toggle: ', ev.target)
      }
    }
  }
}
