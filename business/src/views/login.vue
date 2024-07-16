<!-- 登录 -->
<template>
  <div class="page">
    <div class="container">
      <h1 class="title">登 录</h1>
      <a-form layout="vertical" :label-col="{ span: 4 }" :rules="rules" ref="formRef" autocomplete="off" :model="form">
        <a-form-item label="用户名" name="username">
          <a-input v-model:value.trim="form.username" placeholder="请输入用户名" allowClear @pressEnter="onSubmit">
            <template #prefix>
              <UserOutlined />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item label="密码" name="password">
          <a-input-password v-model:value.trim="form.password" :maxlength="16" placeholder="请输入密码（6-16 位，必须包含数字和字母）"
            allowClear @pressEnter="onSubmit">
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item name="remember">
          <a-flex justify="space-between" :align="'center'">
            <a-checkbox v-model:checked="form.remember">记住我</a-checkbox>
            <a-button type="link" @click="onUpdatePassword" size="small">忘记密码</a-button>
          </a-flex>
        </a-form-item>
        <a-form-item>
          <a-button block type="primary" :disabled="disabled || loading" :loading="loading"
            @click="onSubmit">登录</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
  <update-password v-if="updatePasswordVisible" @cancel="onCancelUpdatePassword" @confirm="onConfirmUpdatePassword" />
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import { Rule } from 'ant-design-vue/es/form';

interface ILogin {
  username: string;
  password: string;
  remember: boolean;
}
const updatePassword = defineAsyncComponent(() => import('@/views/updatePassword.vue'));
const updatePasswordVisible = ref(false);

const router = useRouter();
const formRef = ref();
const loading = ref(false);

const form: UnwrapRef<ILogin> = reactive({
  username: '',
  password: '',
  remember: false,
});
const disabled = computed((): boolean => {
  const values = formRef.value?.getFieldsValue();
  const usernameDisabled = !values?.username?.trim();
  const passwordDisabled = !/^(?=.*[0-9])(?=.*[a-zA-Z]).{6,16}$/.test(values?.password.trim());
  return usernameDisabled || passwordDisabled;
});


const validatePassword = async (_rule: Rule, value: string) => {
  const password = value.trim();
  if (password === '') {
    return Promise.reject('请输入密码');
  } else if (!/^(?=.*[0-9])(?=.*[a-zA-Z]).{6,16}$/.test(password)) {
    return Promise.reject('密码应该 6-16 位，必须包含数字和字母！');
  } else {
    if (form.password !== '') {
      formRef.value.validateFields('checkPassword');
    }
    return Promise.resolve();
  }
};
const rules: Record<string, Rule[]> = {
  username: [
    { required: true, message: '请输入用户名码', trigger: 'change' },
  ],
  password: [
    { required: true, validator: validatePassword, trigger: 'blur' },
  ],
};

onMounted(() => {
  const username = localStorage.getItem('username');
  if (username) {
    form.username = username;
    form.remember = true;
  }
})

const onSubmit = async (): Promise<void> => {
  try {
    await formRef.value?.validate();
    console.log('表单验证成功', form);
    // 这里可以添加提交表单的逻辑
    loading.value = true;
    setTimeout(() => {
      loading.value = false;
      if (form.remember) {
        localStorage.setItem('username', form.username);
      } else {
        localStorage.removeItem('username');
      }
      router.push('/');
    }, 1000)
  } catch (error) {
    console.log('表单验证失败', error);
    loading.value = false;
  }
};

const onUpdatePassword = (): void => {
  updatePasswordVisible.value = true;
}
const onCancelUpdatePassword = (): void => {
  updatePasswordVisible.value = false;
}
const onConfirmUpdatePassword = (): void => {
  updatePasswordVisible.value = false;
}
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