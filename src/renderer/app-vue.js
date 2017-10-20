//

import AmbisPopup from '@/components/AmbisPopup'
import RecursivePopup from '@/components/RecursivePopup'
import Dicts from '@/components/Dicts'
import _ from 'lodash'
import {log, q} from './utils'
import 'han-css/dist/han.css'
import {ipcRenderer} from 'electron'

import Split from 'split.js'

export default {
  name: 'electron-vue',
  data: function () {
    return {
      showRec: false,
      showAmbis: false,
      odict: ''
    }
  },
  components: {
    AmbisPopup,
    RecursivePopup,
    Dicts
  },

  created () {
    this.setGrid()
  },

  methods: {
    setGrid () {
      // let that = this
      this.$nextTick(function () {
        Split(['#text', '#results'], {
          sizes: [60, 40],
          cursor: 'col-resize',
          minSize: [0, 0]
        })
      })
    },
    showSeg (ev) {
      if (ev.target.nodeName !== 'SPAN') return
      if (ev.target.classList.contains('cl')) {
        log('CL', ev.target.textContent)
        // let count = ev.target.childElementCount
        ev.target.classList.add('clause')
        let data = ev.target.textContent
        ipcRenderer.send('data', data)
      } else if (ev.target.classList.contains('seg')) {
        let seg = ev.target.textContent
        log('SEG', seg)
        let clause = q('.clause')
        if (!clause) return
        let res = clause.res.segs
        // log('RES:::', res)
        let dict = _.find(res, (d) => { return d.dict === seg })
        // showDict(dict)
        this.odict = dict
        this.showRec = false
      }
    },
    hideSeg (ev) {
      if (ev.target.classList.contains('text')) {
        this.showRec = false
      }
    }
  }
}

// case 民事案件 mínshì ànjiàn civil case / 刑事案件 xíngshì ànjiàn c
function showDict (dict) {
  log('SHOW D:', dict)

}
