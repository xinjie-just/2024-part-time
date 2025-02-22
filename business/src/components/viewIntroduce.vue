<template>
    <a-modal v-model:open="visible" :width="800" :mask-closable="false" :keyboard="false" :title="title || '预览介绍'"
        :body-style="{ paddingTop: '32px', paddingBottom: '8px' }" @cancel="onCancel">
        <div v-html="html" class="html-content"></div>
        <template #footer>
            <a-button key="submit" type="primary" @click="onCancel">知道了</a-button>
        </template>
    </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const visible = ref(true);
const emits = defineEmits(['cancel']);

defineProps<{ html: string, title: string }>();
const onCancel = (): void => {
    emits('cancel');
};
</script>

<style lang="scss">
.html-content {
    img {
        display: block;
        max-width: 100%;
        height: auto;
    }
}
</style>