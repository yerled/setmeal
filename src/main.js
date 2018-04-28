// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Element from 'element-ui'
import VueI18n from 'vue-i18n'
import messages from './i18n'
import store from './store'

// import 'element-ui/lib/theme-chalk/index.css'
import './theme/index_44afbc.css'
import 'vue2-animate/dist/vue2-animate.min.css'
import './styles/index.less'
import './iconfont'
import './components'
import './filter'
import './plugin'
import './adaptionGHXW'

Vue.config.productionTip = false
Vue.use(Element, {size: 'small'})
Vue.use(VueI18n)

let locale = 'en'
if (window.UOS && window.UOS.t && window.UOS.t.LANG === 'en-US') {
  window.UOS_LANG = 'en'
  locale = 'en'
}
const i18n = new VueI18n({
  locale,
  messages
})
/* eslint-disable no-new */
window.yerled = new Vue({
  el: '#main_content',
  router,
  i18n,
  store,
  components: { App },
  template: '<App/>'
})

window.yerled.$store.dispatch('INIT_DATA')
