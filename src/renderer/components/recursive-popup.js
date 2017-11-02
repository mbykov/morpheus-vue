//

import _ from 'lodash'
import {q, placePopup} from '../utils'
import { EventBus } from './bus'
import {ipcRenderer} from 'electron'

// import {segmenter} from '../../../../segmenter'
// import {segmenter} from 'recursive-segmenter'
let segmenter = require('recursive-segmenter')

export default {
  name: 'recursive-popup',
  created () {
    EventBus.$on('show-recursive', data => {
      this.showPopup(data)
    })
  },
  data: function () {
    return {
      segs: null,
      cl: null
    }
  },
  methods: {
    showPopup: function (data) {
      this.cl = data.cl
      let dicts = _.uniq(EventBus.res[data.cl].docs.map(doc => { return doc.dict }))

      let segs = segmenter(data.seg, dicts)
      this.segs = segs.map(s => { return s.seg })

      let osegs = q('.segs')
      placePopup(data.coords, osegs)
    },

    showDict: function (ev) {
      // TODO: а если длина больше 1, и м.б. и rec, и ambis?
      let seg = ev.target.textContent
      let data = {seg: seg, cl: this.cl}
      EventBus.$emit('show-dict', data)
    },

    queryHanzi: function (ev) {
      let seg = ev.target.textContent
      ipcRenderer.send('hanzi', seg)
      // EventBus.$emit('show-hanzi', seg)
    }
  }
}

// function findAncestor (el, cls) {
//   while ((el = el.parentElement) && !el.classList.contains(cls));
//   return el
// }
