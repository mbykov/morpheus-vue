//

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
      if (data.hole) {
        this.dict = {seg: data.seg, dbns: {'no result': []}}
        return
      }
      let docs = _.filter(EventBus.res[data.cl].docs, doc => { return doc.dict === data.seg })
      let dbns = _.groupBy(docs, 'dname')
      this.dict = {seg: data.seg, dbns: dbns}
    })
  }
}
