//

import _ from 'lodash'
import {q, placePopup} from '../utils'
import { EventBus } from '../bus'
import {ipcRenderer} from 'electron'
// import {segmenter} from '../../../../segmenter'
// import {segmenter} from 'recursive-segmenter'
// let segmenter = require('../../../segmenter')
let segmenter = require('recursive-segmenter')

export default {
  name: 'recursive-popup',
  created () {
    EventBus.$on('show-recursive', data => {
      this.showPopup(data)
    })
    EventBus.$on('clean', data => {
      this.segs = null
    })
  },
  data: function () {
    return {
      segs: null,
      cl: null
    }
  },
  props: ['clean'],
  watch: {
    'clean' () {
      this.segs = null
    }
  },

  methods: {
    showPopup: function (data) {
      this.cl = data.cl
      if (!EventBus.res[data.cl]) return
      let dicts = _.uniq(EventBus.res[data.cl].docs.map(doc => { return doc.dict }))

      segmenter(data.seg, dicts).then(segs => {
        this.segs = segs.map(s => { return s.seg })
      })

      let osegs = q('.segs')
      placePopup(data.coords, osegs)
    },

    showDict: function (ev) {
      // TODO: а если длина больше 1, и м.б. и rec, и ambis?
      if (ev.shiftKey) return
      let seg = ev.target.textContent
      let data = {seg: seg, cl: this.cl}
      EventBus.$emit('show-dict', data)
    },

    queryHanzi: function (ev) {
      if (ev.shiftKey) return
      let seg = ev.target.textContent
      ipcRenderer.send('hanzi', seg)
    }
  }
}
