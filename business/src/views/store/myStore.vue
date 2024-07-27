<!-- 我的店铺 -->
<template>
  <a-descriptions :column="1" title="基本信息" bordered size="small" :label-style="{ width: '120px' }"
    :content-style="{ wordBreak: 'break-all' }">
    <template #extra>
      <a-button type="primary" @click="onEditMyShop" class="btn">编辑</a-button>
      <a-button type="primary" ghost @click="onUpdatePassword" class="btn">修改密码</a-button>
      <a-button type="default" @click="onUpgrade" class="btn">升级店铺</a-button>
    </template>
    <a-descriptions-item label="店铺名称">店铺名称1店铺名称1店铺名称1店铺名称1店铺名称1店铺名称1</a-descriptions-item>
    <a-descriptions-item label="店铺地址">四川省成都市武侯区燃灯市东街14号</a-descriptions-item>
    <a-descriptions-item label="地图位置">
      <baidu-map :address="'四川省成都市武侯区燃灯市东街14号'" :width="'100%'" :height="'300px'" />
    </a-descriptions-item>
    <a-descriptions-item label="店铺联系人">张三</a-descriptions-item>
    <a-descriptions-item label="联系人电话">18227752001</a-descriptions-item>
    <a-descriptions-item
      label="店铺介绍">店铺介绍店铺介绍店铺介绍店铺介绍店铺介绍店铺介绍店铺介绍店铺介绍店铺介绍店铺介绍店铺介绍店铺介绍店铺介绍店铺介绍店铺介绍店铺介绍店铺介绍店铺介绍店铺介绍店铺介绍</a-descriptions-item>
  </a-descriptions>

  <update-password v-if="updatePasswordVisible" @cancel="onCancelUpdatePassword" />
  <edit-my-shop v-if="editMyShopVisible" @cancel="onCancelEditMyShop" @confirm="onConfirmEditMyShop" />

</template>

<script lang="ts" setup>
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';
import { createVNode, defineAsyncComponent, h, onMounted, ref } from 'vue';

const updatePassword = defineAsyncComponent(() => import('@/views/updatePassword.vue'));
const editMyShop = defineAsyncComponent(() => import('./components/editMyShop.vue'));
const baiduMap = defineAsyncComponent(() => import('@/components/baiduMap.vue'));
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
const onUpgrade = (): void => {
  Modal.confirm({
    title: '升级店铺确认',
    width: 520,
    icon: createVNode(ExclamationCircleOutlined),
    content: h('ul', { style: { padding: '16px 0', listStyleType: 'decimal' } }, [
      h('li', { style: { lineHeight: '24px', marginBottom: '16px' } }, '升级店铺后，店铺性质变为“自营”。'),
      h('li', { style: { lineHeight: '24px', } }, '升级后，店铺需要缴年费。缴费的逻辑为：账户的总收入达到*元时，账户自动扣费。'),
    ]),
    okText: '确认',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          message.success('店铺升级成功');
          getDetails();
          return resolve();
        }, 1000);
      }).catch(() => console.log('Oops errors!'));
    },
    onCancel() {
      console.log('Cancel');
    },
  });
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

.btn {
  &:not(:last-of-type) {
    margin-right: 16px;
  }
}
</style>
