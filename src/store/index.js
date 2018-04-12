import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    formLabelWidth: '100px',
    detailVisible: false,
    detail: {},
  },
  getters: {
    volumeTypeList () {
      return ['ssd', 'sata']
    },
    lineList () {
      return [{
        name: 'doubleLine',
      }, {
        name: '3LINE_BGP'
      }, {
        name: 'ALLLINE_BGP'
      }]
    },
  },
  mutations: {
    updateDetail (state, detail) {
      state.detail = detail
    },
    updateDetailVisible (state, visible) {
      state.detailVisible = visible
    },
  },
  modules,
  strict: process.env.NODE_ENV !== 'production',
})

export default store
