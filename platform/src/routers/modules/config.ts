import { IRouterType } from '@/models';
import { SettingOutlined } from '@ant-design/icons-vue';
import { h } from 'vue';

// 配置管理模块路由列表
export const config: IRouterType[] = [
  {
    path: '/config/list',
    name: '配置管理',
    icon: () => h(SettingOutlined),
    component: () => import('@/views/config/list.vue')
  }
];
