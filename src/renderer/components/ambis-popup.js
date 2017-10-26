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
      ambis: '',
      cl: null
    }
  },
  methods: {
    showPopup: function (data) {
      this.cl = data.cl
      this.ambis = data.ambis
      let oambis = q('.ambis')
      placePopup(data.coords, oambis)
    },

    showDict: function (ev) {
      if (!ev.target.classList.contains('seg')) return
      let seg = ev.target.textContent
      let data = {seg: seg, cl: this.cl}
      EventBus.$emit('show-dict', data)
    },

    showRec: function (ev) {
      // log('SHOW RECU')
      let data = {seg: ev.target.textContent, coords: getCoords(ev.target), cl: this.cl}
      EventBus.$emit('show-recursive', data)
    }
  }
}

function getCoords (el) {
  let rect = el.getBoundingClientRect()
  return {top: rect.top + 28, left: rect.left}
}
