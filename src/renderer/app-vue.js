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
    EventBus.$on('show-ambis', data => {
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
      // if (EventBus.res) EventBus.res.recsegs = null // выбрать segs для dicts не из .res
      this.ambis = null
      this.recsegs = null
      if (ev.target.nodeName !== 'SPAN') return
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
        let seg = ev.target.textContent
        let coords = getCoords(ev.target)
        let data = {seg: seg, coords: coords}
        EventBus.$emit('show-ambis', data)
      } else if (ev.target.classList.contains('seg')) {
        let seg = ev.target.textContent
        EventBus.$emit('show-dict', seg)
      }
    },

    showRec (ev) {
      if (ev.target.nodeName !== 'SPAN') return
      if (!ev.target.classList.contains('seg')) return
      // log('CLICK', ev.target)
      let seg = ev.target.textContent
      if (seg.length < 2) return
      this.recsegs = true
      let coords = getCoords(ev.target)
      let data = {seg: seg, coords: coords}
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
        let text = cl.text.trim()
        let spn = span(text)
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

ipcRenderer.on('data', function (event, data) {
  log('_RES_:', data.str, data.res)
  let clause = q('.clause')
  if (!clause) return
  // есть еще гипотетический случай, когда сумма segs не полная. Как обработать? Какой-то no-resut нужен

  let docs = _.flatten(data.res.map(d => { return d.docs }))
  let dicts = _.uniq(_.flatten(data.res.map(d => { return d._id })))
  let segs = segmenter(data.str, dicts)
  log('SGS', segs)

  EventBus.res = {docs: docs, segs: segs}
  // setSegs(clause, res)
})

function setSegs (clause, res) {
  empty(clause)
  res.segs.forEach(s => {
    let spn
    if (s.dict) {
      spn = span(s.dict)
      spn.classList.add('seg')
      clause.appendChild(spn)
    } else {
      let ds = s.ambis[0].map(a => { return a.dict })
      spn = span(ds.join(''))
      spn.classList.add('ambi')
      clause.appendChild(spn)
    }
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
