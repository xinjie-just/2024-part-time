<!-- 编辑我的店铺 -->
<template>
  <a-modal v-model:open="visible" :mask-closable="false" :keyboard="false" :width="960" title="编辑我的店铺"
    :body-style="{ paddingTop: '32px', paddingBottom: '8px' }" @cancel="onCancel">
    <a-form :model="form" :rules="rules" ref="formRef" autocomplete="off" :label-col="{ span: 3 }">
      <a-form-item label="店铺名称" name="name">
        <a-input v-model:value.trim="form.name" :maxlength="30" allow-clear placeholder="请输入店铺名称（2-30 位字符）" />
      </a-form-item>
      <a-form-item label="店铺地址" name="address">
        <a-input v-model:value.trim="form.address" :maxlength="50" allow-clear placeholder="请输入店铺地址（2-50 位字符）" />
      </a-form-item>
      <a-form-item label="地图位置" name="location">
        <baidu-map :address="form.address" @setPoint="onSetPoint" :width="'100%'" :height="'300px'" />
      </a-form-item>
      <a-form-item label="店铺联系人" name="contact">
        <a-input v-model:value.trim="form.contact" :maxlength="6" allow-clear placeholder="请输入店铺联系人（不超过 6 个字符 ）" />
      </a-form-item>
      <a-form-item label="联系人电话" name="contactPhone">
        <a-input v-model:value.trim="form.contactPhone" :maxlength="11" allow-clear placeholder="请输入正确的手机号码" />
      </a-form-item>
      <a-form-item label="店铺介绍" name="introduce">
        <rich-text id="introduce" :html="form.introduce" @blur="onBlur" />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button key="back" :disabled="loading" @click="onCancel">取消</a-button>
      <a-button key="submit" type="primary" :loading="loading" :disabled="disabled" @click="onSubmit">提交</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { IEditMyShop } from '@/models';
import { getMyShopDetails, updateMyShop } from '@/services';
import { message } from 'ant-design-vue';
import { Rule } from 'ant-design-vue/es/form';
import { ref, reactive, UnwrapRef, computed, onMounted, defineAsyncComponent, Ref } from 'vue';

interface IPoint { lat: number, lng: number };

const richText = defineAsyncComponent(() => import('@/components/richText.vue'));

const emits = defineEmits(['cancel', 'confirm']);
const visible = ref(true);

const form: UnwrapRef<IEditMyShop> = reactive({
  name: '',
  address: '',
  contact: '',
  contactPhone: '',
  introduce: ''
});
const formRef = ref();
const loading = ref(false);
const point: Ref<IPoint> = ref({
  lat: 0,
  lng: 0
});

const disabled = computed((): boolean => {
  const values = formRef.value?.getFieldsValue();
  const nameDisabled = values?.name?.trim().length < 2;
  const addressDisabled = values?.address?.trim().length < 2;
  const contactDisabled = values?.contact?.trim().length < 1;
  const introduceDisabled = values?.introduce?.trim().length < 1;
  const contactPhoneDisabled = !/^1[3-9]\d{9}$/.test(values?.contactPhone?.trim());
  return (
    nameDisabled ||
    addressDisabled ||
    contactDisabled ||
    contactPhoneDisabled ||
    introduceDisabled
  );
});

const rules: Record<string, Rule[]> = {
  name: [
    { required: true, message: '请输入店铺名称', trigger: 'change' },
    { pattern: /^.{2,30}$/, message: '店铺名称应该是 2-30 位字符！', trigger: 'blur' }
  ],
  address: [
    { required: true, message: '请输入店铺地址', trigger: 'change' },
    { pattern: /^.{2,30}$/, message: '店铺地址应该是 2-50 位字符！', trigger: 'blur' }
  ],
  contact: [{ required: true, message: '请输入店铺联系人', trigger: 'change' }],
  contactPhone: [
    { required: true, message: '请输入联系人电话', trigger: 'change' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的联系人手机号码！', trigger: 'blur' }
  ],
  introduce: [
    { required: true, message: '请输入店铺介绍', trigger: 'change' },
  ],
};

onMounted(() => {
  getDetails();
});

const getDetails = async (): Promise<void> => {
  const userInfoStr = localStorage.getItem('userInfo');
  if (userInfoStr) {
    const userInfo = JSON.parse(userInfoStr);
    const params = {
      id: userInfo?.shopId
    };
    getMyShopDetails(params).then((res) => {
      const data = res.data;
      form.name = data.shopName;
      form.address = data.address;
      form.contact = data.linkman;
      form.contactPhone = data.phone;
      form.introduce = data.introduce;
    })
  }
};

const onSetPoint = (data: IPoint) => {
  point.value = data;
};

const onBlur = (html: string) => {
  console.log("html", html);
  form.introduce = html;
};


const onSubmit = async (): Promise<void> => {
  loading.value = true;
  try {
    await formRef.value?.validate();
    console.log('表单验证成功', form);
    const userInfoStr = localStorage.getItem('userInfo');
    const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
    const params = {
      id: userInfo?.shopId,
      shopName: form.name.trim(),
      address: form.address.trim(),
      lonLat: `${point.value.lng},${point.value.lat}`,
      phone: form.contactPhone.trim(),
      linkman: form.contact.trim(),
      introduce: form.introduce.trim()
    };
    updateMyShop(params)
      .then(() => {
        message.success('我的店铺编辑成功');
        emits('confirm');
      })
      .finally(() => {
        loading.value = false;
      })
  } catch (error) {
    console.log('表单验证失败', error);
    loading.value = false;
  }
};

const onCancel = (): void => {
  emits('cancel');
};
</script>

<style lang="scss" scoped>
.canvas {
  cursor: pointer;
}
</style>
