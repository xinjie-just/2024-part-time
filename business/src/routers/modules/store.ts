import { RouteRecordRaw } from 'vue-router';

// 店铺管理模块路由列表
export const store: RouteRecordRaw[] = [
  {
    path: '/store/baseInfo',
    name: 'baseInfo',
    component: () => import('@/views/store/baseInfo.vue'),
    meta: {
      title: '基本信息',
    },
  },
  {
    path: '/store/updatePassword',
    name: 'updatePassword',
    component: () => import('@/views/store/updatePassword.vue'),
    meta: {
      title: '密码修改',
    },
  },
  {
    path: '/store/registerShop',
    name: 'registerShop',
    component: () => import('@/views/store/registerShop.vue'),
    meta: {
      title: '他店代注',
    },
  },
];
