import { IRouterType } from '@/models';
import { DollarOutlined } from '@ant-design/icons-vue';
import { h } from 'vue';

// 账户管理模块路由列表
export const account: IRouterType[] = [
  {
    path: '/account',
    name: '账户管理',
    icon: () => h(DollarOutlined),
    children: [
      {
        path: '/account/balance',
        name: '账户余额',
        component: () => import('@/views/account/balance.vue')
      },
      {
        path: '/account/withdrawe',
        name: '账户提现',
        component: () => import('@/views/account/withdrawe.vue')
      }
    ]
  }
];
