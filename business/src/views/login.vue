<!-- 登录 -->
<template>
  <div class="page">
    <div class="container">
      <h1 class="title">登录</h1>
      <a-form :label-col="{ span: 4 }" :rules="rules" ref="formRef" autocomplete="off" size="large"
        :wrapper-col="{ span: 20 }" :model="form">
        <a-form-item label="手机号" name="phone">
          <a-input v-model:value="form.phone" placeholder="请输入正确的手机号" :maxlength="11" @pressEnter="onSubmit">
            <template #prefix>
              <PhoneOutlined style="color: rgba(0, 0, 0, 0.25)" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item label="验证码" name="code">
          <a-input v-model:value="form.code" placeholder="请输入验证码（6 位数字）" :maxlength="6" @pressEnter="onSubmit">
            <template #suffix>
              <a-button size="small" type="'primary'">获取验证码</a-button>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 4, span: 20 }">
          <a-button block type="primary" :disabled="disabled || loading" :loading="loading" @click="onSubmit">
            登录
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, UnwrapRef } from 'vue';
import { PhoneOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import { Rule } from 'ant-design-vue/es/form';

interface ILogin {
  phone: string;
  code: string;
}

const router = useRouter();
const formRef = ref();
const loading = ref(false);

const form: UnwrapRef<ILogin> = reactive({
  phone: '',
  code: '',
});
const disabled = computed(() => {
  const values = formRef.value?.getFieldsValue();
  const phoneDisabled = !/^1[3-9]\d{9}$/.test(values?.phone?.trim());
  const codeDisabled = !/^\d{6}$/.test(values?.code?.trim());
  return phoneDisabled || codeDisabled;
});

const rules: Record<string, Rule[]> = {
  phone: [
    { transform: (value: string) => value.trim() },
    { whitespace: true, message: '不能只包含空格！', trigger: 'change' },
    { required: true, message: '请输入手机号码', trigger: 'change' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号码格式不正确！', trigger: 'blur' },
  ],
  code: [
    { transform: (value: string) => value.trim() },
    { whitespace: true, message: '不能只包含空格！', trigger: 'change' },
    { required: true, message: '请输入验证码', trigger: 'change' },
    { pattern: /^\d{6}$/, message: '验证码是 6 位数字！', trigger: 'blur' },
  ],
};

const onSubmit = async () => {
  try {
    await formRef.value?.validate();
    console.log('表单验证成功', form);
    // 这里可以添加提交表单的逻辑
    loading.value = true;
    setTimeout(() => {
      loading.value = false;
      router.push('/');
    }, 2000)
  } catch (error) {
    console.log('表单验证失败', error);
  }
};
</script>
<style lang="scss" scoped>
.page {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #b8ebe9;

  .container {
    width: 560px;
    padding: 32px;
    background-color: #e8faf4;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 48px;
    text-align: center;
  }
}
</style>