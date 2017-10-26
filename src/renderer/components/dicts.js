//

import { EventBus } from './bus.js'
import {log, segs2dict} from '../utils'
import _ from 'lodash'

export default {
  name: 'dicts',
  // props: ['odict'], // не задействовано, потому что bus.event
  created () {
    EventBus.$on('show-dict', seg => {
      // let segs = EventBus.res.segs
      // let dict = segs2dict(seg, segs)
      // this.dict = dict
      // log('ALL', EventBus.res.docs)
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
  // watch: {
  //   odict: function (newdict) {
  //     console.log('DICT CHANGED', newdict)
  //     this.dict = JSON.parse(JSON.stringify(newdict))
  //   }
  // },
  // components: {},
  // methods: {
  // }
}
