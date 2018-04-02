import moment from 'moment'

const VueMoment = {
  install: function (Vue, options) {
    Vue.prototype.$dateFormat = function (date, pattern = 'YYYY-MM-DD HH:mm:ss') {
      return moment(date).format(pattern)
    }
  },
}

export default VueMoment
