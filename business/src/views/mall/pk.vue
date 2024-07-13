<!-- PK 品 -->
<template>
  <a-tabs v-model:activeKey="activeKey">
    <a-tab-pane key="1" tab="待售">
      <for-sale></for-sale>
    </a-tab-pane>
    <a-tab-pane key="2" tab="已售">
      <sold-out></sold-out>
    </a-tab-pane>
    <a-tab-pane key="3" tab="停售">
      <out-of-sale></out-of-sale>
    </a-tab-pane>
  </a-tabs>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, ref } from 'vue';
const activeKey = ref('1');

const forSale = defineAsyncComponent(() => import('./components/pk/forSale.vue'));
const soldOut = defineAsyncComponent(() => import('./components/pk/soldOut.vue'));
const outOfSale = defineAsyncComponent(() => import('./components/pk/outOfSale.vue'));
</script>

<style lang="scss"></style>

<style lang="scss" scoped></style>
