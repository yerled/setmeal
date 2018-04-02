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
        validStatus: ['draft', 'off_shelve'],
      }, {
        field: 'purchase',
        icon: 'purchase',
        selection: 'single',
        validStatus: ['issue'],
      }],
      columns: [{
        field: 'name',
      }, {
        field: 'description',
      }, {
        field: 'price',
      }, {
        field: 'status',
      }, {
        field: 'instance_count',
      }, {
        field: 'volume_count',
      }, {
        field: 'floating_ip_count',
      }, {
        field: 'router_count',
      }],
      rowClass: {
        warn: ['off_shelve'],
      },
      initStatusFilter: ['draft', 'issue', 'off_shelve'],
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
        description: 'just for dev',
        status: 'issue',
      }, {
        name: 'dev2',
        description: 'just for dev~',
        status: 'draft',
      }, {
        name: 'dev1',
        description: 'just for dev',
        status: 'issue',
      }, {
        name: 'dev2',
        description: 'just for dev~',
        status: 'draft',
      }, {
        name: 'dev1',
        description: 'just for devvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv',
        status: 'issue',
      }, {
        name: 'dev2',
        description: 'just for dev~',
        status: 'draft',
      }, {
        name: 'dev3',
        description: 'just for dev~~',
        status: 'off_shelve',
      }]
      commit('updateSetmeal', dataForDev)
    },
    createSetmeal ({commit}, setmeal) {
      commit('addSetmeal', setmeal)
    },
  }
}
