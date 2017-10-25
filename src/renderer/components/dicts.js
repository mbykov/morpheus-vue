//

import { EventBus } from './bus.js'
import {log, segs2dict} from '../utils'
export default {
  name: 'dicts',
  // props: ['odict'], // не задействовано, потому что bus.event
  created () {
    EventBus.$on('show-dict', seg => {
      let segs = EventBus.res.recsegs || EventBus.res.segs
      let dict = segs2dict(seg, segs)
      this.dict = dict
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
