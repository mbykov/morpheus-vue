//

import {ipcRenderer} from 'electron'
import { EventBus } from './bus.js'
import {log} from '../utils'
import _ from 'lodash'

export default {
  name: 'dicts',
  data: function () {
    return {
      dict: ''
    }
  },
  created () {
    EventBus.$on('show-dict', data => {
    })
  },
  methods: {
    showHanzi: function (ev) {
    },
    showTl (ev) {
      EventBus.$emit('go-home')
      log('from install showTitle')
    },

  }
}
