import { IRouterType } from '@/models';
import { DollarOutlined } from '@ant-design/icons-vue';
import { h } from 'vue';

// 提现管理模块路由列表
export const withdraw: IRouterType[] = [
  {
    path: '/withdraw/list',
    name: '提现管理',
    icon: () => h(DollarOutlined),
    component: () => import('@/views/withdraw/list.vue')
  }
];
