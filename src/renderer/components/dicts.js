//

import { EventBus } from './bus.js'
import {log} from '../utils'
import _ from 'lodash'

export default {
  name: 'dicts',
  // props: ['odict'], // не задействовано, потому что bus.event
  created () {
    EventBus.$on('show-dict', seg => {
      let docs = _.filter(EventBus.res.docs, doc => { return doc.dict === seg})
      // log('DOCS', docs)
      let dbns = _.groupBy(docs, 'dname')
      this.dict = {seg: seg, dbns: dbns}
      // log('>>', this.dict)
    })
  },
  data: function () {
    return {
      dict: ''
    }
  }
}
