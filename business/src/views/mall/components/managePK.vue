<!-- 添加或编辑商品 -->
<template>
    <a-modal v-model:open="isVisible" :width="640" :title="props.isEdit ? '编辑商品' : '添加商品'"
        :body-style="{ paddingTop: '24px', maxHeight: '500px', overflowY: 'scroll' }" @cancel="onCancel">
        <a-form :model="form" :rules="rules" ref="formRef" autocomplete="off" :label-col="{ span: 4 }">
            <h2>{{ props.isEdit ? '编辑商品' : '添加商品' }}</h2>
        </a-form>
        <template #footer>
            <a-button key="back" @click="onCancel">取消</a-button>
            <a-button key="submit" type="primary" :loading="loading" :disabled="disabled"
                @click="onSubmit">提交</a-button>
        </template>
    </a-modal>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue';
import { ref, onMounted } from 'vue';

const emits = defineEmits(['cancel', 'confirm']);
const props = defineProps<{ isEdit: boolean, goodsId: number }>();

const isVisible = ref(true);

const formRef = ref();
const loading = ref(false);

onMounted(() => {
    console.log("goodsId", props.goodsId);
})

const onSubmit = async (): Promise<void> => {
    loading.value = true;
    try {
        await formRef.value?.validate();
        console.log('表单验证成功', form);
        // 这里可以添加提交表单的逻辑
        setTimeout(() => {
            loading.value = false;
            message.success(props.isEdit ? '商品编辑成功' : '商品添加成功');
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

<style lang="scss"></style>

<style lang="scss" scoped></style>