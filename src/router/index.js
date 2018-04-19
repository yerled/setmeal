import Vue from 'vue'
import $store from '../store'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import NotFound from '../views/404/NotFound'
import Setmeal from '../views/setmeal/Setmeal'
import SetmealDetail from '../views/setmeal/SetmealDetail'
import MySetmeal from '../views/mysetmeal/MySetmeal'
import Record from '../views/record/Record'
import RecordDetail from '../views/record/RecordDetail'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/setmeal',
      name: 'Setmeal',
      components: {
        default: Setmeal,
        detail: SetmealDetail,
      },
    },
    {
      path: '/setmeal/:id',
      name: 'SetmealDetail',
      components: {
        default: Setmeal,
        detail: SetmealDetail,
      },
    },
    {
      path: '/mySetmeal',
      name: 'MySetmeal',
      component: MySetmeal
    },
    {
      path: '/record',
      name: 'Record',
      components: {
        default: Record,
        detail: RecordDetail,
      },
    },
    {
      path: '/record/:id',
      name: 'RecordDetail',
      components: {
        default: Record,
        detail: RecordDetail,
      },
    },
    {
      path: '/NotFound',
      name: 'NotFound',
      component: NotFound
    },
    {
      path: '*',
      redirect: '/NotFound',
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
