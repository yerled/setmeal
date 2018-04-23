import { initQueryStr } from '../../utils'

export default {
  state: {
    config: {
      buttons: [
        {
          field: 'renewal',
          icon: 'renewal',
          selection: 'single',
          validStatus: [true],
        }, {
          field: 'update',
          icon: 'edit',
          selection: 'single',
          validStatus: [true, false],
        }
      ],
      columns: [
        {
          field: 'set_meal_name',
          type: 'caption',
          sortable: true,
        }, {
          field: 'description',
        }, {
          field: 'price',
          type: 'price',
          sortable: true,
          format: function ({discount_price, period}, vm) {
            return `${discount_price} ${vm.$t('rmb')}/${vm.$t(`month${period}`)}`
          },
        }, {
          field: 'project_name',
        }, {
          field: 'auto_renewal',
          type: 'status',
        }, {
          field: 'renewal_times',
          sortable: true,
        }, {
          field: 'expire_at',
          type: 'date',
          sortable: true,
        }, {
          field: 'created_at',
          type: 'date',
          sortable: true,
        }
      ],
    },
    popVisible: {
      renewal: false,
      updateRenewal: false,
    },
    recordList: [],
    total_count: 0,
    query: {
      sort_key: '',
      sort_order: '',
      limit: 15,
      offset: 0,
    },
    filter: [],
    loading: false,
  },
  getters: {
    RecordConfig: state => state.config,
    RecordTableData: state => {
      let recordList = JSON.parse(JSON.stringify(state.recordList))
      recordList.forEach(record => {
        record.id = record.user_set_meal_id
        record.__status__ = record.auto_renewal
      })
      return recordList
    },
    RecordPopVisible: state => state.popVisible,
    RecordTotalCount: state => state.total_count,
    RecordQuery: state => state.query,
    RecordFilter: state => state.filter,
    RecordLoading: state => state.loading,
  },
  mutations: {
    updateRecordList (state, recordList) {
      state.recordList = recordList
    },
    updateRecordPopVisible (state, {name, visible}) {
      state.popVisible[name] = visible
    },
    updateRecordQuery (state, {name, value}) {
      state.query[name] = value
    },
    updateRecordFilter (state, list) {
      state.filter = list
    },
    updateRecordLoading (state, value = false) {
      state.loading = value
    },
  },
  actions: {
    SelectRecordList ({commit, getters}) {
      let queryStr = initQueryStr(getters.RecordQuery, getters.SetmealFilter)

      return window.axios.get(`/us/bill/v3/setmeals/console${queryStr}`).then(res => {
        commit('updateRecordList', res.data.user_bought_set_meals)
        commit('udpateRecordTotalCount', res.data.total_count)
      }).catch(err => {
        console.log(err)
      })
    },
    RenewalSetmeal (context, {id, data}) {
      return window.axios.put(`/us/bill/v3/setmeals/console/${id}`, data)
    },
    UpdateRenewal (context, {id, data}) {
      return window.axios.put(`/us/bill/v3/setmeals/console/${id}/update_renew`, data)
    },
    SelectRecordDetail (content, id) {
      return window.axios.get(`/us/bill/v3/setmeals/console/${id}`)
    },
  }
}
