import {shell} from 'electron'

export function unihan (sym, seg) {
  let codepoint = seg.charCodeAt(0).toString(16)
  if (sym === 'c' || sym === 'n') codepoint = seg
  let urls = {
    u: 'http://www.unicode.org/cgi-bin/GetUnihanData.pl?codepoint=',
    g: 'http://www.unicode.org/cgi-bin/GetUnihanData.pl?codepoint=',
    c: 'http://www.chise.org/est/view/char/',
    s: ' http://www2.dhii.jp:3000/?char=',
    n: 'http://ntireader.org/#?text='
  }
  let unihan = urls[sym]
  // log(sym, codepoint, unihan)
  let href = [unihan, codepoint].join('')
  shell.openExternal(href)
}
