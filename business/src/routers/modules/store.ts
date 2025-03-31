import { IRouterType } from '@/models';
import { AppstoreAddOutlined } from '@ant-design/icons-vue';
import { h } from 'vue';

// 店铺管理模块路由列表
export const store: IRouterType[] = [
  {
    path: '/store',
    name: '店铺管理',
    icon: () => h(AppstoreAddOutlined),
    children: [
      {
        path: '/store/myStore',
        name: '我的店铺',
        component: () => import('@/views/store/myStore.vue')
      },
      {
        path: '/store/agentShopList',
        name: '代营店铺',
        component: () => import('@/views/store/agentShopList.vue')
      }
    ]
  }
];
