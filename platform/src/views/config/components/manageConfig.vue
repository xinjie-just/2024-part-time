<template>
  <a-modal v-model:open="visible" :width="640" :mask-closable="false" :keyboard="false" title="添加店铺"
    :body-style="{ paddingTop: '32px', paddingBottom: '8px' }" @cancel="onCancel">
    <a-form :model="form" :rules="rules" ref="formRef" autocomplete="off" :label-col="{ span: 4 }">
      <a-form-item label="数据分类" name="type">
        <a-input v-model:value.trim="form.type" showCount :maxlength="10" allow-clear placeholder="2-10 位字符" />
      </a-form-item>
      <a-form-item label="数据名称" name="name">
        <a-input v-model:value.trim="form.name" showCount :maxlength="30" allow-clear placeholder="2-30 位字符" />
      </a-form-item>
      <a-form-item label="数据值" name="value">
        <a-input v-model:value.trim="form.value" showCount :maxlength="30" allow-clear placeholder="2-30 位字符" />
      </a-form-item>
      <a-form-item label="数据排序" name="sort">
        <a-input-number id="inputNumber" v-model:value="form.sort" :min="1" :max="99" />
      </a-form-item>
      <a-form-item label="数据备注" name="remark">
        <a-input v-model:value.trim="form.remark" showCount :maxlength="100" allow-clear placeholder="2-100 位字符" />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button key="back" :disabled="loading" @click="onCancel">取消</a-button>
      <a-button key="submit" type="primary" :loading="loading" :disabled="disabled" @click="onSubmit">提交</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { IGetConfigListRes, ISaveConfigReq } from '@/services/models';
import { message } from 'ant-design-vue';
import { Rule } from 'ant-design-vue/es/form';
import { ref, reactive, UnwrapRef, computed, onMounted } from 'vue';
import { saveConfig } from '@/services';

const emits = defineEmits(['cancel', 'confirm']);
const props = defineProps<{ isEdit: boolean; editInfo: IGetConfigListRes }>();

const visible = ref(true);
const form: UnwrapRef<ISaveConfigReq> = reactive({
  type: '',
  name: '',
  value: '',
  sort: 1,
  remark: ''
});
const formRef = ref();
const loading = ref(false);
const disabled = computed((): boolean => {
  const values = formRef.value?.getFieldsValue();
  const typeDisabled = values?.type?.trim()?.length < 2;
  const nameDisabled = values?.name?.trim()?.length < 2;
  const valueDisabled = values?.value?.trim()?.length < 2;
  return typeDisabled || nameDisabled || valueDisabled;
});

const rules: Record<string, Rule[]> = {
  type: [
    { required: true, message: '请输入数据分类', trigger: 'change' },
    { min: 2, message: '2-10 位字符！', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入数据名称', trigger: 'change' },
    { min: 2, message: '2-30 位字符！', trigger: 'blur' }
  ],
  value: [
    { required: true, message: '请输入数据值', trigger: 'change' },
    { min: 2, message: '2-30 位字符！', trigger: 'blur' }
  ]
};

onMounted(() => {
  if (props.isEdit) {
    const editInfo = props.editInfo;
    form.type = editInfo.type;
    form.name = editInfo.name;
    form.value = editInfo.value;
    form.sort = editInfo.sort;
    form.remark = editInfo.remark;
  }
});

const onSubmit = async (): Promise<void> => {
  loading.value = true;
  try {
    await formRef.value?.validate();
    const params: ISaveConfigReq = {
      type: form.type,
      name: form.name,
      value: form.value,
      sort: form.sort,
      remark: form.remark
    };
    if (props.isEdit) {
      params.id = props.editInfo.id;
    }
    saveConfig(params)
      .then(() => {
        message.success(props.isEdit ? '配置编辑成功' : '配置添加成功');
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
