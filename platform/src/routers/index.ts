import { App } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import { config, store, withdraw } from './modules';
import { createRouterGuards } from './routerGuards';
// import { IRouterType } from '@/models'

export const routes: any[] = [
  {
    path: '/',
    name: 'Layout',
    redirect: '/store/list',
    component: () => import('@/layouts/index.vue'),
    children: [
      ...store, // 店铺管理模块
      ...config, // 配置管理模块
      ...withdraw, // 提现管理模块
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
];

const router = createRouter({
  // process.env.BASE_URL
  history: createWebHashHistory(''),
  routes
});

export function setupRouter(app: App) {
  app.use(router);
  // 创建路由守卫
  createRouterGuards(router);
}
export default router;
