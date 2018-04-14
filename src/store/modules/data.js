import {convertSize} from '../../utils'

export default {
  state: {
    initializedFlag: {
      product: false,
      flavor: false,
      network: false,
      subnet: false,
      image: false,
      keyt: false,
    },
    products: [],
    flavors: [],
    networks: [],
    subnets: [],
    images: [],
    keyts: [],
  },
  getters: {
    productList (state) {
      return state.products.map(e => {
        return {
          name: e.name,
          unit: e.unit,
          unit_price: e.unit_price,
        }
      })
    },
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
    networkList (state) {
      return state.networks
    },
    subnetList (state) {
      return state.subnets
    },
    lineList (state, getters) {
      let network_id = getters.networkList[0] && getters.networkList[0].id
      let set = new Set()
      getters.subnetList.forEach(e => {
        if (e.network_id === network_id) { // 此处还需要根据配置项UOS.env.floatingIpDisabledCidr来过滤
          set.add(e.name)
        }
      })
      return Array.from(set).map(name => ({name}))
    },
    imageList (state) {
      return state.images
    },
    systemImageList (state) {
      return state.images.filter(e => e)
    },
    snapImageList (state) {
      return state.images.filter(e => e)
    },
    keytList (state) {
      return state.keyts.map(e => e.keypair)
    },
  },
  mutations: {
    updateInitializedFlag (state, name) {
      console.log(`${name}相关数据初始化完成`)
      state.initializedFlag[name] = true
    },
    updateProducts (state, list) {
      state.products = list
    },
    updateFlavors (state, flavors) {
      state.flavors = flavors
    },
    updateNetworks (state, list) {
      state.networks = list
    },
    updateSubnets (state, list) {
      state.subnets = list
    },
    updateImages (state, list) {
      state.images = list
    },
    updateKeyts (state, list) {
      state.keyts = list
    },
  },
  actions: {
    INIT_DATA ({dispatch}) {
      dispatch('INIT_PRODUCT')
      dispatch('INIT_FLAVOR')
      dispatch('INIT_NETWORK')
      dispatch('INIT_SUBNET')
      dispatch('INIT_IMAGE')
      dispatch('INIT_KEYT')
    },
    INIT_PRODUCT ({commit}) {
      window.axios.get('/us/bill/v2/products/detail').then(res => {
        commit('updateProducts', res.data.products)
        commit('updateInitializedFlag', 'product')
      }).catch(err => {
        console.log(err)
      })
    },
    INIT_FLAVOR ({commit}) {
      // window.axios.get('/os/compute/v2/f0026604054c48d6893c24665c717e58/flavors/detail').then(res => {
      window.axios.get('/os/compute/v2/b5112f82a3e44f908937fc1c2bd1e191/flavors/detail').then(res => {
        commit('updateFlavors', res.data.flavors)
        commit('updateInitializedFlag', 'flavor')
      }).catch(err => {
        console.log(err)
      })
    },
    INIT_NETWORK ({commit}) {
      window.axios.get('/os/network/v2.0/networks?router%3Aexternal=True').then(res => {
        commit('updateNetworks', res.data.networks)
        commit('updateInitializedFlag', 'network')
      }).catch(err => {
        console.log(err)
      })
    },
    INIT_SUBNET ({commit}) {
      window.axios.get('/os/network/v2.0/subnets').then(res => {
        commit('updateSubnets', res.data.subnets)
        commit('updateInitializedFlag', 'subnet')
      }).catch(err => {
        console.log(err)
      })
    },
    INIT_IMAGE ({commit}) {
      window.axios.get('/os/image/v2/images?limit=999').then(res => {
        commit('updateImages', res.data.images)
        commit('updateInitializedFlag', 'image')
      }).catch(err => {
        console.log(err)
      })
    },
    INIT_KEYT ({commit}) {
      window.axios.get('/os/compute/v2/b5112f82a3e44f908937fc1c2bd1e191/os-keypairs').then(res => {
        commit('updateKeyts', res.data.keypairs)
        commit('updateInitializedFlag', 'keyt')
      }).catch(err => {
        console.log(err)
      })
    },
  }
}
