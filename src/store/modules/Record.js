import { dateFormat } from '../../utils'

export default {
  state: {
    config: {
      buttons: [
        {
          field: 'renewal',
          icon: 'renewal',
          selection: 'single',
          validStatus: ['draft', 'off_shelve'],
        }, {
          field: 'update',
          icon: 'edit',
          selection: 'single',
          validStatus: ['draft', 'off_shelve'],
        }
      ],
      columns: [
        {
          field: 'set_meal_name',
        }, {
          field: 'description',
        }, {
          field: 'price',
          type: 'price',
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
      update: false,
    },
    recordList: [],
  },
  getters: {
    RecordConfig: state => state.config,
    RecordTableData: state => {
      let recordList = JSON.parse(JSON.stringify(state.recordList))
      recordList.forEach(record => {
        record.expire_at = dateFormat(record.expire_at)
        record.created_at = dateFormat(record.created_at)
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
    SelectRecordeDetail (context, id) {
      return window.axios.get(`/us/bill/v3/setmeals/${id}/detail`)
    },
    async UpdateRecordDetail ({commit, dispatch, rootState}) {
      let detailId = rootState.detail.set_meal_id
      if (!detailId) {
        return
      }
      commit('updateDetail', (await dispatch('SelectRecordeDetail', detailId)).data)
    },
  }
}
