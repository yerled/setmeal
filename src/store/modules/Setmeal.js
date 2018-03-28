const moduleName = 'Setmeal'

export default {
  state: {
    config: {
      buttons: [{
        field: 'create',
        icon: 'add',
        type: 'primary',
      }, {
        field: 'update',
        icon: 'edit',
        selection: 'single',
        validStatus: ['drafted', 'shelved'],
      }, {
        field: 'purchase',
        icon: 'purchase',
        selection: 'single',
        validStatus: ['published'],
      }],
      columns: [{
        field: 'name',
      }, {
        field: 'desc',
      }, {
        field: 'status',
      }],
      rowClass: {
        warn: ['shelved'],
      },
    },
    setmealList: [],
  },
  getters: {
    [`${moduleName}Config`]: state => state.config,
    [`${moduleName}TableData`]: state => state.setmealList,
  },
  mutations: {
    updateSetmeal (state, setmealList) {
      state.setmealList = setmealList
    },
    addSetmeal (state, setmeal) {
      state.setmealList.push(setmeal)
    }
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
        status: 'drafted',
      }, {
        name: 'dev3',
        desc: 'just for dev~~',
        status: 'shelved',
      }]
      commit('updateSetmeal', dataForDev)
    },
    createSetmeal ({commit}, setmeal) {
      commit('addSetmeal', setmeal)
    },
  }
}
