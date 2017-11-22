//

import {log} from '../utils'
// import router from '../router'
// import {ipcRenderer} from 'electron'
const morpheuspng = 'static/256x256.png'

export default {
  name: 'title',
  data: function () {
    return {
      msrc: morpheuspng,
      mess: null
    }
  },
  created () {
    log('TITLE CREATED')
    // let that = this
    // ipcRenderer.on('status', function (event, message) {
    //   log('M', message)
    //   that.mess = message
    // })
    // router.push({path: 'title', query: {title: 'title'}})
  }
}
