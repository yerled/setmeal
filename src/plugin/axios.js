import axios from 'axios'
import { Notification } from 'element-ui'

axios.interceptors.response.use(res => {
  return res
}, err => {
  console.dir(err)
  let code = err.response.status
  if (code === 401) {
    window.location.href = '/logout'
    return
  }
  if (code === 202) {
    return
  }
  if (code >= 500) {
    if (window.UOS_LANG === 'en') {
      Notification('System error. Please contact the administrator.')
    } else {
      Notification('系统错误，请联系管理员。')
    }
    console.log(err)
  }
})

if (typeof window.axios === 'undefined') {
  window.axios = axios

  // for dev
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
}
