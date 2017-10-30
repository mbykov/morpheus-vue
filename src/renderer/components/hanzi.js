//

import { EventBus } from './bus.js'
import {log} from '../utils'
import _ from 'lodash'

log('=== hanzi-recu')
export default {
  name: 'hanzi',
  created () {
    // EventBus.$on('show-recursive', data => {
      // log('=== hanzi-recu', data)
    // })
    EventBus.$on('show-hanzi', data => {
      this.showHanzi(data)
    })
    // EventBus.$on('show-hanzi', data => {
      // log('HANZI VUE')
    // })
  },
  data: function () {
    return {
      dict: ''
    }
  },
  methods: {
    showHanzi: function (data) {
      log('== ответ hanzi', data)
    }
  }
}
