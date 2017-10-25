//

import AmbisPopup from '@/components/AmbisPopup'
import RecursivePopup from '@/components/RecursivePopup'
import Dicts from '@/components/Dicts'
import _ from 'lodash'
import {log, q, qs, empty, create, span, segs2dict} from './utils'
import 'han-css/dist/han.css'
import {ipcRenderer} from 'electron'

import {zh} from '../../../speckled-band'
import {segmenter} from '../../../segmenter'
// import { EventBus } from './components/bus.js'

const clipboard = require('electron-clipboard-extended')

import Split from 'split.js'
let split
import code from './sections/code.html'
import about from './sections/about.html'
import ecbt from './sections/ecbt.html'
import contacts from './sections/contacts.html'
import screencast from './sections/screencast.html'
import acknowledgements from './sections/acknowledgements.html'
import help from './sections/help.html'
import { EventBus } from './components/bus'

export default {
  name: 'electron-vue',
  data: function () {
    return {
      recsegs: null,
      reccoords: null,
      acoords: {},
      // ambisegs: false,
      ambis: '',
      showrec: true,
      odict: ''
    }
  },
  components: {
    Dicts,
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
        split = Split(['#text', '#results'], {
          sizes: [60, 40],
          cursor: 'col-resize',
          minSize: [0, 0]
        })
      })
    },
    // 我们现在没有钱。
    showDict (ev) {
      this.ambis = null
      this.recsegs = null
      if (ev.target.nodeName !== 'SPAN') return

      if (ev.target.classList.contains('cl')) {
        log('CL', ev.target.textContent)
        let cls = qs('.clause')
        cls.forEach(cl => { cl.classList.remove('clause') })
        ev.target.classList.add('clause')
        let data = ev.target.textContent
        ipcRenderer.send('data', data)

      } else if (ev.target.classList.contains('ambi')) {
        log('AMBIS', ev.target)
        let clause = ev.target.parentNode
        let seg = ev.target.textContent
        // log('_CLAUSE_', clause)
        if (!clause || !clause.res || !clause.res.segs) return
        let segs = clause.res.segs
        let ambis = _.find(segs, (ambi) => { return ambi.seg === seg})
        if (!ambis) return
        // log('_a_segs_', segs)
        log('ambis:', ambis)
        // let dict = segs2dict(seg, segs)
        this.ambis = ambis
        this.acoords = getCoords(ev.target)

      } else if (ev.target.classList.contains('seg')) {
        let seg = ev.target.textContent
        log('_SEG_', seg)
        let clause = ev.target.parentNode
        // log('_CLAUSE_', clause)
        if (!clause || !clause.res || !clause.res.segs) return
        let segs = clause.res.segs
        let dict = segs2dict(seg, segs)
        EventBus.$emit('show-dict', dict)
      }
    },

    showRec (ev) {
      if (ev.target.nodeName !== 'SPAN') return
      if (!ev.target.classList.contains('seg')) return
      // log('CLICK', ev.target)
      let data = ev.target.textContent
      if (data.length < 2) return
      let parent = ev.target.parentNode
      // log('CLICK_gd', parent.res.gdocs)

      let gdocs = parent.res.gdocs.map(gd => { return gd.dbns})
      // log('GDOCS', gdocs)
      let docs = []
      gdocs.forEach(gdoc => {
        for (let dbn in gdoc) {
          let value = gdoc[dbn]
          // log('V', value)
          docs.push(value)
        }
      })
      // log('DOCS', docs)
      docs = _.flatten(docs)
      // log('DOCS-F', docs)

      let segmented = segmenter(data, docs)
      this.recsegs = segmented.segs
      log('SGM', segmented.segs)
      this.reccoords = getCoords(ev.target)
    },
    hideSeg (ev) {
      if (ev.target.classList.contains('text')) {
      }
    }
  }
}


function getCoords(el) {
  let rect = el.getBoundingClientRect();
  return {top: rect.top+28, left: rect.left};
}

// 根據中央社報導，童子賢今天出席科技部記者會，
clipboard
  .on('text-changed', () => {
    let currentText = clipboard.readText()
    // log('TEXT:', currentText)
    let pars = zh(currentText)
    if (!pars) return
    split.setSizes([60, 40])
    let text = q('#text')
    empty(text)
    pars.forEach((cls) => {
      let par = create('p')
      cls.forEach((cl) => {
        let spn = span(cl.text)
        spn.classList = (cl.type === 'cl') ? 'cl' : 'sp'
        par.appendChild(spn)
      })
      text.appendChild(par)
    })
    log('PARS:', pars)
  })
  .startWatching()

ipcRenderer.on('before-quit', function (event) {
  clipboard.off('text-changed')
  // clipboard.stopWatching()
})

ipcRenderer.on('clause', function (event, res) {
  log('_RES-SEGS_:', res)
  let clause = q('.clause')
  // log('_CLAUSE_:', clause)
  if (!clause) return
  clause.textContent = ''
  // есть еще гипотетический случай, когда строка не полная. Как обработать? Какой-то no-resut нужен

  if (clause.res) return
  clause.res = res

  res.segs.forEach(s => {
    let spn
    if (s.dict) {
      spn = span(s.dict)
      spn.classList.add('seg')
      clause.appendChild(spn)
    } else {
      let ds = s.ambis[0].map(a => {return a.dict})
      spn = span(ds.join(''))
      spn.classList.add('ambi')
      clause.appendChild(spn)
    }
  })
})

ipcRenderer.on('section', function (event, name) {
  split.setSizes([100, 0])
  let text = q('#text')
  empty(text)
  let html
  switch (name) {
  case 'about':
    html = about
    break
  case 'ecbt':
    html = ecbt
    break
  case 'code':
    html = code
    break
  case 'contacts':
    html = contacts
    break
  case 'screencast':
    html = screencast
    break
  case 'acknowledgements':
    html = acknowledgements
    break
  case 'help':
    html = help
    break
  }
  text.innerHTML = html
  // closePopups()
})
