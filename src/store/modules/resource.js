import {convertSize} from '../../utils'

export default {
  state: {
    flavors: [],
  },
  getters: {
    flavors (state) {
      return state.flavors.filter(e => {
        return !~e.name.indexOf('db_')
      }).sort((a, b) => {
        return a.vcpus - b.vcpus || a.ram - a.ram
      })
    },
    flavorList (state, getters) {
      return getters.flavors.map(({id, name, vcpus, ram}) => {
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
    updateFlavors (state, flavors) {
      state.flavors = flavors
    },
  },
  actions: {
    SelectFlavors ({commit}) {
      return window.axios.get('/os/compute/v2/f0026604054c48d6893c24665c717e58/flavors/detail').then(res => {
        commit('updateFlavors', res.data.flavors)
      }).catch(err => {
        console.log(err)
      })
    },
  }
}
