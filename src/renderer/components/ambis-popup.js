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
      let ambis = _.find(segs, (ambi) => { return ambi.seg === data.seg})
      // log('===AMBIS', ambis)
      if (!ambis) return
      this.ambis = ambis.ambis
      let oambis = q('.ambis')
      placePopup(data.coords, oambis)
      EventBus.res.recsegs = EventBus.res.gdocs
    },

    showDict: function (ev) {
      if (!ev.target.classList.contains('seg')) return
      let seg = ev.target.textContent
      let dict
      this.ambis.forEach(ambi => {
        ambi.forEach(am => {
          if (am.dict === seg) dict = am
        })
      })
      if (!dict) return
      EventBus.res.recsegs = [dict]
      EventBus.$emit('show-dict', seg)
    },

    showRec: function(ev) {
      EventBus.$emit('show-recursive', ev)
    }
  }
}
