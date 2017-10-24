//

import {log, q, segs2dict, placePopup} from '../utils'

export default {
  name: 'ambis-popup',
  props: ['ambis', 'coords'],
  watch: {
    ambis: function (ambis) {
      let oambis = q('.ambis')
      log('OAM', oambis)
      log('OAMC', this.coords)
      // osegs.res = {segs: segs}
      placePopup(this.coords, oambis)
    }
  },
  // data: function () {
  //   return {
  //     ambis: ''
  //   }
  // },
  // watch: {
  //   ambis: function (ambis) {
  //     log('AMBIS_', ambis)
  //     // let dictsegs = (segs) ? segs.map(seg => { return seg.dict }) : []
  //     // this.popambis = ambis
  //     // let osegs = q('.segs')
  //     // osegs.res = {segs: segs}
  //     // placePopup(this.coords, osegs)
  //   }
  // },
  components: {},
  methods: {
  }
}
