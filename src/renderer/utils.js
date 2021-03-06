import _ from 'lodash'
var util = require('util')

export function q (sel) {
  return document.querySelector(sel)
}

export function qs (sel) {
  return document.querySelectorAll(sel)
}

export function create (tag) {
  return document.createElement(tag)
}

export function recreateDiv (sel) {
  let el = document.querySelector(sel)
  if (el) el.parentElement.removeChild(el)
  el = document.createElement('div')
  el.classList.add(sel)
  el.id = sel
  return el
}

export function recreate (element) {
  var newElement = element.cloneNode(true)
  element.parentNode.replaceChild(newElement, element)
}

// function cret (str) {
//   return document.createTextNode(str)
// }

export function span (str) {
  var oSpan = document.createElement('span')
  oSpan.textContent = str
  return oSpan
}

export function br () {
  var oBR = document.createElement('br')
  return oBR
}

export function div (str) {
  var oDiv = document.createElement('div')
  oDiv.textContent = str
  return oDiv
}

export function p (str) {
  var oDiv = document.createElement('p')
  oDiv.textContent = str
  return oDiv
}

export function empty (el) {
  while (el.hasChildNodes()) {
    el.removeChild(el.lastChild)
  }
}

export function remove (el) {
  el.parentElement.removeChild(el)
}

export function removeAll (sel) {
  let els = document.querySelectorAll(sel)
  els.forEach(el => { el.parentElement.removeChild(el) })
}

// function closeAll() {
//     words = null
//     // window.close()
//     ipcRenderer.send('sync', 'window-hide')
// }

export function findAncestor (el, cls) {
  while ((el = el.parentElement) && !el.classList.contains(cls)) {
    return el
  }
}

// export function segs2dict (seg, segs) {
//   let dict = _.find(segs, (d) => { return d.dict === seg })
//   if (!dict) {
//     return
//   }
//   for (let dbn in dict.dbns) {
//     let dns = dict.dbns[dbn]
//     let simps = _.compact(_.uniq(_.flatten(dns.map(dn => { return dn.docs.map(d => { return d.simp }) }))))
//     let trads = _.compact(_.uniq(_.flatten(dns.map(dn => { return dn.docs.map(d => { return d.trad }) }))))
//     // log('SIMPS', simps)
//     // log('TRADS', trads, trads.length)
//     if (trads.length && simps.length && simps.toString() !== trads.toString()) {
//       dict.other = (simps.includes(dict.dict)) ? ['trad:', trads].join(' ') : ['simp:', simps].join(' ')
//     }
//   }
//   return dict
// }

export function placePopup (coords, el) {
  var top = [coords.top, 'px'].join('')
  var left = [coords.left, 'px'].join('')
  el.style.top = top
  el.style.left = left
}

export function log () { console.log.apply(console, arguments) }

export function plog () {
  var vs = _.values(arguments)
  if (vs.length === 1) vs = vs[0]
  // console.log(util.inspect(vs, {showHidden: false, depth: null}))
  console.log(util.inspect(vs, {showHidden: false, depth: 3}))
}
