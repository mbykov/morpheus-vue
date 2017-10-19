//

import AmbisPopup from '@/components/AmbisPopup'
import RecursivePopup from '@/components/RecursivePopup'

import Split from 'split.js'

export default {
  name: 'electron-vue',
  components: {
    AmbisPopup,
    RecursivePopup
  },

  created () {
    this.setGrid()
  },

  methods: {
    setGrid() {
      let that = this
      this.$nextTick(function () {
        Split(['#text', '#results'], {
          sizes: [60, 40],
          cursor: 'col-resize',
          minSize: [0, 0]
        })
      })
    },
  }
}
