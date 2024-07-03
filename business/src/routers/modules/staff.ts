import { RouteRecordRaw } from 'vue-router';

// 员工管理模块路由列表
export const staff: RouteRecordRaw[] = [
  {
    path: '/staff',
    name: 'staff',
    component: () => import('@/views/staff/list.vue'),
    meta: {
      title: '员工管理',
    },
  },
];
