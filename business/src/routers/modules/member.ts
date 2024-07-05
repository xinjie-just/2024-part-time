import { IRouterType } from '@/models'
import { UserOutlined } from '@ant-design/icons-vue'
import { h } from 'vue'

// 会员管理模块路由列表
export const member: IRouterType[] = [
  {
    path: '/member',
    name: '会员管理',
    icon: () => h(UserOutlined),
    component: () => import('@/views/member/list.vue')
  }
]
