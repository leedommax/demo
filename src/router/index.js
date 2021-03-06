import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Sku from '@/components/Sku'
import Occupy from '@/components/Occupy'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/sku',
      name: 'Sku',
      component: Sku
    },
    {
      path: '/occupy',
      name: 'Occupy',
      component: Occupy
    }
  ]
})
