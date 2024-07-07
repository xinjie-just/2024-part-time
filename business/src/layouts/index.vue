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

import { reactive, ref, onMounted, Ref } from 'vue';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue';
import router, { routes } from "@/routers";
import { IRouterType } from '@/models';
import { useRoute } from 'vue-router';

const route = useRoute();

const state = reactive({
  selectedKeys: [''],
  openKeys: [''],
});
const collapsed = ref(false);
const menus: Ref<IRouterType[]> = ref([]);

const onSelectMenu = ({ item }) => {
  router.push(item.path);
}

/**
 * 将菜单数据转换为 Ant Design 的菜单格式
 * @param {IRouterType[]} menuData - 要转换的菜单数据数组
 * @returns {IRouterType[]} 转换后的菜单数据数组
 */
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

// 刷新页面，将菜单置为选中，并且将一级菜单打开
const handleMenu = () => {
  const path = route.path;
  state.selectedKeys = [path];
  // 判断是否为二级菜单，取最后一个 "/" 看是否为第一个字符
  const lastIndex = path.lastIndexOf("/");
  let parentPath = "";
  if (lastIndex !== 0) {
    parentPath = path.substring(0, lastIndex);
  }
  // 找到 path 为 parentPath 的那个菜单的 label
  const openKey = menus.value.find(item => item.path === parentPath)?.path;
  state.openKeys = [openKey as string];
}

onMounted(() => {
  const newRoutes = routes.find(item => item.path === "/")?.children;
  const menuRoutes = newRoutes.filter(item => item.redirect !== "/");
  menus.value = convertToAntdMenu(menuRoutes);
  handleMenu();
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
    overflow-y: auto;
  }

}
</style>
