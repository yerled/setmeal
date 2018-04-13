import { dateFormat } from '../../utils'

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
        setmeal.updated_at = dateFormat(setmeal.updated_at)
        setmeal.created_at = dateFormat(setmeal.created_at)
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
    SelectSetmealDetail (context, id) {
      return window.axios.get(`/us/bill/v3/setmeals/${id}/detail`)
    },
    async UpdateSetmealDetail ({commit, dispatch, rootState}) {
      let detailId = rootState.detail.set_meal_id
      if (!detailId) {
        return
      }
      commit('updateDetail', (await dispatch('SelectSetmealDetail', detailId)).data)
    },
  }
}
