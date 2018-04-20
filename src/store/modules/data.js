import {convertSize, initDictFromList} from '../../utils'

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
    productDict (state, getters) {
      return initDictFromList(getters.productList, 'name')
    },
    flavors (state) {
      return state.flavors.filter(e => {
        return !~e.name.indexOf('db_')
      }).sort((a, b) => {
        return a.vcpus - b.vcpus || a.ram - b.ram
      })
    },
    flavorList (state, getters) {
      return getters.flavors.map(e => {
        let {id, name, vcpus, ram} = e
        let __desc = `${vcpus}vCPU/${convertSize(ram, 'M')}`
        e.flavor_id = id
        e.__desc = __desc
        e.__nameAndDesc = `${name} (${__desc})`
        return e
      })
    },
    flavorDict (state, getters) {
      return initDictFromList(getters.flavorList)
    },
    volumeTypeList () {
      return ['ssd', 'sata']
    },
    networkList (state) {
      return state.networks.map(e => {
        e.network_id = e.id
        return e
      }).sort((a, b) => {
        return a.name > b.name
      })
    },
    networkDict (state, getters) {
      return initDictFromList(getters.networkList)
    },
    subnetList (state) {
      return state.subnets.map(e => {
        e.subnet_id = e.id
        return e
      }).sort((a, b) => {
        return a.name > b.name
      })
    },
    subnetDict (state, getters) {
      return initDictFromList(getters.subnetList)
    },
    lineDict (state, getters) {
      let network_id = getters.networkList[0] && getters.networkList[0].id
      let dict = {}
      getters.subnetList.forEach(e => {
        if (e.network_id === network_id) { // yerled 此处还需要根据配置项UOS.env.floatingIpDisabledCidr来过滤
          if (!dict[e.name]) {
            dict[e.name] = []
          }
          dict[e.name].push(e)
        }
      })
      return dict
    },
    lineList (state, getters) {
      return Object.keys(getters.lineDict).sort((a, b) => a > b).map(e => ({name: e}))
    },
    imageList (state) {
      return state.images.filter(e => {
        return !(e.status && e.status.toLowerCase() === 'deprecated')
      }).sort((a, b) => {
        return a.name > b.name
      })
    },
    imageDict (state, getters) {
      return initDictFromList(getters.imageList)
    },
    systemImageList (state, getters) {
      return getters.imageList.filter(e => {
        return e.image_type === 'distribution'
      })
    },
    snapImageList (state, getters) {
      return getters.imageList.filter(e => {
        return !e.image_type || e.image_type === 'snapshot'
      })
    },
    keytList (state) {
      return state.keyts.map(e => e.keypair).sort((a, b) => {
        return a.name > b.name
      })
    },
    keytDict (state, getters) {
      return initDictFromList(getters.keytList)
    }
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
    INIT_DATA ({dispatch, state}) {
      console.log(state.initializedFlag)
      dispatch('INIT_PRODUCT')
      dispatch('INIT_FLAVOR')
      dispatch('INIT_NETWORK')
      dispatch('INIT_SUBNET')
      dispatch('INIT_IMAGE')
      dispatch('INIT_KEYT')
    },
    INIT_PRODUCT ({commit, state}) {
      if (state.initializedFlag.product) {
        console.log(`product相关数据初始化完成（from cache）`)
        return
      }
      window.axios.get('/us/bill/v2/products/detail').then(res => {
        commit('updateProducts', res.data.products)
        commit('updateInitializedFlag', 'product')
      }).catch(err => {
        console.log(`product相关数据初始化出错`)
        console.log(err)
      })
    },
    INIT_FLAVOR ({commit, state}) {
      if (state.initializedFlag.product) {
        console.log(`product相关数据初始化完成（from cache）`)
        return
      }
      // window.axios.get('/os/compute/v2/f0026604054c48d6893c24665c717e58/flavors/detail').then(res => {
      window.axios.get('/os/compute/v2/b5112f82a3e44f908937fc1c2bd1e191/flavors/detail').then(res => {
        commit('updateFlavors', res.data.flavors)
        commit('updateInitializedFlag', 'flavor')
      }).catch(err => {
        console.log(`flavor相关数据初始化出错`)
        console.log(err)
      })
    },
    INIT_NETWORK ({commit}) {
      window.axios.get('/os/network/v2.0/networks?router%3Aexternal=True').then(res => {
        commit('updateNetworks', res.data.networks)
        commit('updateInitializedFlag', 'network')
      }).catch(err => {
        console.log(`network相关数据初始化出错`)
        console.log(err)
      })
    },
    INIT_SUBNET ({commit}) {
      window.axios.get('/os/network/v2.0/subnets').then(res => {
        commit('updateSubnets', res.data.subnets)
        commit('updateInitializedFlag', 'subnet')
      }).catch(err => {
        console.log(`subnet相关数据初始化出错`)
        console.log(err)
      })
    },
    INIT_IMAGE ({commit}) {
      window.axios.get('/os/image/v2/images?limit=999').then(res => {
        commit('updateImages', res.data.images)
        commit('updateInitializedFlag', 'image')
      }).catch(err => {
        console.log(`image相关数据初始化出错`)
        console.log(err)
      })
    },
    INIT_KEYT ({commit}) {
      window.axios.get('/os/compute/v2/b5112f82a3e44f908937fc1c2bd1e191/os-keypairs').then(res => {
        commit('updateKeyts', res.data.keypairs)
        commit('updateInitializedFlag', 'keyt')
      }).catch(err => {
        console.log(`keyt相关数据初始化出错`)
        console.log(err)
      })
    },
  }
}
