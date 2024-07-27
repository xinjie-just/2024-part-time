<!-- 线上商城-PK 品 -->
<template>
  <a-tabs v-model:activeKey="activeKey" size="large" destroy-inactive-tab-pane>
    <a-tab-pane key="1" tab="待售">
      <for-sale />
    </a-tab-pane>
    <a-tab-pane key="2" tab="停售">
      <out-of-sale />
    </a-tab-pane>
  </a-tabs>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, ref } from 'vue';
const activeKey = ref('1');

const forSale = defineAsyncComponent(() => import('./components/pk/forSale.vue'));
const outOfSale = defineAsyncComponent(() => import('./components/pk/outOfSale.vue'));
</script>
