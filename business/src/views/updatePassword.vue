<!-- 修改密码 -->
<template>
    <a-modal v-model:open="isVisible" :width="640" :mask-closable="false" :keyboard="false" title="修改密码"
        :body-style="{ paddingTop: '32px', paddingBottom: '8px' }" @cancel="onCancel">
        <!-- 验证码发给店铺手机 -->
        <a-alert type="info" show-icon close-text="知道了" class="alert">
            <template #message>
                <p>图片验证码不区分大小，但必须输入正确后才能获取短信验证码；</p>
                <p>短信验证码将发给店铺手机，请注意查收。</p>
            </template>
        </a-alert>
        <a-form :model="form" :rules="rules" ref="formRef" autocomplete="off" :label-col="{ span: 4 }">
            <a-form-item label="新密码" name="password">
                <a-input-password v-model:value.trim="form.password" type="password" allowClear :maxlength="16"
                    placeholder="请输入密码（6-16 位，必须包含数字和字母）" />
            </a-form-item>
            <a-form-item label="重复新密码" name="checkPassword">
                <a-input-password v-model:value.trim="form.checkPassword" type="password" allowClear :maxlength="16"
                    placeholder="请重复新密码（6-16 位，必须包含数字和字母）" />
            </a-form-item>
            <a-form-item label="图片验证码" name="imageCode">
                <a-input v-model:value.trim="form.imageCode" allowClear placeholder="请输入图片验证码（不区分大小写）">
                    <template #suffix>
                        <canvas ref="canvasRef" width="96" height="22" class="canvas" @click="onChangeChars"></canvas>
                    </template>
                </a-input>
            </a-form-item>
            <a-form-item label="短信验证码" name="phoneCode">
                <a-input v-model:value.trim="form.phoneCode" :maxlength="6" allowClear placeholder="请输入短信验证码（6 位数字）">
                    <template #suffix>
                        <span v-if="hasSendCode" class="countdown">{{ countdown
                            }}s 后重发</span>
                        <template v-else>
                            <button v-if="hasValidatedPhone" class="code-btn"
                                :disabled="form.imageCode.trim().toLowerCase() !== randomText"
                                @click="onSendPhoneCode">获取验证码</button>
                            <a-popconfirm v-else :title="`短信验证码将发送到手机：${phone}，确认吗？`" placement="topRight" ok-text="确认"
                                cancel-text="放弃" @confirm="onSendPhoneCode">
                                <button class="code-btn"
                                    :disabled="form.imageCode.trim().toLowerCase() !== randomText">获取验证码</button>
                            </a-popconfirm>
                        </template>
                    </template>
                </a-input>
            </a-form-item>
        </a-form>
        <template #footer>
            <a-button key="back" :disabled="loading" @click="onCancel">取消</a-button>
            <a-button key="submit" type="primary" :loading="loading" :disabled="disabled"
                @click="onSubmit">提交</a-button>
        </template>
    </a-modal>
</template>

<script setup lang="ts">
import { IUpdatePassword } from '@/models';
import { drawTextOnCanvas } from '@/utils';
import { message } from 'ant-design-vue';
import { Rule } from 'ant-design-vue/es/form';
import { ref, reactive, UnwrapRef, computed, onMounted, nextTick, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const emits = defineEmits(['cancel']);
const options = {
    source: "ABDEGHQRSTUVWXYZabde23456789", // 取一些不容易混淆的字母和数字
    charCount: 4,
    spacing: 8,
    textFont: '16px Arial',
    textColor: '#333333',
    bgColor: "#ffffff"
};
const isVisible = ref(true);
const canvasRef = ref(null);
const randomText = ref('');

const form: UnwrapRef<IUpdatePassword> = reactive({
    password: '',
    checkPassword: '',
    imageCode: '',
    phoneCode: ''
});
const formRef = ref();
const loading = ref(false);
const hasSendCode = ref(false);
const countdown = ref(0);
const timer = ref(0);
const phone = ref('13888888888'); // 店铺手机号码，用于接收短信验证码 // TODO: 从后端获取
const hasValidatedPhone = ref(false); // 验证过手机号，重新发送时不再验证（退出登录除外）

const disabled = computed((): boolean => {
    const values = formRef.value?.getFieldsValue();
    const passwordDisabled = !/^(?=.*[0-9])(?=.*[a-zA-Z]).{6,16}$/.test(values?.password?.trim());
    const checkPasswordDisabled = !/^(?=.*[0-9])(?=.*[a-zA-Z]).{6,16}$/.test(values?.checkPassword?.trim());
    const imageCodeDisabled = values?.imageCode?.trim().length < options.charCount;
    const phoneCodeDisabled = !/^\d{6}$/.test(values?.phoneCode?.trim());
    return passwordDisabled || checkPasswordDisabled || imageCodeDisabled || phoneCodeDisabled;
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
        return Promise.reject("两次输入新密码不匹配!");
    } else {
        return Promise.resolve();
    }
};
const validateImageCode = async (_rule: Rule, value: string) => {
    const imageCode = value.trim().toLowerCase();
    if (imageCode === '') {
        return Promise.reject('请输入图片验证码');
    } else if (imageCode !== randomText.value) {
        return Promise.reject("图片验证码输入不正确!");
    } else {
        return Promise.resolve();
    }
};
const validatePhoneCode = async (_rule: Rule, value: string) => {
    const phoneCode = value.trim();
    if (phoneCode === '') {
        return Promise.reject('请输入短信验证码');
    } else if (!/^\d{6}$/.test(phoneCode)) {
        return Promise.reject("短信验证码应该是 6 位数字!");
    } else {
        return Promise.resolve();
    }
};

const rules: Record<string, Rule[]> = {
    password: [{ required: true, validator: validatePassword, trigger: 'blur' }],
    checkPassword: [{ required: true, validator: validateCheckPassword, trigger: 'blur' }],
    imageCode: [{ required: true, validator: validateImageCode, trigger: 'blur' }],
    phoneCode: [{ required: true, validator: validatePhoneCode, trigger: 'blur' }],
};

onMounted(async () => {
    const validated = localStorage.getItem('hasValidatedPhone');
    if (validated === 'true') {
        hasValidatedPhone.value = true;
    }

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
        // 这里可以添加提交表单的逻辑
        setTimeout(() => {
            loading.value = false;
            message.success('密码修改成功');
            const username = localStorage.getItem('username');
            localStorage.clear(); // 清除本地存储中的 token
            sessionStorage.clear(); // 清除本地存储中的 token
            if (username) {
                localStorage.setItem('username', username);
            }
            router.push('/login');
        }, 1000);
    } catch (error) {
        console.log('表单验证失败', error);
        loading.value = false;
    }
};

const onChangeChars = (): void => {
    getRandomText(canvasRef.value);
};

const onSendPhoneCode = (): void => {
    // 先验证图片验证码是否输入正确
    // const values = formRef.value?.getFieldsValue();
    // const imageCode = values?.imageCode?.trim().toLowerCase();
    // if (imageCode !== randomText.value) {
    //     message.error('图片验证码输入不正确');
    //     return;
    // }
    console.log('发送短信验证码');
    hasValidatedPhone.value = true;
    localStorage.setItem('hasValidatedPhone', JSON.stringify(true));

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
