import { IRouterType } from '@/models';
import { UserSwitchOutlined } from '@ant-design/icons-vue';
import { h } from 'vue';

// 员工管理模块路由列表
export const staff: IRouterType[] = [
  {
    path: '/staff',
    name: '员工管理',
    icon: () => h(UserSwitchOutlined),
    component: () => import('@/views/staff/list.vue')
  }
];
