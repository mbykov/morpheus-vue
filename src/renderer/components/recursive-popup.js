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
      // let docs = _.filter(EventBus.res.docs, doc => { return doc.dict === data.seg})
      let dicts = _.uniq(EventBus.res.docs.map(doc => { return doc.dict }))
      // log('DDo', docs)
      log('DDi', dicts)
      // let gdocs = EventBus.res.gdocs.map(gd => { return gd.dbns })
      // let docs = []
      // gdocs.forEach(gdoc => {
      //   for (let dbn in gdoc) {
      //     let value = gdoc[dbn]
      //     docs.push(value)
      //   }
      // })
      // docs = _.flatten(docs)
      // log('rec_F', docs)

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
