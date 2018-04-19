import { dateFormat } from '../../utils'

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
        }, {
          field: 'description',
        }, {
          field: 'price',
          type: 'price',
          format: function ({discount_price, period}, vm) {
            return `${discount_price} ${vm.$t('rmb')}/${vm.$t(`month${period}`)}`
          },
        }, {
          field: 'project_name',
        }, {
          field: 'auto_renewal',
          type: 'status',
        }, {
          field: 'renewal_times'
        }, {
          field: 'expire_at'
        }, {
          field: 'created_at',
        }
      ],
    },
    popVisible: {
      renewal: false,
      updateRenewal: false,
    },
    recordList: [],
  },
  getters: {
    RecordConfig: state => state.config,
    RecordTableData: state => {
      let recordList = JSON.parse(JSON.stringify(state.recordList))
      recordList.forEach(record => {
        record.id = record.user_set_meal_id
        record.expire_at = dateFormat(record.expire_at)
        record.created_at = dateFormat(record.created_at)
        record.__status__ = record.auto_renewal
      })
      return recordList
    },
    RecordPopVisible: state => state.popVisible,
  },
  mutations: {
    updateRecordList (state, recordList) {
      state.recordList = recordList
    },
    updateRecordPopVisible (state, {name, visible}) {
      state.popVisible[name] = visible
    },
  },
  actions: {
    SelectRecordList ({commit}) {
      return window.axios.get('/us/bill/v3/setmeals/console').then(res => {
        commit('updateRecordList', res.data.user_bought_set_meals)
      }).catch(err => {
        console.log(err)
      })
    },
    RenewalSetmeal (context, {id, data}) {
      return window.axios.put(`/us/bill/v3/setmeals/console/${id}`, data)
    },
    UpdateRenewal (context, {id, data}) {
      return window.axios.put(`/us/bill/v3/setmeals/${id}`, data)
    },
    GetSetmealPeriod (content, id) {
      return window.axios.get(`/us/bill/v3/setmeals/${id}/get_period`)
    },
    // SelectRecordDetail (context, id) {
    //   return window.axios.get(`/us/bill/v3/setmeals/${id}/detail`)
    // },
    // async UpdateRecordDetail ({commit, dispatch, rootState}) {
    //   let detailId = rootState.detail.set_meal_id
    //   if (!detailId) {
    //     return
    //   }
    //   commit('updateDetail', (await dispatch('SelectRecordeDetail', detailId)).data)
    // },
  }
}
