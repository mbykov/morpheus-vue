//

import { EventBus } from './bus'
import {log, q, segs2dict, placePopup} from '../utils'
import _ from 'lodash'

export default {
  name: 'ambis-popup',
  props: ['ambis', 'coords'],
  watch: {
    ambis: function (ambis) {
      let oambis = q('.ambis')
      oambis.ambis = ambis
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
    }
  }
}
