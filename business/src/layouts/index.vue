<template>
  <a-layout class="layout">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" :width="256" collapsible>
      <div class="logo">logo</div>
      <a-menu v-model:openKeys="state.openKeys" v-model:selectedKeys="state.selectedKeys" mode="inline" theme="dark"
        :items="menus" @click="onSelectMenu" class="menu"></a-menu>
      <div :class="collapsed ? 'phone' : 'fold-phone phone'">
        <a-tooltip v-if="collapsed" placement="right">
          <template #title>
            <span>客服电话：13012345678</span>
          </template>
          <PhoneOutlined class="phone-icon" />
        </a-tooltip>
        <template v-else>
          <PhoneOutlined class="phone-icon" />
          <span class="phone-num">客服电话：13012345678</span>
        </template>
      </div>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="header">
        <menu-unfold-outlined v-if="collapsed" class="trigger" @click="() => (collapsed = !collapsed)" />
        <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
        <a-dropdown>
          <a class="ant-dropdown-link" @click.prevent>
            {{ userName }}
            <DownOutlined />
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item @click="onUpdatePassword">修改登录密码</a-menu-item>
              <a-menu-divider />
              <a-menu-item @click="onLogout">退出</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-layout-header>
      <a-layout-content ref="contentRef" class="content">
        <router-view #="{ Component }">
          <component :is="Component" />
        </router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
  <update-password v-if="visible" @cancel="onCancel" />
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted, Ref, watch, createVNode, defineAsyncComponent } from 'vue';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
  QuestionCircleOutlined,
  PhoneOutlined
} from '@ant-design/icons-vue';
import { routes } from '@/routers';
import { IRouterType } from '@/models';
import { useRoute, useRouter } from 'vue-router';
import { message, Modal } from 'ant-design-vue';
import { logout } from '@/services';

const updatePassword = defineAsyncComponent(() => import('@/views/updatePassword.vue'));
const visible = ref(false);

const userName = ref('');

const route = useRoute();
const router = useRouter();

const state = reactive({
  selectedKeys: [''],
  openKeys: ['']
});
const collapsed = ref(false);
const menus: Ref<IRouterType[]> = ref([]);

const onSelectMenu = ({ item }) => {
  router.push(item.path);
};

watch(
  () => route,
  (to) => {
    // 如果当前菜单被选中，将其设置为选中状态
    state.selectedKeys = [to.path];
    // 如果当前菜单有父菜单，则将父菜单设置为选中状态
    // state.openKeys = [to.matched[to.matched.length - 1]?.path];
  },
  { immediate: true, deep: true }
);

onMounted(() => {
  console.log('layout');
  const token = localStorage.getItem('token');
  if (!token) {
    const path = route.path;
    localStorage.setItem('path', path);
    message.error('请先登录');
    router.push('/login');
  }
  const userInfoStr = localStorage.getItem('userInfo');
  if (userInfoStr) {
    const userInfo = JSON.parse(userInfoStr);
    userName.value = userInfo.name;
  }
  const newRoutes = routes.find((item) => item.path === '/')?.children;
  const menuRoutes = newRoutes.filter((item) => item.redirect !== '/');
  menus.value = convertToAntdMenu(menuRoutes);
  handleMenu();
});
/**
 * 将菜单数据转换为 Ant Design 的菜单格式
 * @param {IRouterType[]} menuData - 要转换的菜单数据数组
 * @returns {IRouterType[]} 转换后的菜单数据数组
 */
const convertToAntdMenu = (menuData: IRouterType[]): IRouterType[] => {
  return menuData.map((menuItem) => {
    if (menuItem.children && menuItem.children.length > 0) {
      // 如果有子菜单，则创建一个 SubMenu 类型的对象
      return {
        title: menuItem.name,
        label: menuItem.name,
        icon: menuItem.icon,
        key: menuItem.path,
        path: menuItem.path,
        children: convertToAntdMenu(
          menuItem.children.map((child) => ({
            path: child.path,
            name: child.name,
            label: child.name
          }))
        )
      };
    } else {
      // 如果没有子菜单，则创建一个 Item 类型的对象
      return {
        title: menuItem.name,
        label: menuItem.name,
        icon: menuItem.icon,
        key: menuItem.path,
        path: menuItem.path
      };
    }
  });
};

// 刷新页面，将菜单置为选中，并且将一级菜单打开
const handleMenu = () => {
  const path = route.path;
  state.selectedKeys = [path];
  // 判断是否为二级菜单，取最后一个 "/" 看是否为第一个字符
  const lastIndex = path.lastIndexOf('/');
  let parentPath = '';
  if (lastIndex !== 0) {
    parentPath = path.substring(0, lastIndex);
  }
  // 找到 path 为 parentPath 的那个菜单的 label
  const openKey = menus.value.find((item) => item.path === parentPath)?.path;
  state.openKeys = [openKey as string];
};

const onLogout = () => {
  Modal.confirm({
    title: '您确定要退出吗？',
    icon: createVNode(QuestionCircleOutlined),
    okType: 'danger',
    onOk() {
      logout().then(() => {
        const username = localStorage.getItem('username');
        localStorage.clear(); // 清除本地存储中的 token
        sessionStorage.clear(); // 清除本地存储中的 token
        if (username) {
          localStorage.setItem('username', username);
        }
        router.push('/login');
      });
    }
  });
};

const onUpdatePassword = (): void => {
  visible.value = true;
};
const onCancel = (): void => {
  visible.value = false;
};
</script>
<style lang="scss" scope>
.layout {
  height: 100vh;

  .ant-layout-sider-children {
    display: flex;
    flex-direction: column;
  }

  .logo {
    height: 64px;
    font-size: 20px;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .menu {
    flex: 1;
    overflow-y: auto;
  }

  .phone {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 500;
    color: #fff;
    height: 64px;
    line-height: 64px;
    justify-content: center;

    &.fold-phone {
      padding-left: 24px;
      justify-content: flex-start;
    }

    .phone-icon {
      font-size: 18px;
    }

    .phone-num {
      margin-left: 8px;
    }
  }

  .header.header {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 16px;
    padding-left: 0;
  }

  .trigger {
    line-height: 64px;
    font-size: 20px;
    padding-right: 16px;
    padding-left: 16px;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: #1890ff;
    }
  }

  .content {
    margin: 16px;
    padding: 16px;
    background: #fff;
    min-height: 280px;
    overflow-y: auto;
  }
}
</style>
