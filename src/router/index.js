import Vue from 'vue'
import $store from '../store'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import NotFound from '../NotFound'
import Setmeal from '../views/Setmeal'
import SetmealDetail from '../views/SetmealDetail'
import MySetmeal from '../views/MySetmeal'
import Record from '../views/Record'

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
      component: Record
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
