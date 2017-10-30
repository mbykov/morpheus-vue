//

import { EventBus } from './bus.js'
import {log, q} from '../utils'
import _ from 'lodash'

let fs = require('fs');
let path = require('path');


export default {
  name: 'hanzi',
  created () {
    // EventBus.$on('show-recursive', data => {
      // log('=== hanzi-recu', data)
    // })
    EventBus.$on('show-hanzi', data => {
      this.showHanzi(data)
    })
    // EventBus.$on('show-hanzi', data => {
      // log('HANZI VUE')
    // })
  },
  data: function () {
    return {
      svg: 'svg'
    }
  },
  methods: {
    showHanzi: function (data) {
      log('== ответ hanzi', data)

      let hanzipath = path.join(__dirname, './hanzi.svg');
      let html = fs.readFileSync(hanzipath,'utf8').trim();
      log('HTML', html)

      // let svg = require('./hanzi.svg')
      // log('== svg', svg)
      var parser = new DOMParser();
      var doc = parser.parseFromString(html, "image/svg+xml");
      let el = q('#hanzi')
      // el.appendChild(doc)
      // error on line 1 at column 1: Document is empty

      el.appendChild(
        el.ownerDocument.importNode(doc.documentElement, true)
      )
      // frame.innerHTML = svg
      // this.svg = svg
    }
  }
}

let drawSVG = function(svgStr) {
  var parser = new DOMParser();
  var dom = parser.parseFromString(svgStr, "text/xml");
  document.getElementById('hanzi').appendChild(dom.documentElement);
}
