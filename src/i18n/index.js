import base from './base'
import menu from './menu'
import Setmeal from './Setmeal'

const modules = { menu, Setmeal }
let messages = {
  zh: {},
  en: {}
}
for (let key in modules) {
  messages.zh[key] = modules[key].zh
  messages.en[key] = modules[key].en
}
messages = Object.assign(base, messages)

export default messages
