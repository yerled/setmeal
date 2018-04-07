import Vue from 'vue'
import Vuex from 'vuex'
import {convertSize} from '../utils'
import modules from './modules'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    formLabelWidth: '100px',
    detailVisible: false,
    detail: {},
    flavors: [{
      id: 'flavor1',
      name: 'flavorName1',
      vcpus: 1,
      ram: 512,
    }, {
      id: 'flavor2',
      name: 'flavorName2',
      vcpus: 1,
      ram: 1024,
    }, {
      id: 'flavor3',
      name: 'flavorName3',
      vcpus: 2,
      ram: 2048,
    }, {
      id: 'flavor4',
      name: 'flavorName4',
      vcpus: 3,
      ram: 4096,
    }],
    setmealList: [],
  },
  getters: {
    flavors: state => state.flavors,
    flavorList (state) {
      return state.flavors.map(({id, name, vcpus, ram}) => {
        let __desc = `${vcpus}vCPU/${convertSize(ram, 'M')}`
        return {
          flavor_id: id,
          vcpus,
          ram,
          name,
          __desc,
          __nameAndDesc: `${name} (${__desc})`,
        }
      })
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
