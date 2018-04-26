import Vue from 'vue'

Vue.filter('money', function (value, fixed) {
  let money = Number.parseFloat(value)
  if (typeof fixed === 'number' && fixed > -1) {
    money = money.toFixed(fixed)
  }
  if (money === 'NaN') {
    money = value
  }
  return money
})
