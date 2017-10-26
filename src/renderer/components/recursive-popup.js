//

import _ from 'lodash'
import {log, q, segs2dict, placePopup} from '../utils'
import { EventBus } from './bus'
import {segmenter} from '../../../../segmenter'

export default {
  name: 'recursive-popup',
  created () {
    EventBus.$on('show-recursive', data => {
      this.showPopup(data)
    })
  },
  data: function () {
    return {
      segs: null
    }
  },
  methods: {
    showPopup: function (data) {
      log('RECU->')
      let dicts = _.uniq(EventBus.res.docs.map(doc => { return doc.dict }))
      // log('DDi', dicts)
      //  непонятно. Нужно убрать в segmenter dict=str. Но если str как раз под вопросом?

      let segs = segmenter(data.seg, dicts)
      log('SS', segs)
      this.segs = segs.map(s => { return s.seg })

      let osegs = q('.segs')
      placePopup(data.coords, osegs)

      // EventBus.res.recsegs = segmented.segs
    },

    showDict: function (ev) {
      let seg = ev.target.textContent
      EventBus.$emit('show-dict', seg)
    }
  }
}
