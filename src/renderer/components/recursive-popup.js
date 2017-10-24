//

import {log, q, segs2dict} from '../utils'
import { EventBus } from './bus'
export default {
  name: 'recursive-popup',
  props: ['segs', 'coords'],
  data: function () {
    return {
      dictsegs: null,
      // seghtml: '',
      dict: ''
    }
  },
  watch: {
    segs: function (segs) {
      // log('segs', segs)
      let dictsegs = (segs) ? segs.map(seg => { return seg.dict }) : []
      this.dictsegs = dictsegs
      let osegs = q('.segs')
      osegs.res = {segs: segs}
      placePopup(this.coords, osegs)
    }
  },
  // this.$emit('dictg', {seg: 'kukuseg', data: 'kukudata'})
  // let data = {seg: 'kukuseg', data: 'kukudata'}
  // log('--> event:', segs)
  // let seg = ev.target.textContent
  // let data = {seg: seg, segs: segs}
  // this.$parent.$options.methods.showDict(ev)
  // log('--> event:')
  methods: {
    showSegg: function (ev) {
      let osegs = q('.segs')
      let segs = osegs.res.segs
      let seg = ev.target.textContent
      let dict = segs2dict(seg, segs)
      EventBus.$emit('show-dict', dict)
    }
  }
}

function placePopup (coords, el) {
  var top = [coords.top, 'px'].join('')
  var left = [coords.left, 'px'].join('')
  el.style.top = top
  el.style.left = left
}
