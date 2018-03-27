import base from './base'
import menu from './menu'
import setmeal from './setmeal'

const modules = { menu, setmeal }
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
