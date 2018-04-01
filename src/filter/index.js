import Vue from 'vue'

Vue.filter('money', function (value, fixed) {
  let money = Number.parseFloat(value)
  if (typeof fixed === 'number' && fixed > 0) {
    money = money.toFixed(4)
  }
  if (money === 'NaN') {
    money = value
  }
  return money
})
