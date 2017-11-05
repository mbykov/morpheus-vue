//

import { EventBus } from './bus.js'
// import {log} from '../utils'
// import _ from 'lodash'

let paths = []

export default {
  name: 'hanzi',
  created () {
    EventBus.$on('show-hanzi', doc => {
      this.showHanzi(doc)
    })
  },
  data: function () {
    return {
      paths: paths,
      hanzi: {pinyin: []}
    }
  },
  methods: {
    showHanzi: function (doc) {
      if (doc) this.hanzi = doc
    }
  }
}

// let drawSVG = function(svgStr) {
//   var parser = new DOMParser();
//   var dom = parser.parseFromString(svgStr, "text/xml");
//   document.getElementById('hanzi').appendChild(dom.documentElement);
// }
