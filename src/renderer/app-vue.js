//

import AmbisPopup from '@/components/AmbisPopup'
import RecursivePopup from '@/components/RecursivePopup'
import {log} from './utils'
import 'han-css/dist/han.css'
import {ipcRenderer} from 'electron'

import Split from 'split.js'

export default {
  name: 'electron-vue',
  data: function () {
    return {
      showRec: false
    }
  },
  components: {
    AmbisPopup,
    RecursivePopup
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
        let data = ev.target.textContent
        ipcRenderer.send('data', data)
      } else if (ev.target.classList.contains('seg')) {
        log('SEG', ev.target.textContent)
        this.showRec = true
      }
    },
    hideSeg (ev) {
      if (ev.target.classList.contains('text')) {
        this.showRec = false
      }
    }
  }

}
