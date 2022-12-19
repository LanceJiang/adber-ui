import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/components/layout'
import Home from './views/home'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: '首页',
      component: Layout,
      redirect: '/home',
      // 前缀 home-
      children: [{
        path: 'home',
        name: 'home-Default',
        component: Home
      }]
    },
    {
      path: '/table',
      name: '表格',
      component: Layout,
      redirect: '/default',
      // 前缀 table-
      children: [{
        path: 'default',
        name: 'table-Default',
        component: () => import(/* webpackChunkName: "table" */ './views/table/default.vue')
      }, {
        path: 'vxeTableDefault',
        name: 'table-vxeTableDefault',
        component: () => import(/* webpackChunkName: "table" */ './views/table/vxeTableDefault.vue')
      }]
      //
      // // path: '/table',
      // // name: 'table',
      // component: () => import(/* webpackChunkName: "table" */ './views/table/default.vue')
    },
    {
      path: '/forms',
      name: '表单',
      component: Layout,
      redirect: '/index',
      // 前缀 forms-
      children: [{
        path: 'index',
        name: 'forms-Default',
        component: () => import(/* webpackChunkName: "forms" */ './views/forms/index.vue')
      }]
    },
    {
      path: '/others',
      name: '其他',
      component: Layout,
      redirect: '/index',
      // 前缀 others-
      children: [{
        path: 'index',
        name: 'others-Default',
        component: () => import(/* webpackChunkName: "others" */ './views/others/index.vue')
      }]
    }
  ]
})
