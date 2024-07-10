<!-- 我的店铺 -->
<template>
  <a-descriptions :column="1" title="基本信息" bordered size="small" :label-style="{ width: '120px' }"
    :content-style="{ wordBreak: 'break-all' }">
    <template #extra>
      <a-button type="primary" @click="onEditMyShop">编辑</a-button>
      <a-button type="primary" ghost @click="onUpdatePassword" class="update-password-btn">修改密码</a-button>
    </template>
    <a-descriptions-item label="店铺名称">店铺名称1店铺名称1店铺名称1店铺名称1店铺名称1店铺名称1</a-descriptions-item>
    <a-descriptions-item label="店铺地址">四川省成都市武侯区燃灯市东街14号</a-descriptions-item>
    <a-descriptions-item label="地图位置">
      <img src="https://via.placeholder.com/450X200" alt="地图位置" class="img">
    </a-descriptions-item>
    <a-descriptions-item label="店铺联系人">张三</a-descriptions-item>
    <a-descriptions-item label="联系人电话">18227752001</a-descriptions-item>
    <a-descriptions-item
      label="店铺介绍">店铺介绍店铺介绍店铺介绍店铺介绍店铺介绍店铺介绍店铺介绍店铺介绍店铺介绍店铺介绍店铺介绍店铺介绍店铺介绍店铺介绍店铺介绍店铺介绍店铺介绍店铺介绍店铺介绍店铺介绍</a-descriptions-item>
  </a-descriptions>

  <update-password v-if="updatePasswordVisible" @cancel="onCancelUpdatePassword" @confirm="onConfirmUpdatePassword" />
  <edit-my-shop v-if="editMyShopVisible" @cancel="onCancelEditMyShop" @confirm="onConfirmEditMyShop" />
</template>


<script lang="ts" setup>
import { defineAsyncComponent, onMounted, ref } from 'vue';

const updatePassword = defineAsyncComponent(() => import('./components/updatePassword.vue'));
const editMyShop = defineAsyncComponent(() => import('./components/editMyShop.vue'));
const updatePasswordVisible = ref(false);
const editMyShopVisible = ref(false);

onMounted(() => {
  getDetails();
});

const getDetails = async (): Promise<void> => {
  // 模拟获取店铺详情
  // const store: IStore = {
  //   storeName: '店铺名称',
  //   phone: '18227752005',
  //   registrationTime: '2023-01-01 12:00:00',
  //   status: '代营',
  //   storeAddress: '四川省成都市武侯区燃灯市东街14号',
  // }
  // // 更新店铺信息
  // storeName.value = store.storeName;
  // phone.value = store.phone;
  // registrationTime.value = store.registrationTime;
  // status.value = store.status;
  // storeAddress.value = store.storeAddress;
}


const onUpdatePassword = (): void => {
  updatePasswordVisible.value = true;
}
const onCancelUpdatePassword = (): void => {
  updatePasswordVisible.value = false;
}
const onConfirmUpdatePassword = (): void => {
  updatePasswordVisible.value = false;
  getDetails();
}

const onEditMyShop = (): void => {
  editMyShopVisible.value = true;
}
const onCancelEditMyShop = (): void => {
  editMyShopVisible.value = false;
}
const onConfirmEditMyShop = (): void => {
  editMyShopVisible.value = false;
  getDetails();
}
</script>

<style lang="scss" scoped>
.img {
  display: block;
  max-width: 600px;
  min-width: 300px;
  max-height: 300px;
  min-height: 150px;
  height: auto;
  width: auto;
}

.update-password-btn {
  margin-left: 16px;
}
</style>
