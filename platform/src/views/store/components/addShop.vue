<template>
  <a-modal v-model:open="visible" :width="640" :mask-closable="false" :keyboard="false" title="添加店铺"
    :body-style="{ paddingTop: '32px', paddingBottom: '8px' }" @cancel="onCancel">
    <a-form :model="form" :rules="rules" ref="formRef" autocomplete="off" :label-col="{ span: 4 }">
      <a-form-item label="店铺名称" name="shopName">
        <a-input v-model:value.trim="form.shopName" showCount :maxlength="30" allow-clear placeholder="2-30 位字符" />
      </a-form-item>
      <a-form-item label="手机号码" name="phone">
        <a-input v-model:value.trim="form.phone" showCount :maxlength="11" allow-clear placeholder="请输入正确手机号码" />
      </a-form-item>
      <a-form-item label="密码" name="password">
        <a-input-password v-model:value.trim="form.password" showCount :maxlength="16" allow-clear
          placeholder="6-16 位，必须包含数字和字母" />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button key="back" :disabled="loading" @click="onCancel">取消</a-button>
      <a-button key="submit" type="primary" :loading="loading" :disabled="disabled" @click="onSubmit">提交</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { addShop } from '@/services';
import { IAddShopReq } from '@/services/models';
import { encryption } from '@/utils';
import { message } from 'ant-design-vue';
import { Rule } from 'ant-design-vue/es/form';
import { ref, reactive, UnwrapRef, computed } from 'vue';

const emits = defineEmits(['cancel', 'confirm']);

const visible = ref(true);
const form: UnwrapRef<IAddShopReq> = reactive({
  shopName: '',
  phone: '',
  password: ''
});
const formRef = ref();
const loading = ref(false);
const disabled = computed((): boolean => {
  const values = formRef.value?.getFieldsValue();
  const shopNameDisabled = values?.shopName?.trim()?.length < 2;
  const phoneDisabled = !/^1[3-9]\d{9}$/.test(values?.phone?.trim());
  const passwordDisabled = !/^(?=.*[0-9])(?=.*[a-zA-Z]).{6,16}$/.test(values?.password?.trim());
  return shopNameDisabled || phoneDisabled || passwordDisabled;
});

const rules: Record<string, Rule[]> = {
  shopName: [
    { required: true, message: '请输入店铺名称', trigger: 'change' },
    { min: 2, message: '2-30 位字符！', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'change' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号码格式不正确！', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'change' },
    {
      pattern: /^(?=.*[0-9])(?=.*[a-zA-Z]).{6,16}$/,
      message: '6-16 位，必须包含数字和字母！',
      trigger: 'blur'
    }
  ]
};

const onSubmit = async (): Promise<void> => {
  loading.value = true;
  try {
    await formRef.value?.validate();
    const params = {
      shopName: form.shopName,
      phone: form.phone,
      password: encryption(form.password)
    };
    addShop(params)
      .then(() => {
        message.success('店铺添加成功');
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
