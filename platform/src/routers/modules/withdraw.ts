import { IRouterType } from '@/models';
import { UserSwitchOutlined } from '@ant-design/icons-vue';
import { h } from 'vue';

// 提现管理模块路由列表
export const withdraw: IRouterType[] = [
  {
    path: '/withdraw',
    name: '提现管理',
    icon: () => h(UserSwitchOutlined),
    component: () => import('@/views/withdraw/list.vue')
  }
];
