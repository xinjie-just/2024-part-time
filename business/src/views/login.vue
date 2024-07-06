<!-- 登录 -->
<template>
  <div class="page">
    <div class="container">
      <h1 class="title">登录</h1>
      <a-form :label-col="{ span: 4 }" size="large" :wrapper-col="{ span: 20 }" :model="loginForm"
        @submit="handleSubmit">
        <a-form-item label="手机号" name="phone"
          rules="[{ required: true, message: '请输入手机号!' }, { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确!' }]">
          <a-input v-model="loginForm.phone" placeholder="请输入手机号">
            <template #prefix>
              <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item label="验证码" name="code" rules="[{ required: true, message: '请输入验证码!' }]">
          <a-input v-model="loginForm.code" placeholder="请输入验证码">
            <template #suffix>
              <a-button size="small" type="'primary'">获取验证码</a-button>
            </template>
          </a-input>

        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 4, span: 20 }">
          <a-button block type="primary" html-type="submit">
            登录
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { UserOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const loginForm = reactive({
  phone: '',
  code: '',
});

const handleSubmit = (values: any) => {
  console.log('Received values of form: ', values);
  router.push('/');
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