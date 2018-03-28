import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    demoConfig: {
      buttons: [{
        field: 'create',
        icon: 'add',
        action: 'create',
        type: 'primary',
      }, {
        field: 'update',
        icon: 'edit',
        action: 'update',
        selection: 'single',
        validStatus: ['drafted', 'shelved'],
      }, {
        field: 'purchase',
        icon: 'purchase',
        action: 'purchase',
        selection: 'single',
        validStatus: ['published'],
      }],
      columns: [{
        field: 'name',
      }, {
        field: 'desc',
      }, {
        field: 'status',
      }],
      tableData: [{name: '黄金套餐', 
        desc: 'data in setmeal.vue',
        status: 'published',
      }, {name: '白银套餐', 
        desc: 'data in setmeal.vue',
        status: 'drafted',
      }, {name: '青铜套餐', 
        desc: 'data in setmeal.vue',
        status: 'shelved',
      }],
    },
  },
  modules,
  strict: process.env.NODE_ENV !== 'production',
})

export default store
