<!-- 发送信息 -->
<template>
  <a-modal v-model:open="visible" :mask-closable="false" :keyboard="false" :width="560" title="发送信息"
    :body-style="{ paddingTop: '32px', paddingBottom: '8px' }" @cancel="onCancel">
    <div class="body">
      <p class="tips-item">您选中了 {{ selectedIds.length }} 个用户，确定要给它们发送信息吗？</p>
      <p class="tips-item strong">发送信息时，账户需要扣除 0.1 元/条的费用。</p>
      <div class="msg-wrap">
        <label for="msg" class="label">信息内容：</label>
        <a-textarea v-model:value.trim="msg" show-count :maxlength="100" placeholder="请输入信息内容（2-100字符）"
          :autosize="{ minRows: 2, maxRows: 6 }" class="textarea" />
      </div>
    </div>
    <template #footer>
      <a-button key="back" :disabled="loading" @click="onCancel">取消</a-button>
      <a-button key="submit" type="primary" :loading="loading" :disabled="disabled" @click="onSubmit">提交</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { sendMessage } from '@/services';
import { message } from 'ant-design-vue';
import { ref, computed } from 'vue';

const emits = defineEmits(['cancel', 'confirm']);
const props = defineProps<{ selectedIds: number[] }>();

const visible = ref(true);
const msg = ref('');
const loading = ref(false);
const disabled = computed((): boolean => {
  const msgDisabled = msg.value.trim().length < 2;
  return msgDisabled;
});

const onSubmit = async (): Promise<void> => {
  loading.value = true;
  const params = {
    memberIds: props.selectedIds,
    message: msg.value
  };
  sendMessage(params)
    .then(() => {
      message.success('信息发送成功');
      emits('confirm');
    })
    .finally(() => {
      loading.value = false;
    })
};

const onCancel = (): void => {
  emits('cancel');
};
</script>

<style lang="scss"></style>

<style lang="scss" scoped>
.msg-wrap {
  margin-top: 24px;
  display: flex;

  .label {
    display: block;
    margin-bottom: 8px;
  }

  .textarea {
    flex: 1;
  }
}

.tips-item {
  line-height: 24px;

  &:not(:last-child) {
    margin-bottom: 8px;
  }

  &.strong {
    font-weight: 700;
  }
}
</style>
