<template>
  <!-- <a-config-provider :locale="locale"> -->
  <a-config-provider :locale="locale" :get-popup-container="getPopupContainer">
    <router-view #="{ Component }">
      <component :is="Component" />
    </router-view>
  </a-config-provider>
</template>

<script lang="ts" setup>
import zhCN from 'ant-design-vue/es/locale/zh_CN';
const locale = zhCN;
const getPopupContainer = (_, dialogContext) => {
  if (dialogContext) {
    return dialogContext.getDialogWrap();
  } else {
    return document.body;
  }
};
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
    width: 180px;
  }

  .select {
    width: 180px;
  }

  .reset-btn {
    margin-left: 16px;
  }
}

.pagination {
  margin-top: 16px;
  text-align: right;
}

// 给必填项添加红色星号
.required {
  label {
    &::before {
      margin-right: 4px;
      display: inline-block;
      color: #ff4d4f;
      font-size: 14px;
      line-height: 1;
      content: "*";
    }
  }
}

.ant-modal div[aria-hidden="true"] {
  display: none !important
}
</style>
