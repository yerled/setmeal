import {initQueryStr} from '../../utils'

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
          sortable: true,
        }, {
          field: 'description',
          sortable: true,
        }, {
          field: 'price',
          type: 'price',
          sortable: true,
          format: function ({discount_price, period}, vm) {
            return `${discount_price} ${vm.$t('rmb')}/${vm.$t(`month${period}`)}`
          },
        }, {
          field: 'status',
          type: 'status',
        }, {
          field: 'updated_at',
          type: 'date',
          sortable: true,
        }, {
          field: 'created_at',
          type: 'date',
          sortable: true,
        },
      ],
      searches: [
        {
          field: 'name',
          type: 'text',
        },
        {
          field: 'description',
          type: 'text',
        },
        {
          field: 'created_at',
          type: 'date',
        },
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
      limit: 20,
      offset: 0,
    },
    filter: [],
    search: [],
    loading: false,
  },
  getters: {
    SetmealConfig: state => state.config,
    SetmealTableData: state => state.setmealList,
    SetmealPopVisible: state => state.popVisible,
    SetmealTotalCount: state => state.total_count,
    SetmealQuery: state => state.query,
    SetmealFilter: state => state.filter,
    SetmealSearch: state => state.search,
    SetmealLoading: state => state.loading,
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
    updateSetmealFilter (state, list) {
      state.filter = list
    },
    pushSetmealSearch (state, searchItem) {
      state.search.push(searchItem)
    },
    removeSetmealSearch (state, field) {
      state.search = state.search.filter(e => e.field !== field)
    },
    updateSetmealLoading (state, value = false) {
      state.loading = value
    },
  },
  actions: {
    SelectSetmealList ({commit, getters}) {
      let queryStr = initQueryStr(getters.SetmealQuery, getters.SetmealFilter, getters.SetmealSearch)

      return window.axios.get(`/us/bill/v3/setmeals?${queryStr}`).then(res => {
        commit('updateSetmealList', res.data.set_meal_list)
        commit('udpateSetmealTotalCount', res.data.total_count)
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
      let detail = (await dispatch('SelectSetmealDetail', detailId)).data
      detail.id = detail.set_meal.set_meal_id
      commit('updateDetail', detail)
    },
  }
}
