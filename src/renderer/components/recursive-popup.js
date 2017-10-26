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
      segs: null,
      cl: null
    }
  },
  methods: {
    showPopup: function (data) {
      this.cl = data.cl
      log('RECU->', EventBus.res[data.cl])
      let dicts = _.uniq(EventBus.res[data.cl].docs.map(doc => { return doc.dict }))

      let segs = segmenter(data.seg, dicts)
      // log('SS', segs)
      this.segs = segs.map(s => { return s.seg })

      let osegs = q('.segs')
      placePopup(data.coords, osegs)
    },

    showDict: function (ev) {
      let seg = ev.target.textContent
      // let cl = findAncestor(ev.target, 'cl')
      // log('====FROMDICT', cl)
      // ах ты ёшкин кот, это не предок
      // let clkey = cl.textContent
      let data = {seg: seg, cl: this.cl}
      EventBus.$emit('show-dict', data)
    }
  }
}

function findAncestor (el, cls) {
  while ((el = el.parentElement) && !el.classList.contains(cls));
  return el;
}
