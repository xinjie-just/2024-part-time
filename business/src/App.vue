<template>
  <a-config-provider :locale="locale">
    <router-view #="{ Component }">
      <component :is="Component" />
    </router-view>
  </a-config-provider>
</template>

<script lang="ts" setup>
import zhCN from 'ant-design-vue/es/locale/zh_CN';
const locale = zhCN;
</script>