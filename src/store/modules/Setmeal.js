export default {
  state: {
    setmealList: [],
  },
  getters: {
    setmealTableData: state => state.setmealList,
  },
  mutations: {
    updateSetmeal (state, setmealList) {
      state.setmealList = setmealList
    },
  },
  actions: {
    refreshSetmeal ({commit}) {
      const dataForDev = [{
        name: 'dev1',
        desc: 'just for dev',
        status: 'published',
      }, {
        name: 'dev2',
        desc: 'just for dev~',
        status: 'draft',
      }, {
        name: 'dev3',
        desc: 'just for dev~~',
        status: 'shelved',
      }]
      commit('updateSetmeal', dataForDev)
    }
  }
}
