<!-- 添加或编辑创意心愿 -->
<template>
  <a-modal v-model:open="visible" :mask-closable="false" :keyboard="false" :width="800"
    :title="props.isEdit ? '编辑创意心愿' : '添加创意心愿'" :body-style="{ paddingTop: '32px', paddingBottom: '8px' }"
    @cancel="onCancel">
    <a-alert type="info" class="alert">
      <template #message>
        <p>参考价值必须 ≤ 投币小额 * 10 * 竞猜位数 / 2，否则不能保存</p>
      </template>
    </a-alert>
    <a-form :model="form" :rules="rules" ref="formRef" autocomplete="off" :label-col="{ span: 4 }">
      <a-form-item label="创意心愿名称" name="name">
        <a-input v-model:value.trim="form.name" :maxlength="16" allow-clear placeholder="2-16 位字符" />
      </a-form-item>
      <a-form-item label="创意心愿标题" name="title">
        <a-input v-model:value.trim="form.title" :maxlength="16" allow-clear placeholder="2-16 位字符" />
      </a-form-item>
      <a-form-item label="参考价值" name="referenceValue">
        <a-input-number v-model:value="form.referenceValue" :min="0.01" :max="9999" :precision="2" placeholder="请输入参考价值"
          style="width: 100%">
          <template #addonBefore>￥</template>
          <template #addonAfter>（元）</template>
        </a-input-number>
      </a-form-item>
      <a-form-item label="投币小额" name="miniPrice">
        <a-input-number v-model:value="form.miniPrice" :min="0.01" :max="99999" :precision="2" placeholder="请输入投币小额"
          style="width: 100%">
          <template #addonBefore>￥</template>
          <template #addonAfter>（元）</template>
        </a-input-number>
      </a-form-item>
      <a-form-item label="竞猜位数" name="digit">
        <a-input-number v-model:value="form.digit" :min="1" :max="999" :precision="0" placeholder="请输入竞猜位数"
          style="width: 100%" />
      </a-form-item>
      <a-form-item label="创意心愿介绍" name="introduce">
        <rich-text id="introduce" :html="form.introduce" @blur="onBlur" />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button key="back" :disabled="loading" @click="onCancel">取消</a-button>
      <a-button key="submit" type="primary" :loading="loading" :disabled="disabled" @click="onSubmit">提交</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { IManageWishing } from '@/models';
import { saveWishing } from '@/services';
import { ISaveWishingReq } from '@/services/models';
import { message } from 'ant-design-vue';
import { Rule } from 'ant-design-vue/es/form';
import { ref, onMounted, computed, UnwrapRef, reactive, defineAsyncComponent } from 'vue';

const richText = defineAsyncComponent(() => import('@/components/richText.vue'));

const emits = defineEmits(['cancel', 'confirm']);
const props = defineProps<{ isEdit: boolean; goodsId: number }>();

const visible = ref(true);

const formRef = ref();
const loading = ref(false);
const form: UnwrapRef<IManageWishing> = reactive({
  name: '',
  title: '',
  introduce: '',
  referenceValue: 0.01,
  miniPrice: 0.01,
  digit: 1
});
const rules: Record<string, Rule[]> = {
  name: [
    { required: true, message: '请输入创意心愿名称', trigger: 'change' },
    { min: 2, message: '2-16 位字符！', trigger: 'blur' }
  ],
  title: [
    { required: true, message: '请输入创意心愿标题', trigger: 'change' },
    { min: 2, message: '2-16 位字符！', trigger: 'blur' }
  ],
  introduce: [
    { required: true, message: '请输入创意心愿介绍', trigger: 'change' },
  ],
  referenceValue: [{ required: true, message: '请输入参考价值', trigger: 'change' }],
  miniPrice: [{ required: true, message: '请输入投币小额', trigger: 'change' }],
  digit: [{ required: true, message: '请输入竞猜位数', trigger: 'change' }]
};

const disabled = computed((): boolean => {
  const values = formRef.value?.getFieldsValue();
  const nameDisabled = values?.name?.trim()?.length < 2;
  const titleDisabled = values?.title?.trim()?.length < 2;
  const referenceValueDisabled = !values?.referenceValue;
  const miniPriceDisabled = !values?.miniPrice;
  const digitDisabled = !values?.digit;

  const price = (values?.miniPrice * 10 * values?.digit) / 2;
  const priceDisabled = values?.referenceValue > price;
  return (
    nameDisabled ||
    titleDisabled ||
    referenceValueDisabled ||
    miniPriceDisabled ||
    digitDisabled ||
    priceDisabled
  );
});

onMounted(() => { });

const onBlur = (html: string) => {
  form.introduce = html;
};

const onSubmit = async (): Promise<void> => {
  loading.value = true;
  try {
    await formRef.value?.validate();
    const params: ISaveWishingReq = {
      name: form.name, // 商品名称
      title: form.title, // 商品标题
      price: form.referenceValue, // 商品价格
      guessDigit: form.digit, // 竞猜位数
      introduction: form.introduce, // 商品说明
      coinDrop: form.miniPrice, // 投币小额
    };
    if (props.isEdit) {
      params.id = props.goodsId;
    }
    saveWishing(params)
      .then(() => {
        loading.value = false;
        message.success(props.isEdit ? '创意心愿编辑成功' : '创意心愿添加成功');
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

<style lang="scss"></style>

<style lang="scss" scoped>
.alert {
  margin-bottom: 16px;
}
</style>
