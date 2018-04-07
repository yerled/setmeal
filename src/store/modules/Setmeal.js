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
        type: 'caption',
      }, {
        field: 'description',
      }, {
        field: 'price',
      }, {
        field: 'status',
        type: 'status',
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
    popVisible: {
      create: false,
    },
    setmealList: [],
  },
  getters: {
    SetmealConfig: state => state.config,
    SetmealTableData: state => state.setmealList,
    SetmealPopVisible: state => state.popVisible,
  },
  mutations: {
    updateSetmeal (state, setmealList) {
      state.setmealList = setmealList
    },
    addSetmeal (state, setmeal) {
      state.setmealList.push(setmeal)
    },
    updateSetmealPopVisible (state, {name, visible}) {
      state.popVisible[name] = visible
    },
  },
  actions: {
    refreshSetmeal ({commit}) {
      const dataForDev = [{
        id: 1,
        name: 'dev1',
        description: 'just for dev',
        status: 'issue',
      }, {
        id: 2,
        name: 'dev2',
        description: 'just for dev~',
        status: 'draft',
      }, {
        id: 3,
        name: 'dev1',
        description: 'just for dev',
        status: 'issue',
      }, {
        id: 4,
        name: 'dev2',
        description: 'just for dev~',
        status: 'draft',
      }, {
        id: 5,
        name: 'dev1',
        description: 'just for devvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv',
        status: 'issue',
      }, {
        id: 6,
        name: 'dev2',
        description: 'just for dev~',
        status: 'draft',
      }, {
        id: 7,
        name: 'dev3',
        description: 'just for dev~~',
        status: 'off_shelve',
      }]
      commit('updateSetmeal', dataForDev)
    },
    createSetmeal ({commit}, setmeal) {
      commit('addSetmeal', setmeal)
    },
    refreshSetmealDetail ({commit, rootState}) {
      let detail = rootState.detail
      console.log(`更新${detail.id}的详细信息`)
      commit('updateDetail', {
        id: 111,
        name: '套餐 来自setmeal.js',
        resources: [
          {
            type: 'instance',
            configuration: {
              flavor_id: 'flavor1',
            },
          }, {
            type: 'volume',
            configuration: {
              volume_type: 'ssd',
              size: '50',
            },
          },
        ],

      })
    },
  }
}
