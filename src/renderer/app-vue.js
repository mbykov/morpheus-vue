//

import AmbisPopup from '@/components/AmbisPopup'
import RecursivePopup from '@/components/RecursivePopup'
import Dicts from '@/components/Dicts'
import Hanzi from '@/components/Hanzi'
import _ from 'lodash'
import {log, q, qs, empty, create, span} from './utils'
import 'han-css/dist/han.css'
import {ipcRenderer} from 'electron'

import {zh} from '../../../speckled-band'
import {segmenter} from '../../../segmenter'

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
      ohanzi: '',
      odict: ''
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
    ipcRenderer.on('hanzi', function (event, doc) {
      log('IPC SVG', doc)
      // TODO - сделать реальные данные из main, вызвать компонент
    })
    // EventBus.$on('show-ambis', data => {
      // this.ambis = true
    // })
    EventBus.$on('show-recursive', data => {
      this.recsegs = true
    })
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
    // =====>>> 你们都用wiki吗？====>>> BUG
    // 我们现在没有钱。
    showDict (ev) {
      this.ambis = null
      this.recsegs = null
      // log('EV', ev.target.classList)
      if (ev.target.nodeName !== 'SPAN') return
      // let cl = findAncestor(ev.target, 'cl')
      // let clkey = cl.textContent
      // log('=cl=', cl)
      if (ev.target.classList.contains('cl')) {
        // либо пересчитывать, либо запоминать каждую клаузу - потому что новая затирает .res сейчас
        log('CL', ev.target.textContent)
        let cls = qs('.clause')
        cls.forEach(cl => { cl.classList.remove('clause') })
        ev.target.classList.add('clause')
        let data = ev.target.textContent
        ipcRenderer.send('data', data)
      } else if (ev.target.classList.contains('ambi')) {
        // log('AMBIS', ev.target)
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
      } else if (ev.target.classList.contains('seg')) {
        let cl = findAncestor(ev.target, 'cl')
        let clkey = cl.textContent
        let seg = ev.target.textContent
        let data = {seg: seg, cl: clkey}
        EventBus.$emit('show-dict', data)
      }
    },

    showRec (ev) {
      if (ev.target.nodeName !== 'SPAN') return
      if (!ev.target.classList.contains('seg')) return
      // log('REC-CLICK', ev.target)
      let seg = ev.target.textContent
      if (seg.length === 1) {
        ipcRenderer.send('hanzi', seg)
        // TODO: это унести в ответ ipc, и реальные data
        // EventBus.$emit('show-hanzi', seg)
        log('svg click')
      }
      if (seg.length < 2) return
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

function getCoords (el) {
  let rect = el.getBoundingClientRect()
  return {top: rect.top + 28, left: rect.left}
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

// строка сегментов - spans
ipcRenderer.on('data', function (event, data) {
  log('_RES_:', data.str, data.res)
  let clause = q('.clause')
  if (!clause) return
  // есть еще гипотетический случай, когда сумма segs не полная. Как обработать? Какой-то no-resut нужен
  let docs = _.flatten(data.res.map(d => { return d.docs }))
  let dicts = _.uniq(_.flatten(data.res.map(d => { return d._id })))
  let segs = segmenter(data.str, dicts)
  // log('SGS', segs)
  let key = clause.textContent
  // log('KEY', key)

  // small 案件案件刑戋戔刑事 jiān. 刑事案件
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
  }
  text.innerHTML = html
  // closePopups()
})

// wtf?
function findAncestor (el, cls) {
  while ((el = el.parentElement) && !el.classList.contains(cls));
  return el;
}
