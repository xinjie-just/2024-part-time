<!-- 线上商城-创意许愿 -->
<template>
  <a-tabs v-model:activeKey="activeKey" size="large" destroy-inactive-tab-pane>
    <a-tab-pane key="1" tab="可许心愿">
      <may-wishing />
    </a-tab-pane>
    <a-tab-pane key="3" tab="停许心愿">
      <stop-wishing />
    </a-tab-pane>
  </a-tabs>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, ref } from 'vue';
const activeKey = ref('1');

const mayWishing = defineAsyncComponent(() => import('./components/wishing/mayWishing.vue'));
const stopWishing = defineAsyncComponent(() => import('./components/wishing/stopWishing.vue'));
</script>
