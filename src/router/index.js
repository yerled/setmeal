import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import NotFound from '../NotFound'
import Setmeal from '../views/Setmeal'
import MySetmeal from '../views/MySetmeal'
import Record from '../views/Record'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/setmeal',
      name: 'Setmeal',
      component: Setmeal
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
