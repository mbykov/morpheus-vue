//

import { EventBus } from './bus'
import {log, q, segs2dict, placePopup} from '../utils'
import _ from 'lodash'

export default {
  name: 'ambis-popup',
  created () {
    EventBus.$on('show-ambis', data => {
      this.showPopup(data)
    })
  },
  // props: ['ambis', 'coords'],
  data: function () {
    return {
      ambis: ''
    }
  },
  methods: {
    showPopup: function (data) {
      let segs = EventBus.res.segs
      let ambis = _.find(segs, (ambi) => { return ambi.seg === data.seg })
      // log('===AMBIS', ambis)
      if (!ambis) return
      this.ambis = ambis.ambis
      let oambis = q('.ambis')
      placePopup(data.coords, oambis)
    },

    showDict: function (ev) {
      if (!ev.target.classList.contains('seg')) return
      let seg = ev.target.textContent
      let dict = _.find(EventBus.res.gdocs, doc => { return doc.dict === seg })
      if (!dict) return
      EventBus.res.recsegs = [dict]
      EventBus.$emit('show-dict', seg)
    },

    showRec: function (ev) {
      let data = {seg: ev.target.textContent, coords: getCoords(ev.target)}
      EventBus.$emit('show-recursive', data)
    }
  }
}

function getCoords (el) {
  let rect = el.getBoundingClientRect()
  return {top: rect.top + 28, left: rect.left}
}
