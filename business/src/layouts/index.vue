<template>
  <a-layout class="layout">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" :width="256" collapsible>
      <div class="logo">logo</div>
      <a-menu v-model:openKeys="state.openKeys" v-model:selectedKeys="state.selectedKeys" mode="inline" theme="dark"
        :inline-collapsed="state.collapsed" :items="menus" @click="onSelectMenu" class="menu"></a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="header">
        <menu-unfold-outlined v-if="collapsed" class="trigger" @click="() => (collapsed = !collapsed)" />
        <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
      </a-layout-header>
      <!-- <a-breadcrumb :routes="menus">
        <template #itemRender="{ route }">
          <span v-if="routes.indexOf(route) === routes.length - 1">
            {{ route.name }}
          </span>
          <router-link v-else :to="'/'">
            {{ route.name }}
          </router-link>
        </template>
</a-breadcrumb> -->
      <a-layout-content class="content">
        <router-view #="{ Component }">
          <component :is="Component" />
        </router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script lang="ts" setup>

import { reactive, watch, h, ref, onMounted, Ref } from 'vue';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  MailOutlined,
  DesktopOutlined,
  InboxOutlined,
  AppstoreOutlined,
} from '@ant-design/icons-vue';
import router, { routes } from "@/routers";
import { IRouterType } from '@/models';
const state = reactive({
  collapsed: false,
  selectedKeys: ['1'],
  openKeys: ['sub1'],
  preOpenKeys: ['sub1'],
});
const collapsed = ref(false);
const menus: Ref<IRouterType[]> = ref([]);
watch(
  () => state.openKeys,
  (_val, oldVal) => {
    state.preOpenKeys = oldVal;
  },
);
const toggleCollapsed = () => {
  state.collapsed = !state.collapsed;
  state.openKeys = state.collapsed ? [] : state.preOpenKeys;
};

const onSelectMenu = ({ item }) => {
  console.log("item", item);
  router.push(item.path);
}

function convertToAntdMenu(menuData: IRouterType[]): IRouterType[] {
  return menuData.map(menuItem => {
    if (menuItem.children && menuItem.children.length > 0) {
      // 如果有子菜单，则创建一个 SubMenu 类型的对象  
      return {
        title: menuItem.name,
        label: menuItem.name,
        icon: menuItem.icon,
        key: menuItem.path,
        path: menuItem.path,
        children: convertToAntdMenu(menuItem.children.map(child => ({
          path: child.path,
          name: child.name,
          label: child.name,
        }))),
      };
    } else {
      // 如果没有子菜单，则创建一个 Item 类型的对象  
      return {
        title: menuItem.name,
        label: menuItem.name,
        icon: menuItem.icon,
        key: menuItem.path,
        path: menuItem.path,
      };
    }
  });
}

onMounted(() => {
  const newRoutes = routes.find(item => item.path === "/")?.children;
  const menuRoutes = newRoutes.filter(item => item.redirect !== "/");
  menus.value = convertToAntdMenu(menuRoutes);
})
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

  .header.header {
    background-color: #fff;
    display: flex;
    align-items: center;
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
  }

}
</style>
