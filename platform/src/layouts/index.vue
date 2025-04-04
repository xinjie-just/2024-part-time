<template>
  <a-layout class="layout">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" :width="256" collapsible>
      <div class="logo">
        <img src="../assets/logo.jpg" alt="logo" class="img">
      </div>
      <a-menu v-model:openKeys="state.openKeys" v-model:selectedKeys="state.selectedKeys" mode="inline" theme="dark"
        :items="menus" @click="onSelectMenu" class="menu"></a-menu>
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
      <a-layout-footer class="footer">
        Copyright@2024 驼背信息科技成都有限责任公司版权所有 <a href="http://beian.miit.gov.cn/" target="_blank">蜀ICP备2024096901号-1</a>
      </a-layout-footer>
    </a-layout>
  </a-layout>
  <update-password v-if="visible" @cancel="onCancel" />
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted, Ref, watch, createVNode, defineAsyncComponent, h } from 'vue';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
  QuestionCircleOutlined,
  DollarOutlined,
  AppstoreAddOutlined,
  SettingOutlined,
} from '@ant-design/icons-vue';
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
const menus: Ref<IRouterType[]> = ref([
  {
    icon: () => h(AppstoreAddOutlined),
    key: "/store/list",
    label: "店铺管理",
    path: "/store/list",
    title: "店铺管理"
  },
  {
    icon: () => h(SettingOutlined),
    key: "/config/list",
    label: "配置管理",
    path: "/config/list",
    title: "配置管理"
  },
  {
    icon: () => h(DollarOutlined),
    key: "/withdraw/list",
    label: "提现管理",
    path: "/withdraw/list",
    title: "提现管理"
  }
]);

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
  const token = localStorage.getItem('token');
  if (!token) {
    const path = route.path;
    localStorage.setItem('path', path);
    message.error('请先登录');
    router.push('/login');
    return;
  }
});

const onLogout = () => {
  Modal.confirm({
    title: '您确定要退出吗？',
    icon: createVNode(QuestionCircleOutlined),
    okType: 'danger',
    onOk() {
      logout().then(() => {
        const username = localStorage.getItem('username');
        localStorage.clear(); // 清除本地存储
        sessionStorage.clear();
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

    .img {
      display: block;
      width: 48px;
      height: 48px;
      margin: auto;
    }
  }

  .menu {
    flex: 1;
    overflow-y: auto;
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

  .footer {
    padding: 0;
    font-size: 12px;
    height: 40px;
    line-height: 40px;
    background-color: #fff;
    text-align: center;
  }
}
</style>
