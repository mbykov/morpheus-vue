//

import { EventBus } from './bus'
import {log, q, segs2dict, placePopup} from '../utils'
import _ from 'lodash'

export default {
  name: 'ambis-popup',
  props: ['ambis', 'coords'],
  data: function () {
    return {
      dictambis: ''
    }
  },
  watch: {
    ambis: function (am) {
      if (!am) return
      let segs = am.res.segs
      let ambis = _.find(segs, (ambi) => { return ambi.seg === am.seg})
      let oambis = q('.ambis')
      this.dictambis = ambis.ambis
      oambis.ambis = ambis.ambis
      oambis.res = am.res
      placePopup(this.coords, oambis)
    }
  },
  methods: {
    showDict: function (ev) {
      if (!ev.target.classList.contains('seg')) return
      let seg = ev.target.textContent
      let ambis = q('.ambis').ambis
      let dict
      ambis.forEach(ambi => {
        ambi.forEach(am => {
          if (am.dict === seg) dict = am
        })
      })
      if (!dict) return
      EventBus.$emit('show-dict', dict)
    },
    showRec: function(ev) {
      EventBus.$emit('show-recursive', ev)
    }
  }
}
