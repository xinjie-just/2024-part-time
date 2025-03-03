<!-- 登录 -->
<template>
  <div class="page">
    <div class="container">
      <h1 class="title">登 录</h1>
      <a-form layout="vertical" :label-col="{ span: 4 }" :rules="rules" ref="formRef" autocomplete="off" :model="form"
        :disabled="loading">
        <a-form-item label="用户名" name="username">
          <a-input v-model:value.trim="form.username" showCount :maxlength="16" allow-clear
            placeholder="请输入用户名（2-16 位字符）" @pressEnter="onSubmit">
            <template #prefix>
              <UserOutlined />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item label="密码" name="password">
          <a-input-password v-model:value.trim="form.password" showCount :maxlength="16"
            placeholder="请输入密码（6-16 位，必须包含数字和字母）" allow-clear @pressEnter="onSubmit">
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item name="remember">
          <a-flex justify="space-between" :align="'center'">
            <a-checkbox v-model:checked="form.remember" :disabled="loading">记住我</a-checkbox>
            <a-button type="link" @click="onResetPassword" size="small" :disabled="loading">忘记密码</a-button>
          </a-flex>
        </a-form-item>
        <a-form-item>
          <a-button block type="primary" :disabled="disabled || loading" :loading="loading"
            @click="onSubmit">登录</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="footer">
      Copyright@2024 驼背信息科技成都有限责任公司版权所有 <a href="http://beian.miit.gov.cn/" target="_blank">蜀ICP备2024096901号-1</a>
    </div>
  </div>

  <reset-password v-if="visible" @cancel="onCancel" @confirm="onConfirm" />
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import { Rule } from 'ant-design-vue/es/form';
import { login, getUserInfo } from '@/services';
import { message } from 'ant-design-vue';
import { encryption } from '@/utils';

interface ILogin {
  username: string;
  password: string;
  remember: boolean;
}
const resetPassword = defineAsyncComponent(() => import('@/views/resetPassword.vue'));
const visible = ref(false);

const router = useRouter();
const formRef = ref();
const loading = ref(false);

const form: UnwrapRef<ILogin> = reactive({
  username: '',
  password: '',
  remember: false
});
const disabled = computed((): boolean => {
  const values = formRef.value?.getFieldsValue();
  const usernameDisabled = values?.username?.trim()?.length < 2;
  const passwordDisabled = !/^(?=.*[0-9])(?=.*[a-zA-Z]).{6,16}$/.test(values?.password.trim());
  return usernameDisabled || passwordDisabled;
});

const validateUsername = async (_rule: Rule, value: string) => {
  const username = value.trim();
  if (username === '') {
    return Promise.reject('请输入用户名');
  } else if (username?.length < 2) {
    return Promise.reject('用户名应该 2-16 位');
  } else {
    return Promise.resolve();
  }
};

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
  username: [{ required: true, validator: validateUsername, trigger: 'change' }],
  password: [{ required: true, validator: validatePassword, trigger: 'blur' }]
};

onMounted(() => {
  const username = localStorage.getItem('username');
  if (username) {
    form.username = username;
    form.remember = true;
  }
});

const onSubmit = async (): Promise<void> => {
  try {
    await formRef.value?.validate();
    // 这里可以添加提交表单的逻辑
    loading.value = true;
    const params = {
      loginName: form.username,
      password: encryption(form.password)
    };
    login(params)
      .then((res) => {
        const result = res.data;
        const token = result.token || "";

        if (form.remember) {
          localStorage.setItem('username', form.username);
        } else {
          localStorage.removeItem('username');
        }
        // 登录后存一份 token，后续通过本地存储中有没有 token 来判断用户有没有登录
        localStorage.setItem('token', token);

        getUserInfoFn();
      })
      .catch(() => {
        loading.value = false;
      })
  } catch (error) {
    message.warning('表单验证失败')
    loading.value = false;
  }
};

const getUserInfoFn = () => {
  getUserInfo()
    .then((res) => {
      const result = res.data;
      localStorage.setItem('userInfo', JSON.stringify(result));

      router.push('/');
    })
    .finally(() => {
      loading.value = false;
    })
};

const onResetPassword = (): void => {
  visible.value = true;
};
const onCancel = (): void => {
  visible.value = false;
};
const onConfirm = (): void => {
  form.password = '';
  visible.value = false;
};
</script>
<style lang="scss" scoped>
.page {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #b8ebe9;
  position: relative;

  .container {
    width: 560px;
    padding: 32px;
    background-color: #e8faf4;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 48px;
    line-height: 48px;
    text-align: center;
    background-color: #e8faf4;
    color: #333;
    font-size: 12px;
  }

  .title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 48px;
    text-align: center;
  }
}
</style>
