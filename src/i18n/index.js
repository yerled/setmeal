import common from './common'
import resource from './resource'
import price from './price'
import menu from './menu'
import tips from './tips'
import Setmeal from './Setmeal'

// init base
const baseArr = [common, resource, price, tips]
let messages = {
  zh: {},
  en: {},
}
baseArr.forEach(e => {
  Object.assign(messages.zh, e.zh)
  Object.assign(messages.en, e.en)
})

// add modules
const modules = { menu, Setmeal }
for (let key in modules) {
  messages.zh[key] = Object.setPrototypeOf(modules[key].zh, messages.zh)
  messages.en[key] = Object.setPrototypeOf(modules[key].en, messages.en)
}

export default messages
