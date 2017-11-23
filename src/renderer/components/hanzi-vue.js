//

import { EventBus } from '../bus.js'
// import {log} from '../utils'
// import {ipcRenderer} from 'electron'

export default {
  name: 'hanzi',
  created () {
    // let that = this
    EventBus.$on('show-dict', data => { this.hanzi = false })
    EventBus.$on('show-hanzi', doc => {
      this.hanzi = doc
    })
  },
  data: function () {
    return {
      hanzi: false
    }
  }
}
