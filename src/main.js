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
import './styles/index.less'
import './iconfont'
import './components'

Vue.config.productionTip = false
Vue.use(Element, {size: 'small'})
Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'zh',
  messages
})
/* eslint-disable no-new */
window.yerled = new Vue({
  el: '#app',
  router,
  i18n,
  store,
  components: { App },
  template: '<App/>'
})
