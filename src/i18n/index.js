import common from './common'
import resource from './resource'
import price from './price'
import menu from './menu'
import Setmeal from './Setmeal'

// init base
const baseArr = [common, resource, price]
let messages = {
  zh: {},
  en: {},
}
baseArr.forEach(e => {
  Object.assign(messages.zh, e.zh)
  Object.assign(messages.en, e.en)
})
console.dir(messages)

// add modules
const modules = { menu, Setmeal }
for (let key in modules) {
  messages.zh[key] = modules[key].zh
  messages.en[key] = modules[key].en
}

export default messages
