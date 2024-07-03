import { RouteRecordRaw } from 'vue-router';

// 会员管理模块路由列表
export const member: RouteRecordRaw[] = [
  {
    path: '/member',
    name: 'member',
    component: () => import('@/views/member/list.vue'),
    meta: {
      title: '会员管理',
    },
  },
];
