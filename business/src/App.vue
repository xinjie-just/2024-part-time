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

<style lang="scss">
.search {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 16px;

  .search-item {
    display: flex;
    align-items: center;
    margin-top: 4px;
    margin-bottom: 4px;

    &:not(:last-of-type) {
      margin-right: 24px;
    }
  }

  .label {
    min-width: fit-content;
  }

  .input {
    width: 200px;
  }

  .reset-btn {
    margin-left: 16px;
  }
}

.pagination {
  margin-top: 16px;
  text-align: right;
}
</style>