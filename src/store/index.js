import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    detailVisible: false,
    detail: {},
  },
  mutations: {
    updateDetail (state, detail) {
      state.detail = detail
    },
    toggleDetailVisible (state) {
      state.detailVisible = !state.detailVisible
    },
  },
  modules,
  strict: process.env.NODE_ENV !== 'production',
})

export default store
