<!-- 添加 PK 手 -->
<template>
    <a-modal v-model:open="isVisible" :mask-closable="false" :keyboard="false" :width="640" title="添加 PK 手"
        :body-style="{ paddingTop: '24px', maxHeight: '500px', overflowY: 'scroll' }" @cancel="onCancel">
        <a-form :model="form" :rules="rules" ref="formRef" autocomplete="off" :label-col="{ span: 4 }">
            <a-form-item label="PK 手名称" name="name">
                <a-input v-model:value.trim="form.name" :maxlength="30" allowClear placeholder="2-30 位字符" />
            </a-form-item>
            <a-form-item label="手机号码" name="phone">
                <a-input v-model:value.number.trim="form.phone" :maxlength="11" allowClear placeholder="请输入正确手机号码" />
            </a-form-item>
            <a-form-item label="胜率" name="winningPercentage">
                <a-input-number v-model:value="form.winningPercentage" :min="0.01" :max="99.99" :precision="2"
                    placeholder="请输入胜率" style="width: 100%">
                    <template #addonAfter>%</template>
                </a-input-number>
            </a-form-item>
            <a-form-item label="积分" name="points">
                <a-input-number v-model:value="form.points" :min="0" :max="9999" :precision="0" placeholder="请输入积分"
                    style="width: 100%" />
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
import { IAddPKHandle } from '@/models';
import { message } from 'ant-design-vue';
import { Rule } from 'ant-design-vue/es/form';
import { ref, reactive, UnwrapRef, computed, onMounted } from 'vue';

const emits = defineEmits(['cancel', 'confirm']);

const isVisible = ref(true);
const form: UnwrapRef<IAddPKHandle> = reactive({
    name: '',
    phone: '',
    winningPercentage: 0.01,
    points: 0
});

const formRef = ref();
const loading = ref(false);
const disabled = computed((): boolean => {
    const values = formRef.value?.getFieldsValue();
    console.log("values", values);
    const nameDisabled = values?.name?.trim()?.length < 2;
    const phoneDisabled = !/^1[3-9]\d{9}$/.test(values?.phone);
    const winningPercentageDisabled = !values?.winningPercentage;
    const pointsDisabled = values?.points === undefined || values?.points === null;

    return nameDisabled || phoneDisabled || winningPercentageDisabled || pointsDisabled;
});

const rules: Record<string, Rule[]> = {
    name: [
        { required: true, message: '请输入 PK 手名称', trigger: 'change' },
        { min: 2, message: '2-30 位字符！', trigger: 'blur' },
    ],
    phone: [
        { required: true, message: '请输入手机号码', trigger: 'change' },
        { pattern: /^1[3-9]\d{9}$/, message: '手机号码格式不正确！', trigger: 'blur' },
    ],
    winningPercentage: [
        { required: true, message: '请输入胜率', trigger: 'change' },
    ],
    points: [
        { required: true, message: '请输入积分', trigger: 'change' },
    ],
};

onMounted(() => {
})

const onSubmit = async (): Promise<void> => {
    loading.value = true;
    try {
        await formRef.value?.validate();
        console.log('表单验证成功', form);
        // 这里可以添加提交表单的逻辑
        setTimeout(() => {
            loading.value = false;
            message.success('PK 手添加成功');
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
