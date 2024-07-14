<!-- 添加或编辑商品 -->
<template>
    <a-modal v-model:open="isVisible" :width="640" :title="props.isEdit ? '编辑商品' : '添加商品'"
        :body-style="{ paddingTop: '24px' }" @cancel="onCancel">
        <a-alert type="info" class="alert">
            <template #message>
                <p>现价是指线上销售价</p>
                <p>现价必须 ≤（竞猜小价 * 10 * 竞猜位数）/ 2，否则不能提交</p>
            </template>
        </a-alert>
        <a-form :model="form" :rules="rules" ref="formRef" autocomplete="off" :label-col="{ span: 4 }">
            <a-form-item label="商品名称" name="name">
                <a-input v-model:value.trim="form.name" :maxlength="16" allowClear placeholder="2-16 位字符" />
            </a-form-item>
            <a-form-item label="商品标题" name="title">
                <a-input v-model:value.trim="form.title" :maxlength="16" allowClear placeholder="2-16 位字符" />
            </a-form-item>
            <a-form-item label="商品介绍" name="introduce">
                <a-textarea v-model:value.trim="form.introduce" :maxlength="200" show-count allowClear
                    :auto-size="{ minRows: 2, maxRows: 6 }" placeholder="2-200 位字符" />
            </a-form-item>
            <a-form-item label="原价" name="originalPrice">
                <a-input-number v-model:value="form.originalPrice" :min="0.01" :max="9999" :precision="2"
                    placeholder="请输入原价" style="width: 100%">
                    <template #addonBefore>￥</template>
                    <template #addonAfter>（元）</template>
                </a-input-number>
            </a-form-item>
            <a-form-item label="结算价" name="settlementPrice">
                <a-input-number v-model:value="form.settlementPrice" :min="0.01" :max="9999" :precision="2"
                    placeholder="请输入结算价" style="width: 100%">
                    <template #addonBefore>￥</template>
                    <template #addonAfter>（元）</template>
                </a-input-number>
            </a-form-item>
            <a-form-item label="现价" name="currentPrice">
                <a-input-number v-model:value="form.currentPrice" :min="0.01" :max="9999" :precision="2"
                    placeholder="请输入现价" style="width: 100%">
                    <template #addonBefore>￥</template>
                    <template #addonAfter>（元）</template>
                </a-input-number>
            </a-form-item>
            <a-form-item label="竞猜小价" name="miniPrice">
                <a-input-number v-model:value="form.miniPrice" :min="0.01" :max="99999" :precision="2"
                    placeholder="请输入竞猜小价" style="width: 100%">
                    <template #addonBefore>￥</template>
                    <template #addonAfter>（元）</template>
                </a-input-number>
            </a-form-item>
            <a-form-item label="竞猜位数" name="digit">
                <a-input-number v-model:value="form.digit" :min="1" :max="999" :precision="0" placeholder="请输入竞猜位数"
                    style="width: 100%" />
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
import { IManageScan } from '@/models'
import { message } from 'ant-design-vue'
import { Rule } from 'ant-design-vue/es/form'
import { ref, onMounted, computed, UnwrapRef, reactive } from 'vue'

const emits = defineEmits(['cancel', 'confirm'])
const props = defineProps<{ isEdit: boolean; goodsId: number }>()

const isVisible = ref(true)

const formRef = ref()
const loading = ref(false)
const form: UnwrapRef<IManageScan> = reactive({
    name: '',
    title: '',
    introduce: '',
    originalPrice: 0.01,
    settlementPrice: 0.01,
    currentPrice: 0.01,
    miniPrice: 0.01,
    digit: 1,
})
const rules: Record<string, Rule[]> = {
    name: [
        { required: true, message: '请输入商品名称', trigger: 'change' },
        { min: 2, message: '2-16 位字符！', trigger: 'blur' }
    ],
    title: [
        { required: true, message: '请输入商品标题', trigger: 'change' },
        { min: 2, message: '2-16 位字符！', trigger: 'blur' }
    ],
    introduce: [
        { required: true, message: '请输入商品介绍', trigger: 'change' },
        { min: 2, message: '2-200 位字符！', trigger: 'blur' }
    ],
    originalPrice: [{ required: true, message: '请输入原价', trigger: 'change' }],
    settlementPrice: [{ required: true, message: '请输入结算价', trigger: 'change' }],
    currentPrice: [{ required: true, message: '请输入现价', trigger: 'change' }],
    miniPrice: [{ required: true, message: '请输入竞猜小价', trigger: 'change' }],
    digit: [{ required: true, message: '请输入竞猜位数', trigger: 'change' }]
}

const disabled = computed((): boolean => {
    const values = formRef.value?.getFieldsValue();
    const nameDisabled = values?.name?.trim()?.length < 2;
    const titleDisabled = values?.title?.trim()?.length < 2;
    const introduceDisabled = values?.introduce?.trim()?.length < 2;
    const originalPriceDisabled = !values?.originalPrice;
    const settlementPriceDisabled = !values?.settlementPrice;
    const currentPriceDisabled = !values?.currentPrice;
    const miniPriceDisabled = !values?.miniPrice;
    const digitDisabled = !values?.digit;

    const price = values?.miniPrice * 10 * values?.digit / 2;
    const priceDisabled = values?.currentPrice > price;
    return (
        nameDisabled ||
        titleDisabled ||
        introduceDisabled ||
        originalPriceDisabled ||
        settlementPriceDisabled ||
        currentPriceDisabled ||
        miniPriceDisabled ||
        digitDisabled ||
        priceDisabled
    )
})

onMounted(() => {
})

const onSubmit = async (): Promise<void> => {
    loading.value = true
    try {
        await formRef.value?.validate();
        console.log('表单验证成功', form);
        // 这里可以添加提交表单的逻辑
        setTimeout(() => {
            loading.value = false;
            message.success(props.isEdit ? '商品编辑成功' : '商品添加成功');
            emits('confirm');
        }, 1000)
    } catch (error) {
        console.log('表单验证失败', error);
        loading.value = false;
    }
}

const onCancel = (): void => {
    emits('cancel')
}
</script>

<style lang="scss"></style>

<style lang="scss" scoped>
.alert {
    margin-bottom: 16px;
}
</style>
