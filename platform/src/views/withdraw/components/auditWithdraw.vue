<template>
  <a-modal v-model:open="visible" :width="640" :mask-closable="false" :keyboard="false" title="审核提现申请记录"
    :body-style="{ paddingTop: '32px', paddingBottom: '8px' }" @cancel="onCancel">
    <a-form :model="form" :rules="rules" ref="formRef" autocomplete="off" :label-col="{ span: 4 }">
      <a-form-item label="处理方式" name="state">
        <a-radio-group v-model:value="form.state">
          <a-radio value="1">已处理</a-radio>
          <a-radio value="2">已拒绝</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="备注" name="remark">
        <a-textarea v-model:value="form.remark" maxlength="200" showCount allowClear placeholder="请输入备注"
          autosize="{ minRows: 2, maxRows: 6 }" />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button key="back" :disabled="loading" @click="onCancel">取消</a-button>
      <a-button key="submit" type="primary" :loading="loading" :disabled="disabled" @click="onSubmit">提交</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { auditWithdraw } from '@/services';
import { IAuditWithdrawReq } from '@/services/models';
import { message } from 'ant-design-vue';
import { Rule } from 'ant-design-vue/es/form';
import { ref, reactive, UnwrapRef, computed } from 'vue';

const emits = defineEmits(['cancel', 'confirm']);
const props = defineProps<{ id: number }>();

const visible = ref(true);
const form: UnwrapRef<IAuditWithdrawReq> = reactive({
  state: 1,
  remark: ''
});
const formRef = ref();
const loading = ref(false);

const disabled = computed((): boolean => {
  const values = formRef.value?.getFieldsValue();
  const remarkDisabled = values?.remark?.trim()?.length < 2;
  return remarkDisabled;
});

const rules: Record<string, Rule[]> = {
  remark: [
    { required: true, message: '请输入备注', trigger: 'change' },
    { min: 2, message: '2-200 位字符！', trigger: 'blur' }
  ],
};

const onSubmit = async (): Promise<void> => {
  loading.value = true;
  try {
    await formRef.value?.validate();
    const params = {
      id: props.id,
      state: +form.state,
      remark: form.remark // 备注
    };
    auditWithdraw(params)
      .then(() => {
        message.success('审核成功');
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

const onCancel = (): void => {
  emits('cancel');
};
</script>
