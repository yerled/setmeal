import Vue from 'vue'
import $store from '../store'
import Router from 'vue-router'
import NotFound from '../views/404/NotFound'
import Setmeal from '../views/setmeal/Setmeal'
import SetmealDetail from '../views/setmeal/SetmealDetail'
import IssueSetmeal from '../views/issueSetmeal/IssueSetmeal'
import Record from '../views/record/Record'
import RecordDetail from '../views/record/RecordDetail'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/setmeal/issue',
      name: 'IssueSetmeal',
      component: IssueSetmeal
    },
    {
      path: '/setmeal/manage',
      name: 'Setmeal',
      components: {
        default: Setmeal,
        detail: SetmealDetail,
      },
    },
    {
      path: '/setmeal/manage/:id',
      name: 'SetmealDetail',
      components: {
        default: Setmeal,
        detail: SetmealDetail,
      },
    },
    {
      path: '/setmeal/record',
      name: 'Record',
      components: {
        default: Record,
        detail: RecordDetail,
      },
    },
    {
      path: '/setmeal/record/:id',
      name: 'RecordDetail',
      components: {
        default: Record,
        detail: RecordDetail,
      },
    },
    {
      path: '/setmeal/NotFound',
      name: 'NotFound',
      component: NotFound
    },
    {
      path: '/setmeal/',
      redirect: '/setmeal/issue',
    },
    {
      path: '/setmeal/*',
      redirect: '/setmeal/NotFound',
    },
  ]
})
router.beforeEach((to, from, next) => {
  if (!/Detail/.test(to.name)) {
    $store.commit('updateDetail', {})
    $store.commit('updateDetailVisible', false)
  }
  next()
})

export default router
