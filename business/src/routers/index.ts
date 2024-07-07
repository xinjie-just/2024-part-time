import { App } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { account, mall, member, staff, store } from './modules'
import { createRouterGuards } from './routerGuards'
// import { IRouterType } from '@/models'

export const routes: any[] = [
  {
    path: '/',
    name: 'Layout',
    redirect: '/store/myStore',
    component: () => import('@/layouts/index.vue'),
    children: [
      ...store, // 店铺管理模块
      ...member, // 会员管理模块
      ...account, // 账户管理模块
      ...mall, // 线上商城模块
      ...staff, // 员工管理模块
      {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        redirect: '/'
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login.vue')
  }
]

const router = createRouter({
  // process.env.BASE_URL
  history: createWebHashHistory(''),
  routes
})

export function setupRouter(app: App) {
  app.use(router)
  // 创建路由守卫
  createRouterGuards(router)
}
export default router
