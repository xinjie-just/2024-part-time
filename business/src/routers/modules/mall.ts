import { RouteRecordRaw } from 'vue-router';

// 线上商城模块路由列表
export const mall: RouteRecordRaw[] = [
  {
    path: '/mall/pk',
    name: 'pk',
    component: () => import('@/views/mall/pk.vue'),
    meta: {
      title: 'PK 品',
    },
  },
  {
    path: '/mall/scan',
    name: 'scan',
    component: () => import('@/views/mall/scan.vue'),
    meta: {
      title: '扫一扫',
    },
  },
  {
    path: '/mall/wishing',
    name: 'wishing',
    component: () => import('@/views/mall/wishing.vue'),
    meta: {
      title: '创意许愿',
    },
  },
  {
    path: '/mall/upgradeShop',
    name: 'upgradeShop',
    component: () => import('@/views/mall/upgradeShop.vue'),
    meta: {
      title: '升级店铺',
    },
  },
  {
    path: '/mall/pkHand',
    name: 'pkHand',
    component: () => import('@/views/mall/pkHand.vue'),
    meta: {
      title: 'PK 手管理',
    },
  },
  {
    path: '/mall/order',
    name: 'order',
    component: () => import('@/views/mall/order.vue'),
    meta: {
      title: '订单管理',
    },
  },
];
