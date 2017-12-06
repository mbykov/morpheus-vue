//

import {log} from '../utils'
import {ipcRenderer} from 'electron'
const morpheuspng = 'static/256x256.png'

export default {
  name: 'title',
  data: function () {
    return {
      msrc: morpheuspng
    }
  },
  created () {
    // log('TITLE-VUE')
    let that = this
    // ipcRenderer.on('status', function (event, message) {
    //   log('TITLE-STATUS', message)
    //   that.mess = message
    // })
    // router.push({path: 'title', query: {title: 'title'}})
  }
}
