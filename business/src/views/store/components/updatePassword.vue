<!-- 修改密码 -->
<template>
    <a-modal v-model:open="isVisible" title="修改密码" :body-style="{ paddingTop: '24px' }" @cancel="onCancel">
        <a-form :model="form" :rules="rules" ref="formRef" autocomplete="off" :label-col="{ span: 5 }">
            <a-form-item label="新密码" name="password">
                <a-input-password v-model:value="form.password" type="password" allowClear :maxlength="16"
                    placeholder="请输入密码（6-16 位，必须包含数字和字母）" />
            </a-form-item>
            <a-form-item label="重复新密码" name="checkPassword">
                <a-input-password v-model:value="form.checkPassword" type="password" allowClear :maxlength="16"
                    placeholder="请重复新密码（6-16 位，必须包含数字和字母）" />
            </a-form-item>
            <a-form-item label="图片验证码" name="imageCode">
                <a-input v-model:value="form.imageCode" allowClear placeholder="请输入图片验证码（不区分大小写）">
                    <template #suffix>
                        <canvas ref="canvasRef" width="80" height="22" class="canvas" @click="onChangeChars"></canvas>
                    </template>
                </a-input>
            </a-form-item>
            <a-form-item label="手机验证码" name="phoneCode">
                <a-input v-model:value="form.phoneCode" :maxlength="6" allowClear placeholder="请输入手机验证码（6 位数字）" />
            </a-form-item>
        </a-form>
        <template #footer>
            <a-button key="back" @click="onCancel">取消</a-button>
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
import { ref, reactive, UnwrapRef, computed, onMounted, nextTick } from 'vue';

const emits = defineEmits(['cancel', 'confirm']);
const options = {
    source: "ABDEGHQRSTUVWXYZabde23456789", // 取一些不容易混淆的字母和数字
    charCount: 4,
    spacing: 8,
    textFont: '16px Arial',
    textColor: '#333333', // 红色source: string
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

const disabled = computed((): boolean => {
    const values = formRef.value?.getFieldsValue();
    const passwordDisabled = !/^(?=.*[0-9])(?=.*[a-zA-Z]).{6,16}$/.test(values?.password?.trim());
    const checkPasswordDisabled = !/^(?=.*[0-9])(?=.*[a-zA-Z]).{6,16}$/.test(values?.checkPassword?.trim());
    const imageCodeDisabled = values?.imageCode?.trim().length < 1;
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

const rules: Record<string, Rule[]> = {
    password: [{ required: true, validator: validatePassword, trigger: 'blur' }],
    checkPassword: [{ required: true, validator: validateCheckPassword, trigger: 'blur' }],
    imageCode: [{ required: true, validator: validateImageCode, trigger: 'change' }],
    phoneCode: [
        { transform: (value: string) => value.trim() },
        { whitespace: true, message: '不能只包含空格！', trigger: 'change' },
        { required: true, message: '请输入手机验证码', trigger: 'change' },
        { pattern: /^\d{6}$/, message: '手机验证码应该是 6 位数字！', trigger: 'blur' },
    ],
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
        // 这里可以添加提交表单的逻辑
        setTimeout(() => {
            loading.value = false;
            message.success('密码修改成功');
            emits('confirm');
        }, 2000);
    } catch (error) {
        console.log('表单验证失败', error);
    }
};

const onChangeChars = (): void => {
    getRandomText(canvasRef.value);
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
