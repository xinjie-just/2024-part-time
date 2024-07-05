import { IRouterType } from '@/models'
import { AppstoreOutlined } from '@ant-design/icons-vue'
import { h } from 'vue'

// 店铺管理模块路由列表
export const store: IRouterType[] = [
  {
    path: '/store',
    name: '店铺管理',
    icon: () => h(AppstoreOutlined),
    children: [
      {
        path: '/store/baseInfo',
        name: '基本信息',
        component: () => import('@/views/store/baseInfo.vue')
      },
      {
        path: '/store/updatePassword',
        name: '密码修改',
        component: () => import('@/views/store/updatePassword.vue')
      },
      {
        path: '/store/registerShop',
        name: '他店代注',
        component: () => import('@/views/store/registerShop.vue')
      }
    ]
  }
]
