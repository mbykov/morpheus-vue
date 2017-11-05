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
      if (data.hole) {
        this.dict = {seg: data.seg, dbns: {'no result': []}}
        return
      }
      let docs = _.filter(EventBus.res[data.cl].docs, doc => { return doc.dict === data.seg })
      // log('docs', docs)
      let simps = _.compact(_.uniq(docs.map(doc => {return doc.simp})))
      let trads = _.compact(_.uniq(docs.map(doc => {return doc.trad})))
      let other
      if (trads.length && simps.length && simps.toString() !== trads.toString()) {
        other = (simps.includes(data.seg)) ? ['trad:', trads].join(' ') : ['simp:', simps].join(' ')
      }

      let dbns = _.groupBy(docs, 'dname')
      this.dict = {seg: data.seg, other: other, dbns: dbns}
    })
  },
  methods: {
    showHanzi: function (ev) {
      let seg = ev.target.textContent
      log('SHOWH', seg)
      ipcRenderer.send('hanzi', seg)
    }
  }
}
