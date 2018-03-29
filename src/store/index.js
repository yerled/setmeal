import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    formLabelWidth: '100px',
  },
  modules,
  strict: process.env.NODE_ENV !== 'production',
})

export default store
