import { IRouterType } from '@/models'
import { ShopOutlined } from '@ant-design/icons-vue'
import { h } from 'vue'

// 线上商城模块路由列表
export const mall: IRouterType[] = [
  {
    path: '/mall',
    name: '线上商城',
    icon: () => h(ShopOutlined),
    children: [
      {
        path: '/mall/pk',
        name: 'PK 品',
        component: () => import('@/views/mall/pk.vue')
      },
      {
        path: '/mall/scan',
        name: '扫一扫',
        component: () => import('@/views/mall/scan.vue')
      },
      {
        path: '/mall/wishing',
        name: '创意许愿',
        component: () => import('@/views/mall/wishing.vue')
      },
      {
        path: '/mall/pkHand',
        name: 'PK 手管理',
        component: () => import('@/views/mall/pkHand.vue')
      },
      {
        path: '/mall/order',
        name: '订单管理',
        component: () => import('@/views/mall/order.vue')
      }
    ]
  }
]
