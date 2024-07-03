import { RouteRecordRaw } from 'vue-router';

// 账户管理模块路由列表
export const account: RouteRecordRaw[] = [
  {
    path: '/account/balance',
    name: 'balance',
    component: () => import('@/views/account/balance.vue'),
    meta: {
      title: '账户余额',
    },
  },
  {
    path: '/account/withdrawe',
    name: 'withdrawe',
    component: () => import('@/views/account/withdrawe.vue'),
    meta: {
      title: '账户提现',
    },
  },
];
