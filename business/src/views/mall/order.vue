<!-- 订单管理 -->
<template>
  <a-tabs v-model:activeKey="activeKey" size="large" destroy-inactive-tab-pane>
    <a-tab-pane key="1" tab="PK 品">
      <p-k-order />
    </a-tab-pane>
    <a-tab-pane key="2" tab="扫一扫">
      <scan-order />
    </a-tab-pane>
    <a-tab-pane key="3" tab="创意许愿">
      <wishing-order />
    </a-tab-pane>
  </a-tabs>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, ref } from 'vue';
const activeKey = ref('1');

const PKOrder = defineAsyncComponent(() => import('./components/PKOrder.vue'));
const scanOrder = defineAsyncComponent(() => import('./components/scanOrder.vue'));
const wishingOrder = defineAsyncComponent(() => import('./components/wishingOrder.vue'));
</script>
