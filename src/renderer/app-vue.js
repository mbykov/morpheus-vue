//

import AmbisPopup from '@/components/AmbisPopup'
import RecursivePopup from '@/components/RecursivePopup'
import Dicts from '@/components/Dicts'
import _ from 'lodash'
import {log, q, qs} from './utils'
import 'han-css/dist/han.css'
import {ipcRenderer} from 'electron'

import Split from 'split.js'

export default {
  name: 'electron-vue',
  data: function () {
    return {
      showDict: true,
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
        let cls = qs('.clause')
        cls.forEach(cl => { cl.classList.remove('clause') })
        ev.target.classList.add('clause')
        let data = ev.target.textContent
        data = data.replace('。', '')
        ipcRenderer.send('data', data)
      } else if (ev.target.classList.contains('seg')) {
        // this.showDict = false
        let seg = ev.target.textContent
        // log('_SEG_', seg)
        let clause = ev.target.parentNode // q('.clause')
        // log('_CLAUSE_', clause)
        // clause.classList.remove('clause')
        if (!clause || !clause.res || !clause.res.segs) return
        let segs = clause.res.segs
        let dict = _.find(segs, (d) => { return d.dict === seg })
        // log('DICT:', dict)
        for (let dbn in dict.dbns) {
          let dns = dict.dbns[dbn]
          let simps = _.compact(_.uniq(_.flatten(dns.map(dn => { return dn.docs.map(d => { return d.simp }) }))))
          let trads = _.compact(_.uniq(_.flatten(dns.map(dn => { return dn.docs.map(d => { return d.trad }) }))))
          // log('SIMPS', simps)
          // log('TRADS', trads, trads.length)
          if (trads.length && simps.length && simps.toString() !== trads.toString()) {
            dict.other = (simps.includes(dict.dict)) ? ['trad:', trads].join(' ') : ['simp:', simps].join(' ')
            // log('OTHER', dict.other)
          }
        }
        this.showDict = true
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
// function showDict (dict) {
//   log('SHOW D:', dict)

// }
