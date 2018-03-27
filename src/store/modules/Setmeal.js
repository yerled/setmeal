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
      }]
      commit('updateSetmeal', dataForDev)
    }
  }
}
