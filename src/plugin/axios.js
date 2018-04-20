import axios from 'axios'
import { Notification } from 'element-ui'

axios.interceptors.response.use(res => {
  return res
}, err => {
  console.log('-----------------------')
  console.dir(err)
  console.log('-----------------------')
  Notification()
})

if (typeof window.axios === 'undefined') {
  window.axios = axios
  // for dev
  // window.login = function (email = 'slancer', password = 'abc123') {
  window.login = function (email = 'yerled91', password = 'lv1m#4B') {
    axios({
      url: '/login',
      method: 'post',
      'content-type': 'application/x-www-form-urlencoded',
      data: `email=${email}&password=${password}`,
    })
  }
  window.adminLogin = function (email = 'slancer', password = 'abc123') {
    axios({
      url: '/admin/login',
      method: 'post',
      'content-type': 'application/x-www-form-urlencoded',
      data: `email=${email}&password=${password}`,
    })
  }
  window.testAjax = function (url = '/os/network/v2.0/ports') {
    axios.get(url).then(res => {
      console.log('OK')
    }).catch(err => {
      console.log(err)
    })
  }
}
