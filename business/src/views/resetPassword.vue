<!-- 重置登录密码 -->
<template>
  <a-modal v-model:open="visible" :width="640" :mask-closable="false" :keyboard="false" title="重置登录密码"
    :body-style="{ paddingTop: '32px', paddingBottom: '8px' }" @cancel="onCancel">
    <!-- 验证码发给店铺手机 -->
    <a-alert type="info" show-icon close-text="知道了" class="alert">
      <template #message>
        <p>图片验证码不区分大小写；</p>
        <p>图片验证码和手机号码都需要输入正确后才能获取短信验证码。</p>
      </template>
    </a-alert>
    <a-form :model="form" :rules="rules" ref="formRef" autocomplete="off" :label-col="{ span: 4 }" :disabled="loading">
      <a-form-item label="新密码" name="password">
        <a-input-password v-model:value.trim="form.password" type="password" allow-clear showCount :maxlength="16"
          placeholder="请输入密码（6-16 位，必须包含数字和字母）" />
      </a-form-item>
      <a-form-item label="重复新密码" name="checkPassword">
        <a-input-password v-model:value.trim="form.checkPassword" type="password" allow-clear showCount :maxlength="16"
          placeholder="请重复新密码（6-16 位，必须包含数字和字母）" />
      </a-form-item>
      <a-form-item label="图片验证码" name="imageCode">
        <a-input v-model:value.trim="form.imageCode" allow-clear placeholder="请输入图片验证码（不区分大小写）">
          <template #suffix>
            <canvas ref="canvasRef" width="96" height="22" class="canvas" @click="onChangeChars"></canvas>
          </template>
        </a-input>
      </a-form-item>
      <a-form-item label="手机号码" name="phone">
        <a-input v-model:value.trim="form.phone" showCount :maxlength="11" allow-clear placeholder="请输入正确手机号码" />
      </a-form-item>
      <a-form-item label="短信验证码" name="phoneCode">
        <a-input v-model:value.trim="form.phoneCode" showCount :maxlength="6" allow-clear placeholder="请输入短信验证码（6 位数字）">
          <template #suffix>
            <span v-if="hasSendCode" class="countdown">{{ countdown }}s 后重发</span>
            <template v-else>
              <button class="code-btn" :disabled="getPhoneCodeDisabled" @click="onSendPhoneCode">
                获取验证码
              </button>
            </template>
          </template>
        </a-input>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button key="back" :disabled="loading" @click="onCancel">取消</a-button>
      <a-button key="submit" type="primary" :loading="loading" :disabled="disabled" @click="onSubmit">提交</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { IResetPassword } from '@/models';
