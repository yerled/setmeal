export default {
  state: {
    popVisible: {
      purchase: false,
      detail: false,
    },
    issueSetmealList: [],
  },
  getters: {
    IssueSetmealList: state => state.issueSetmealList,
    IssueSetmealPopVisible: state => state.popVisible,
  },
  mutations: {
    updateIssueSetmealList (state, issueSetmealList) {
      state.issueSetmealList = issueSetmealList
    },
    updateIssueSetmealPopVisible (state, {name, visible}) {
      state.popVisible[name] = visible
    },
  },
  actions: {
    SelectIssueSetmealList ({commit, getters}) {
      return window.axios.get(`/us/bill/v3/setmeals?console=true`).then(res => {
        commit('updateIssueSetmealList', res.data.set_meal_list)
      }).catch(err => {
        console.log(err)
      })
    },
    PurchaseIssueSetmeal (context, data) {
      return window.axios.post('/us/bill/v3/setmeals/console', data)
    },
    SelectIssueSetmealDetail (context, id) {
      return window.axios.get(`/us/bill/v3/setmeals/${id}/detail`)
    },
  }
}
