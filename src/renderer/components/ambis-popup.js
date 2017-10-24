//

import {log, q, segs2dict, placePopup} from '../utils'

log()
q()

export default {
  name: 'ambis-popup',
  props: ['ambis', 'coords'],
  data: function () {
    return {
      popambis: null
    }
  },
  watch: {
    ambis: function (ambis) {
      log('AMBIS_', ambis)
      // let dictsegs = (segs) ? segs.map(seg => { return seg.dict }) : []
      this.popambis = ambis
      // let osegs = q('.segs')
      // osegs.res = {segs: segs}
      // placePopup(this.coords, osegs)
    }
  },
  components: {},
  methods: {
  }
}
