<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    :keyboard="false"
    title="添加账户"
    :width="560"
    :body-style="{ paddingTop: '32px', paddingBottom: '8px' }"
    @cancel="onCancel"
  >
    <a-form :model="form" :rules="rules" ref="formRef" autocomplete="off" :label-col="{ span: 4 }">
      <a-form-item label="开户银行" name="bank">
        <a-select
          v-model:value="form.bank"
          allow-clear
          :options="options"
          placeholder="请选择开户银行"
        />
      </a-form-item>
      <a-form-item label="账户姓名" name="name">
        <a-input
          v-model:value.trim="form.name"
          :maxlength="6"
          allow-clear
          placeholder="请输入账户姓名（2-6 个字符）"
        />
      </a-form-item>
      <a-form-item label="银行卡号" name="account">
        <a-tooltip
          :trigger="['focus']"
          placement="bottomLeft"
          color="blue"
          overlay-class-name="tips"
        >
          <template v-if="form.account" #title>{{ form.account }}</template>
          <a-input
            v-model:value.trim="form.account"
            :maxlength="19"
            allow-clear
            placeholder="请输入正确的银行卡号"
          />
        </a-tooltip>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button key="back" :disabled="loading" @click="onCancel">取消</a-button>
      <a-button
        key="submit"
        type="primary"
        :loading="loading"
        :disabled="disabled"
        @click="onSubmit"
        >提交</a-button
      >
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { IAddAccount } from '@/models';
import { message, SelectProps } from 'ant-design-vue';
import { Rule } from 'ant-design-vue/es/form';
import { ref, reactive, UnwrapRef, computed } from 'vue';

const emits = defineEmits(['cancel', 'confirm']);

const visible = ref(true);
const form: UnwrapRef<IAddAccount> = reactive({
  bank: 'ICBC',
  name: '',
  account: ''
});
const options = ref<SelectProps['options']>([
  { value: 'ICBC', label: '中国工商银行' },
  { value: 'ABC', label: '中国农业银行' },
  { value: 'BOC', label: '中国银行' },
  { value: 'CCB', label: '中国建设银行' },
  { value: 'BOCOM', label: '交通银行' },
  { value: 'PSBC', label: '中国邮政储蓄银行' },
  { value: 'CMB', label: '招商银行' },
  { value: 'PAIC', label: '平安银行' }
]);
const formRef = ref();
const loading = ref(false);
const disabled = computed((): boolean => {
  const values = formRef.value?.getFieldsValue();
  const bankDisabled = !values?.bank;
  const nameDisabled = values?.name?.trim().length < 2;
  const accountDisabled = !/^\d{16,19}$/.test(values?.account?.trim());
  return bankDisabled || nameDisabled || accountDisabled;
});

const rules: Record<string, Rule[]> = {
  bank: [{ required: true, message: '请选择银行', trigger: 'change' }],
  name: [
    { required: true, message: '请输入账户姓名', trigger: 'change' },
    { pattern: /^.{2,6}$/, message: '账户姓名应该 2-6 位！', trigger: 'blur' }
  ],
  account: [
    { required: true, message: '请输入银行卡号', trigger: 'change' },
    { pattern: /^\d{16,19}$/, message: '请输入正确的银行卡号！', trigger: 'blur' }
  ]
};

const onSubmit = async (): Promise<void> => {
  loading.value = true;
  try {
    await formRef.value?.validate();
    console.log('表单验证成功', form);
    // 这里可以添加提交表单的逻辑
    setTimeout(() => {
      loading.value = false;
      message.success('账户添加成功');
      emits('confirm');
    }, 1000);
  } catch (error) {
    console.log('表单验证失败', error);
    loading.value = false;
  }
};

const onCancel = (): void => {
  emits('cancel');
};
</script>

<style lang="scss">
.tips {
  letter-spacing: 2px;
  font-size: 18px;
  font-weight: 700;
  min-width: fit-content;
}
</style>
