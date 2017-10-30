//

import { EventBus } from './bus.js'
import {log} from '../utils'
import _ from 'lodash'

export default {
  name: 'dicts',
  // props: ['odict'], // не задействовано, потому что bus.event
  created () {
    EventBus.$on('show-dict', data => {
      if (data.hole) {
        this.dict = {seg: data.seg, dbns: {'no result': []}}
        return
      }
      log('CLDICT', data.cl)
      let docs = _.filter(EventBus.res[data.cl].docs, doc => { return doc.dict === data.seg})
      log('DOCS', docs)
      let dbns = _.groupBy(docs, 'dname')
      this.dict = {seg: data.seg, dbns: dbns}
      // log('>>', this.dict)
    })
  },
  data: function () {
    return {
      dict: ''
    }
  }
}
