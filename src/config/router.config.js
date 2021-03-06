import { UserLayout, TabLayout, RouteView, BlankLayout, PageView } from '@/components/layouts'

/**
 * 走菜单，走权限控制
 * @type {[null,null]}
 */
export const asyncRouterMap = [

  {
    path: '/',
    name: 'dashboard',
    component: TabLayout,
    meta: { title: '首页' },
    redirect: '/dashboard/analysis',
    children: [

    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/register/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/register/RegisterResult')
      },
      {
        path: 'alteration',
        name: 'alteration',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/alteration/Alteration')
      },
    ]
  },
  // {
  //   path: '/other',
  //   name: 'other',
  //   component: TabLayout,
  //   meta: { title: '订单列表' },
  //   redirect: '/order/orderList',
  //   children: [
  //     {
  //       name: 'orderDetail',
  //       path: '/order/orderDetail/:id',
  //       meta: { title: '订单详情' },
  //       component: import('src/views/order/OrderMetaDetail.vue')
  //     }
  //   ]
  // },
  {
    // OAuth2 APP页面路由
    path: '/oauth2-app',
    component: BlankLayout,
    redirect: '/oauth2-app/login',
    children: [
      {
        // OAuth2 登录路由
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "oauth2-app.login" */ '@/views/user/oauth2/OAuth2Login')
      },
    ]
  },

  {
    path: '/test',
    component: BlankLayout,
    redirect: '/test/home',
    children: [
      {
        path: 'home',
        name: 'TestHome',
        component: () => import('@/views/Home')
      }
    ]
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  },
  {
    path: '/preview/:reportId',
    name: 'Preview',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/report/template/preview')
  },
  {
    path: '/print-t800/:reportId',
    name: 'PagePrintT800',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/report/print/index-T800')
  },
  {
    path: '/print/:reportId/:template',
    name: 'PagePreview',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/report/print')
  },
]
