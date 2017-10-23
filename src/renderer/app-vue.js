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
      // showDict: true,
      showAmbis: false,
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
    // EventBus.$on('i-got-clicked', data => {
    //   console.log('nice, nice - app-vue:', data)
    // })
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
        this.recsegs = null
        let seg = ev.target.textContent
        log('_SEG_', seg)
        let clause = ev.target.parentNode // q('.clause')
        log('_CLAUSE_', clause)
        // log('_SGS_1_', clause.res)
        // log('_SGS_2_', clause.parentNode.res)
        // clause.classList.remove('clause')
        // HERE: должны быть данные для рекурсии тоже, вилка получить segs - и - dict?
        if (!clause || !clause.res || !clause.res.segs) return
        let segs = clause.res.segs
        let dict = segs2dict(seg, segs)
        EventBus.$emit('i-got-clicked', dict)

        // let dict = _.find(segs, (d) => { return d.dict === seg })
        // log('DICT:', dict)
        // for (let dbn in dict.dbns) {
        //   let dns = dict.dbns[dbn]
        //   let simps = _.compact(_.uniq(_.flatten(dns.map(dn => { return dn.docs.map(d => { return d.simp }) }))))
        //   let trads = _.compact(_.uniq(_.flatten(dns.map(dn => { return dn.docs.map(d => { return d.trad }) }))))
        //   // log('SIMPS', simps)
        //   // log('TRADS', trads, trads.length)
        //   if (trads.length && simps.length && simps.toString() !== trads.toString()) {
        //     dict.other = (simps.includes(dict.dict)) ? ['trad:', trads].join(' ') : ['simp:', simps].join(' ')
        //     // log('OTHER', dict.other)
        //   }
        // }
        // // this.showDict = true

        // this.odict = dict
      }
    },

    showDict(data) {
      log('DATA=', data)
      let dict = _.find(data.segs, (d) => { return d.dict === data.seg })
      log('DICT=:', dict)
      for (let dbn in dict.dbns) {
        let dns = dict.dbns[dbn]
        let simps = _.compact(_.uniq(_.flatten(dns.map(dn => { return dn.docs.map(d => { return d.simp }) }))))
        let trads = _.compact(_.uniq(_.flatten(dns.map(dn => { return dn.docs.map(d => { return d.trad }) }))))
        // log('SIMPS=', simps)
        // log('TRADS=', trads, trads.length)
        if (trads.length && simps.length && simps.toString() !== trads.toString()) {
          dict.other = (simps.includes(dict.dict)) ? ['trad:', trads].join(' ') : ['simp:', simps].join(' ')
          // log('OTHER', dict.other)
        }
      }
      this.odict = dict
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
        // this.showRec = false
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

ipcRenderer.on('segs', function (event, res) {
  log('_RES_:', res)
  let clause = q('.clause')
  // log('_CLAUSE_:', clause)
  if (!clause) return

  clause.textContent = ''
  if (clause.res) return
  clause.res = res
  // let aaa = span('>|<')
  // clause.appendChild(aaa)

  // let count = clause.childElementCount
  let dicts = res.segs.map((s) => { return s.dict })
  dicts.forEach((d) => {
    let spn = span(d)
    spn.classList.add('seg')
    clause.appendChild(spn)
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