import { resetPassword, sendPhoneCode } from '@/services';
import { drawTextOnCanvas } from '@/utils';
import { message } from 'ant-design-vue';
import { Rule } from 'ant-design-vue/es/form';
import { ref, reactive, UnwrapRef, computed, onMounted, nextTick, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const emits = defineEmits(['cancel', 'confirm']);
const options = {
  source: 'ABDEGHQRSTUVWXYZabde23456789', // 取一些不容易混淆的字母和数字
  charCount: 4,
  spacing: 8,
  textFont: '16px Arial',
  textColor: '#333333',
  bgColor: '#ffffff'
};
const visible = ref(true);
const canvasRef = ref(null);
const randomText = ref('');

const form: UnwrapRef<IResetPassword> = reactive({
  password: '',
  checkPassword: '',
  imageCode: '',
  phoneCode: '',
  phone: '',
});
const formRef = ref();
const loading = ref(false);
const hasSendCode = ref(false);
const countdown = ref(0);
const timer = ref(0);

const disabled = computed((): boolean => {
  const values = formRef.value?.getFieldsValue();
  const passwordDisabled = !/^(?=.*[0-9])(?=.*[a-zA-Z]).{6,16}$/.test(values?.password?.trim());
  const checkPasswordDisabled = !/^(?=.*[0-9])(?=.*[a-zA-Z]).{6,16}$/.test(
    values?.checkPassword?.trim()
  );
  const imageCodeDisabled = values?.imageCode?.trim().length < options.charCount;
  const phoneCodeDisabled = !/^\d{6}$/.test(values?.phoneCode?.trim());
  const phoneDisabled = !/^1[3-9]\d{9}$/.test(values?.phone?.trim());
  return passwordDisabled || checkPasswordDisabled || imageCodeDisabled || phoneCodeDisabled || phoneDisabled;
});

const getPhoneCodeDisabled = computed((): boolean => {
  const values = formRef.value?.getFieldsValue();
  const imageCodeIncorrect = form.imageCode.trim().toLowerCase() !== randomText.value;
  const phoneDisabled = !/^1[3-9]\d{9}$/.test(values?.phone?.trim());
  return imageCodeIncorrect || phoneDisabled;
});

const validatePassword = async (_rule: Rule, value: string) => {
  const password = value.trim();
  if (password === '') {
    return Promise.reject('请输入新密码');
  } else if (!/^(?=.*[0-9])(?=.*[a-zA-Z]).{6,16}$/.test(password)) {
    return Promise.reject('新密码应该 6-16 位，必须包含数字和字母！');
  } else {
    if (form.checkPassword !== '') {
      formRef.value.validateFields('checkPassword');
    }
    return Promise.resolve();
  }
};
const validateCheckPassword = async (_rule: Rule, value: string) => {
  const checkPassword = value.trim();
  if (checkPassword === '') {
    return Promise.reject('请重复新密码');
  } else if (!/^(?=.*[0-9])(?=.*[a-zA-Z]).{6,16}$/.test(checkPassword)) {
    return Promise.reject('重复新密码应该 6-16 位，必须包含数字和字母！');
  } else if (checkPassword !== form.password) {
    return Promise.reject('两次输入新密码不匹配!');
  } else {
    return Promise.resolve();
  }
};
const validateImageCode = async (_rule: Rule, value: string) => {
  const imageCode = value.trim().toLowerCase();
  if (imageCode === '') {
    return Promise.reject('请输入图片验证码');
  } else if (imageCode !== randomText.value) {
    return Promise.reject('图片验证码输入不正确!');
  } else {
    return Promise.resolve();
  }
};
const validatePhoneCode = async (_rule: Rule, value: string) => {
  const phoneCode = value.trim();
  if (phoneCode === '') {
    return Promise.reject('请输入短信验证码');
  } else if (!/^\d{6}$/.test(phoneCode)) {
    return Promise.reject('短信验证码应该是 6 位数字!');
  } else {
    return Promise.resolve();
  }
};
const validatePhone = async (_rule: Rule, value: string) => {
  const phone = value.trim();
  if (phone === '') {
    return Promise.reject('请输入手机号码');
  } else if (!/^1[3-9]\d{9}$/.test(phone)) {
    return Promise.reject('手机号码格式不正确!');
  } else {
    return Promise.resolve();
  }
};

const rules: Record<string, Rule[]> = {
  password: [{ required: true, validator: validatePassword, trigger: 'blur' }],
  checkPassword: [{ required: true, validator: validateCheckPassword, trigger: 'blur' }],
  imageCode: [{ required: true, validator: validateImageCode, trigger: 'blur' }],
  phoneCode: [{ required: true, validator: validatePhoneCode, trigger: 'blur' }],
  phone: [{ required: true, validator: validatePhone, trigger: 'blur' }]
};

onMounted(async () => {
  await nextTick();
  getRandomText(canvasRef.value);
});

const getRandomText = (canvasRef): void => {
  randomText.value = drawTextOnCanvas(canvasRef, options).toLowerCase();
};

const onSubmit = async (): Promise<void> => {
  loading.value = true;
  try {
    await formRef.value?.validate();
    console.log('表单验证成功', form);
    const params = {
      newPassword: form.password,
      verifyCode: form.phoneCode,
      phone: form.phone
    };
    resetPassword(params)
      .then(() => {
        message.success('密码重置成功');
        const username = localStorage.getItem('username');
        localStorage.clear();
        sessionStorage.clear();
        if (username) {
          localStorage.setItem('username', username);
        }
        router.push('/login');
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

const onChangeChars = (): void => {
  getRandomText(canvasRef.value);
};

const onSendPhoneCode = (): void => {
  const params = {
    phone: form.phone,
  };
  sendPhoneCode(params); // 不需要处理返回值

  hasSendCode.value = true;
  countdown.value = 60;
  timer.value = window.setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      hasSendCode.value = false;
      countdown.value = 0;
      clearTimeout(timer.value); // 避免定时器重复执行
    }
  }, 1000);
};

const onCancel = (): void => {
  emits('cancel');
};

onBeforeUnmount(() => {
  clearTimeout(timer.value);
});
</script>

<style lang="scss" scoped>
.alert {
  margin-bottom: 24px;
}

.canvas {
  cursor: pointer;
}

.countdown {
  width: 96px;
  text-align: center;
  color: #007bff;
}

.code-btn {
  width: 96px;
  text-align: center;
  cursor: pointer;
  color: #007bff;
  background-color: transparent;

  &[disabled] {
    cursor: not-allowed;
    color: rgba(0, 0, 0, 0.25);
  }

  &:not([disabled]) {
    &:hover {
      color: #69b1ff;
    }
  }
}
</style>
