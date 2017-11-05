//

import AmbisPopup from '@/components/AmbisPopup'
import RecursivePopup from '@/components/RecursivePopup'
import Dicts from '@/components/Dicts'
import Hanzi from '@/components/Hanzi'

import _ from 'lodash'
import {log, q, qs, empty, create, span} from './utils'
import 'han-css/dist/han.css'
import {ipcRenderer} from 'electron'

import Split from 'split.js'
import code from './sections/code.html'
import about from './sections/about.html'
import ecbt from './sections/ecbt.html'
import contacts from './sections/contacts.html'
import screencast from './sections/screencast.html'
import acknowledgements from './sections/acknowledgements.html'
import help from './sections/help.html'
import tests from './sections/tests.html'
import { EventBus } from './components/bus'
// import { morpheuspng } from '@static/morpheus.png'
const morpheuspng  = 'static/256x256.png'

      // import {segmenter} from '../../../segmenter'
// import {segmenter} from 'recursive-segmenter'
let segmenter = require('recursive-segmenter')
// import {zh} from '../../../speckled-band'
let zh = require('speckled-band')

const clipboard = require('electron-clipboard-extended')
let split

let vm = {
  name: 'morpheus-vue',
  data: function () {
    return {
      msrc: morpheuspng,
      recsegs: null,
      reccoords: null,
      acoords: {},
      ambis: '',
      showrec: true,
      ohanzi: '',
      odict: true
    }
  },

  components: {
    Dicts,
    Hanzi,
    AmbisPopup,
    RecursivePopup
  },

  created () {
    this.setGrid()
    let that = this
    ipcRenderer.on('hanzi', function (event, doc) {
      that.odict = false
      that.ohanzi = true
      EventBus.$emit('show-hanzi', doc)
    })
    EventBus.$on('show-dict', data => {
      this.odict = true
      this.ohanzi = false
    })
    EventBus.$on('show-recursive', data => {
      this.recsegs = true
    })
    EventBus.$on('close-popups', data => {
      this.ambis = false
      this.recsegs = false
      this.ohanzi = false
      this.odict = false
    })
    // document.body.addEventListener('scroll', this.onWheel)
    // document.body.addEventListener('scroll', log('---->>>'))
  },
  // destroyed () {
  //   document.body.removeEventListener('scroll', this.onWheel)
  // },

  methods: {
    setGrid () {
      // let that = this
      this.$nextTick(function () {
        split = Split(['#text', '#results'], {
          sizes: [100, 0],
          cursor: 'col-resize',
          minSize: [0, 0]
        })
      })
    },
    // =====>>> 你们都用wiki吗？====>>> BUG
    // 我们现在没有钱。
    showDict (ev) {
      if (ev.target.nodeName !== 'SPAN') return
      if (ev.shiftKey) return
      this.ambis = false
      this.recsegs = false
      this.ohanzi = false
      if (ev.target.classList.contains('cl')) {
        let cls = qs('.clause')
        cls.forEach(cl => { cl.classList.remove('clause') })
        ev.target.classList.add('clause')
        let data = ev.target.textContent
        ipcRenderer.send('data', data)
      } else if (ev.target.classList.contains('ambi')) {
        this.ambis = true
        let cl = findAncestor(ev.target, 'cl')
        let clkey = cl.textContent
        let seg = ev.target.textContent
        let coords = getCoords(ev.target)
        let data = {seg: seg, coords: coords, ambis: ev.target.ambis, cl: clkey}
        EventBus.$emit('show-ambis', data)
      } else if (ev.target.classList.contains('hole')) {
        let seg = ev.target.textContent
        let data = {seg: seg, cl: 'no-result', hole: true}
        EventBus.$emit('show-dict', data)
        this.odict = true
      } else if (ev.target.classList.contains('seg')) {
        this.odict = true
        let cl = findAncestor(ev.target, 'cl')
        let clkey = cl.textContent
        let seg = ev.target.textContent
        let data = {seg: seg, cl: clkey}
        EventBus.$emit('show-dict', data)
      }
    },

    onWheel (ev) {
      log('scroll', ev.deltaY)
      let isShift = !!ev.shiftKey;
      if (!isShift) return
      let oRes = q('#results')
      oRes.scrollTop += ev.deltaY
      let oHanzi = q('#hanzi')
      oHanzi.scrollTop += ev.deltaY
      ev.preventDefault()
    },

    showRec (ev) {
      if (ev.shiftKey) return
      if (ev.target.nodeName !== 'SPAN') return
      if (!ev.target.classList.contains('seg')) return
      let seg = ev.target.textContent
      if (seg.length === 1) {
        ipcRenderer.send('hanzi', seg)
        this.odict = false
        this.ohanzi = true
      }
      if (seg.length < 2) return
      // TODO: next level
      this.recsegs = true
      let cl = findAncestor(ev.target, 'cl')
      let clkey = cl.textContent
      let coords = getCoords(ev.target)
      let data = {seg: seg, coords: coords, cl: clkey}
      EventBus.$emit('show-recursive', data)
    },

    hideSeg (ev) {
      if (ev.target.classList.contains('text')) {
      }
    }
  }
}

export default vm

function getCoords (el) {
  let rect = el.getBoundingClientRect()
  return {top: rect.top + 28, left: rect.left}
}

// 根據中央社報導，童子賢今天出席科技部記者會，
clipboard
  .on('text-changed', () => {
    EventBus.$emit('close-popups')

    let currentText = clipboard.readText()
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
  })
  .startWatching()

ipcRenderer.on('before-quit', function (event) {
  clipboard.off('text-changed')
  // clipboard.stopWatching()
})

// строка сегментов - spans
ipcRenderer.on('data', function (event, data) {
  let clause = q('.clause')
  if (!clause) return
  let docs = _.flatten(data.res.map(d => { return d.docs }))
  let dicts = _.uniq(_.flatten(data.res.map(d => { return d._id })))
  let segs = segmenter(data.str, dicts)
  let key = clause.textContent

  if (!EventBus.res) EventBus.res = {}
  EventBus.res[key] = {docs: docs, segs: segs}
  setSegs(clause, segs)
})

function setSegs (clause, segs) {
  empty(clause)
  segs.forEach(s => {
    let spn = span(s.seg)
    if (s.ambis) {
      spn.classList.add('ambi')
      spn.ambis = s.ambis
    } else if (s.hole) {
      spn.classList.add('hole')
    } else {
      spn.classList.add('seg')
    }
    clause.appendChild(spn)
  })
}

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
  case 'tests':
    html = tests
    break
  }
  text.innerHTML = html
  // closePopups()
})

// wtf?
function findAncestor (el, cls) {
  while ((el = el.parentElement) && !el.classList.contains(cls));
  return el
}
