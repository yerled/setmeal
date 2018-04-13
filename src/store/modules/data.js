import {convertSize} from '../../utils'

export default {
  state: {
    initializedFlag: {
      flavor: false,
      line: false,
      product: false,
    },
    flavors: [],
    lines: [],
    products: [],
  },
  getters: {
    flavors (state) {
      return state.flavors.filter(e => {
        return !~e.name.indexOf('db_')
      }).sort((a, b) => {
        return a.vcpus - b.vcpus || a.ram - b.ram
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
    volumeTypeList () {
      return ['ssd', 'sata']
    },
    lineList (state) {
      return state.lines
    },
    productList (state) {
      return state.products.map(e => {
        return {
          name: e.name,
          unit: e.unit,
          unit_price: e.unit_price,
        }
      })
    },
  },
  mutations: {
    updateInitializedFlag (state, name) {
      console.log('updateInitializedFlag:' + name)
      state.initializedFlag[name] = true
    },
    updateFlavors (state, flavors) {
      console.log(flavors)
      state.flavors = flavors
    },
    updateLines (state, list) {
      state.lines = list
    },
    updateProducts (state, list) {
      state.products = list
    },
  },
  actions: {
    INIT_DATA ({dispatch}) {
      dispatch('INIT_FLAVOR')
      dispatch('INIT_LINE')
      dispatch('INIT_PRODUCT')
    },
    INIT_FLAVOR ({commit}) {
      window.axios.get('/os/compute/v2/f0026604054c48d6893c24665c717e58/flavors/detail').then(res => {
        commit('updateFlavors', res.data.flavors)
        commit('updateInitializedFlag', 'flavor')
      }).catch(err => {
        console.log(err)
      })
    },
    INIT_LINE ({commit}) {
      window.axios.all([
        window.axios.get('/os/network/v2.0/networks?router%3Aexternal=True'),
        window.axios.get('/os/network/v2.0/subnets'),
      ]).then(window.axios.spread((networkRES, subnetRES) => {
        let network_id = networkRES.data.networks[0] && networkRES.data.networks[0].id
        let set = new Set()
        subnetRES.data.subnets.forEach(e => {
          if (e.network_id === network_id) { // 此处还需要根据配置项UOS.env.floatingIpDisabledCidr来过滤
            set.add(e.name)
          }
        })
        commit('updateLines', Array.from(set).map(name => ({name})))
        commit('updateInitializedFlag', 'line')
      })).catch(err => {
        console.log(err)
      })
    },
    INIT_PRODUCT ({commit}) {
      window.axios.get('/us/bill/v2/products/detail').then(res => {
        commit('updateProducts', res.data.products)
        commit('updateInitializedFlag', 'product')
      }).catch(err => {
        console.log(err)
      })
    },
  }
}
