import { IRouterType } from '@/models';
import { AppstoreOutlined } from '@ant-design/icons-vue';
import { h } from 'vue';

// 店铺管理模块路由列表
export const store: IRouterType[] = [
  {
    path: '/store/list',
    name: '店铺管理',
    icon: () => h(AppstoreOutlined),
    component: () => import('@/views/store/list.vue')
  }
];
