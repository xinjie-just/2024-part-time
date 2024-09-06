<!-- 我的店铺 -->
<template>
  <a-descriptions :column="1" title="基本信息" bordered size="small" :label-style="{ width: '120px' }"
    :content-style="{ wordBreak: 'break-all' }">
    <template #extra>
      <a-button type="primary" @click="onEditMyShop" class="btn">编辑</a-button>
      <a-button type="primary" ghost @click="onUpdatePassword" class="btn">修改密码</a-button>
      <a-button type="default" @click="onUpgrade" class="btn">升级店铺</a-button>
    </template>
    <a-descriptions-item label="店铺名称">{{ store.shopName || '' }}</a-descriptions-item>
    <a-descriptions-item label="店铺地址">{{ store.address || '' }}</a-descriptions-item>
    <a-descriptions-item label="地图位置">
      <baidu-map :address="store.address" :width="'100%'" :height="'300px'" />
    </a-descriptions-item>
    <a-descriptions-item label="店铺联系人">{{ store.linkman || '' }}</a-descriptions-item>
    <a-descriptions-item label="联系人电话">{{ store.phone || '' }}</a-descriptions-item>
    <a-descriptions-item label="店铺介绍">{{ store.introduce || '' }}</a-descriptions-item>
  </a-descriptions>

  <update-password v-if="updatePasswordVisible" @cancel="onCancelUpdatePassword" />
  <edit-my-shop v-if="editMyShopVisible" @cancel="onCancelEditMyShop" @confirm="onConfirmEditMyShop" />
</template>

<script lang="ts" setup>
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';
import { createVNode, defineAsyncComponent, h, onMounted, Ref, ref } from 'vue';
import { getMyShopDetails, upgradeMyShop } from '@/services';
import { IGetShopDetailsRes } from '@/services/models';

const updatePassword = defineAsyncComponent(() => import('@/views/updatePassword.vue'));
const editMyShop = defineAsyncComponent(() => import('./components/editMyShop.vue'));
const baiduMap = defineAsyncComponent(() => import('@/components/baiduMap.vue'));
const updatePasswordVisible = ref(false);
const editMyShopVisible = ref(false);
const store: Ref<IGetShopDetailsRes> = ref({
  id: 0,
  type: 0,
  shopName: '',
  address: '',
  lonLat: '',
  phone: '',
  linkman: '',
  introduce: '',
  registerTime: '',
  state: 0
})

onMounted(() => {
  getDetails();
});

const getDetails = async (): Promise<void> => {
  const userInfoStr = localStorage.getItem('userInfo');
  const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
  const params = {
    id: userInfo?.shopId
  };
  getMyShopDetails(params).then((res) => {
    const data = res.data;
    store.value = data;
  })
};

const onUpdatePassword = (): void => {
  updatePasswordVisible.value = true;
};
const onCancelUpdatePassword = (): void => {
  updatePasswordVisible.value = false;
};

const onEditMyShop = (): void => {
  editMyShopVisible.value = true;
};
const onCancelEditMyShop = (): void => {
  editMyShopVisible.value = false;
};
const onConfirmEditMyShop = (): void => {
  editMyShopVisible.value = false;
  getDetails();
};
const onUpgrade = (): void => {
  Modal.confirm({
    title: '升级店铺确认',
    width: 520,
    icon: createVNode(ExclamationCircleOutlined),
    content: h('ul', { style: { padding: '16px 0', listStyleType: 'decimal' } }, [
      h(
        'li',
        { style: { lineHeight: '24px', marginBottom: '16px' } },
        '升级店铺后，店铺性质变为“自营”。'
      ),
      h(
        'li',
        { style: { lineHeight: '24px' } },
        '升级后，店铺需要缴年费。缴费的逻辑为：账户的总收入达到*元时，账户自动扣费。'
      )
    ]),
    okText: '确认',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      return new Promise<void>((resolve) => {
        upgradeMyShop().then(() => {
          message.success('店铺升级成功');
          getDetails();
          return resolve();
        })
      }).catch(() => console.log('操作失败!'));
    },
    onCancel() {
      console.log('Cancel');
    }
  });
};
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
