export default {
  state: {
    config: {
      buttons: [
        {
          field: 'create',
          icon: 'add',
          type: 'primary',
        }, {
          field: 'update',
          icon: 'edit',
          selection: 'single',
          validStatus: ['draft', 'off_shelve'],
        }, {
          field: 'issue',
          icon: 'issue',
          selection: 'single',
          validStatus: ['draft', 'off_shelve'],
        }, {
          field: 'shelve',
          icon: 'shelve',
          selection: 'single',
          validStatus: ['issue'],
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
          validStatus: ['draft'],
        }
      ],
      columns: [
        {
          field: 'name',
          type: 'caption',
        }, {
          field: 'description',
        }, {
          field: 'price',
          type: 'price',
          format: function ({price}, vm) {
            return `${price} ${vm.$t('rmb')}/${vm.$t('hour')}`
          },
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
        }, {
          field: 'created_at',
          type: 'date',
        }
      ],
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
    total_count: 0,
    query: {
      sort_key: '',
      sort_order: '',
      limit: 15,
      offset: 0,
    },
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
          let configuration = resource.configuration
          try {
            configuration = JSON.parse(resource.configuration)
          } catch (e) {
            console.log('非法的JSON: ' + configuration)
            console.log(e)
            console.log('来自：' + setmeal.name)
          }
          resource.configuration = configuration
        })
        setmeal.id = setmeal.set_meal_id
      })
      return setmealList
    },
    SetmealPopVisible: state => state.popVisible,
    SetmealTotalCount: state => state.total_count,
    SetmealQuery: state => state.query,
  },
  mutations: {
    updateSetmealList (state, setmealList) {
      state.setmealList = setmealList
    },
    udpateSetmealTotalCount (state, total_count) {
      state.total_count = total_count
    },
    updateSetmealPopVisible (state, {name, visible}) {
      state.popVisible[name] = visible
    },
    updateSetmealQuery (state, {name, value}) {
      state.query[name] = value
    },
  },
  actions: {
    SelectSetmealList ({commit, getters}) {
      let query = getters.SetmealQuery
      let querySort = query.sort_key ? `sort_key=${query.sort_key}&sort_order=${query.sort_order}&` : ''
      let queryPagination = `limit=${query.limit}&offset=${query.offset}`
      let queryStr = querySort + queryPagination

      return window.axios.get(`/us/bill/v3/setmeals?${queryStr}`).then(res => {
        commit('updateSetmealList', res.data.set_meal_list)
        commit('udpateSetmealTotalCount', res.data.total_count || 100)
      }).catch(err => {
        console.log(err)
      })
    },
    CreateSetmeal (context, setmeal) {
      return window.axios.post('/us/bill/v3/setmeals', setmeal)
    },
    UpdateSetmeal (context, {id, data}) {
      return window.axios.put(`/us/bill/v3/setmeals/${id}`, data)
    },
    UpdateSetmealStatus (context, {id, status}) {
      return window.axios.put(`/us/bill/v3/setmeals/${id}/update_set_meal`, {status})
    },
    UpdateSetmealPeriod (context, {id, data}) {
      return window.axios.put(`/us/bill/v3/setmeals/${id}/update_period`, {periods: data.periods})
    },
    DeleteSetmeal (context, id) {
      return window.axios.delete(`/us/bill/v3/setmeals/${id}`)
    },
    PurchaseSetmeal (context, data) {
      return window.axios.post('/us/bill/v3/setmeals/console', data)
    },
    SelectSetmealDetail (context, id) {
      return window.axios.get(`/us/bill/v3/setmeals/${id}/detail`)
    },
    async UpdateSetmealDetail ({commit, dispatch, rootState}) {
      let detailId = rootState.detail.set_meal_id
      if (!detailId) {
        return
      }
      let detail = (await dispatch('SelectSetmealDetail', detailId)).data
      detail.id = detail.set_meal.set_meal_id
      commit('updateDetail', detail)
    },
  }
}
