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
      }, {
        field: 'delete',
        icon: 'delete',
        selection: 'single',
        type: 'danger',
        validStatus: ['issue', 'draft', 'off_shelve'],
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
      update: false,
      purchase: false,
    },
    setmealList: [],
  },
  getters: {
    SetmealConfig: state => state.config,
    SetmealTableData: state => {
      let setmealList = JSON.parse(JSON.stringify(state.setmealList))
      setmealList.forEach(setmeal => {
        setmeal.instance_count = setmeal.volume_count = setmeal.floating_ip_count = setmeal.router_count = 0
        setmeal.resources.forEach(resource => {
          let type = resource.type
          let count = `${type}_count`
          setmeal[count]++
          resource.configuration = JSON.parse(resource.configuration)
        })
      })
      return setmealList
    },
    SetmealPopVisible: state => state.popVisible,
  },
  mutations: {
    updateSetmealList (state, setmealList) {
      state.setmealList = setmealList
    },
    updateSetmealPopVisible (state, {name, visible}) {
      state.popVisible[name] = visible
    },
  },
  actions: {
    SelectSetmealList ({commit}) {
      return window.axios.get('/us/bill/v3/setmeals').then(res => {
        commit('updateSetmealList', res.data.set_meal_list)
      }).catch(err => {
        console.log(err)
      })
    },
    CreateSetmeal ({commit, dispatch}, setmeal) {
      return window.axios.post('/us/bill/v3/setmeals', setmeal)
    },
    DeleteSetmeal (context, id) {
      return window.axios.delete(`/us/bill/v3/setmeals/${id}`)
    },
    SelectSetmealDetail (context, id) {
      return window.axios.get(`/us/bill/v3/setmeals/${id}/detail`)
    },
    async UpdateSetmealDetail ({commit, dispatch, rootState}) {
      let detailId = rootState.detail.set_meal_id
      if (!detailId) {
        return
      }
      console.log(`更新${detailId}的详细信息`)
      commit('updateDetail', (await dispatch('SelectSetmealDetail', detailId)).data)
    },
  }
}
