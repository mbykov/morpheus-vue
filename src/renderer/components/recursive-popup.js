//

import _ from 'lodash'
import {log, q, segs2dict, placePopup} from '../utils'
import { EventBus } from './bus'
import {segmenter} from '../../../../segmenter'

export default {
  name: 'recursive-popup',
  created () {
    EventBus.$on('show-recursive', data => {
      // log('SEG', data.seg)
      // log('CO', data.coords)
      this.showPopup(data)
    })
  },
  // props: ['segs', 'coords'],
  data: function () {
    return {
      // dictsegs: null
      segs: null
    }
  },
  // watch: {
  //   segs: function (segs) {
  //     // log('segs', segs)
  //     let dictsegs = (segs) ? segs.map(seg => { return seg.dict }) : []
  //     this.dictsegs = dictsegs
  //     let osegs = q('.segs')
  //     osegs.res = {segs: segs}
  //     placePopup(this.coords, osegs)
  //   }
  // },
  methods: {
    showPopup: function (data) {
      let gdocs = EventBus.res.gdocs.map(gd => { return gd.dbns})
      let docs = []
      gdocs.forEach(gdoc => {
        for (let dbn in gdoc) {
          let value = gdoc[dbn]
          docs.push(value)
        }
      })
      docs = _.flatten(docs)
      // log('DOCS-F', docs)

      let segmented = segmenter(data.seg, docs)
      this.segs = segmented.segs.map(seg => { return seg.dict })
      let osegs = q('.segs')
      placePopup(data.coords, osegs)

      EventBus.res.recsegs = segmented.segs
    },

    showDict: function (ev) {
      let seg = ev.target.textContent
      EventBus.$emit('show-dict', seg)
    }
  }
}
