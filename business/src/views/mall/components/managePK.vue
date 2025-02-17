<!-- 添加或编辑商品 -->
<template>
  <a-modal v-model:open="visible" :mask-closable="false" :keyboard="false" :width="800"
    :title="props.isEdit ? '编辑 PK 品' : '添加 PK 品'" :body-style="{ paddingTop: '32px', paddingBottom: '8px' }"
    @cancel="onCancel">
    <a-alert type="info" class="alert">
      <template #message>
        <p>现价是指线上销售价</p>
        <p>结算价必须 ≤ 竞猜小价 * 10 ^ 竞猜位数 / PK 次数，否则不能提交</p>
      </template>
    </a-alert>
    <a-form :model="form" :rules="rules" ref="formRef" autocomplete="off" :label-col="{ span: 3 }">
      <a-form-item label="PK 品名称" name="name">
        <a-input v-model:value.trim="form.name" showCount :maxlength="30" allow-clear placeholder="2-30 位字符" />
      </a-form-item>
      <a-form-item label="商品标题" name="title">
        <a-input v-model:value.trim="form.title" showCount :maxlength="200" allow-clear placeholder="2-200 位字符" />
      </a-form-item>
      <a-form-item name="img">
        <template #label>
          <a-tooltip placement="topLeft">
            <template #title>
              <p>图片大小：不超过 5MB</p>
              <p>图片格式：只能是 jpg、jpeg、png</p>
            </template>
            商品图片
            <QuestionOutlined />
          </a-tooltip>
        </template>
        <a-upload v-model:file-list="fileList" :max-count="1" :accept="acceptType" :beforeUpload="beforeUpload"
          list-type="picture" :action="uploadFilePath" :headers="{ token }" @change="onChangeImg" @remove="onRemoveImg">
          <a-button :loading="uploading">
            <UploadOutlined />
            上传
          </a-button>
          <span></span>
        </a-upload>
      </a-form-item>
      <a-form-item label="原价" name="originalPrice">
        <a-input-number v-model:value="form.originalPrice" :min="0.01" :max="9999" :precision="2" placeholder="请输入原价"
          style="width: 100%">
          <template #addonBefore>￥</template>
          <template #addonAfter>（元）</template>
        </a-input-number>
      </a-form-item>
      <a-form-item label="现价" name="currentPrice">
        <a-input-number v-model:value="form.currentPrice" :min="0.01" :max="9999" :precision="2" placeholder="请输入现价"
          style="width: 100%">
          <template #addonBefore>￥</template>
          <template #addonAfter>（元）</template>
        </a-input-number>
      </a-form-item>
      <a-form-item label="结算价" name="settlementPrice">
        <a-input-number v-model:value="form.settlementPrice" :min="0.01" :max="9999" :precision="2" placeholder="请输入结算价"
          style="width: 100%">
          <template #addonBefore>￥</template>
          <template #addonAfter>（元）</template>
        </a-input-number>
      </a-form-item>
      <a-form-item label="竞猜小价" name="minPrice">
        <a-input-number v-model:value="form.minPrice" :min="0.01" :max="99999" :precision="2" placeholder="请输入竞猜小价"
          style="width: 100%">
          <template #addonBefore>￥</template>
          <template #addonAfter>（元）</template>
        </a-input-number>
      </a-form-item>
      <a-form-item label="竞猜位数" name="digit">
        <a-input-number v-model:value="form.digit" :min="1" :max="999" :precision="0" placeholder="请输入竞猜位数"
          style="width: 100%" />
      </a-form-item>
      <a-form-item label="PK 次数" name="times">
        <a-input-number v-model:value="form.times" :min="1" :max="99" :precision="0" placeholder="请输入 PK 次数"
          style="width: 100%" />
      </a-form-item>
      <a-form-item label="商品介绍" name="introduce">
        <rich-text id="introduce" :html="form.introduce" @blur="onBlur" />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button key="view" type="primary" ghost :disabled="!form.introduce.length" @click="onViewViewIntroduce"
        class="view-btn">预览商品介绍</a-button>
      <a-button key="back" :disabled="loading" @click="onCancel">取消</a-button>
      <a-button key="submit" type="primary" :loading="loading" :disabled="disabled" @click="onSubmit">提交</a-button>
    </template>
  </a-modal>

  <view-introduce v-if="viewVisible" :html="form.introduce" :title="'预览商品介绍'" @cancel="onCancelViewIntroduce" />
</template>

<script setup lang="ts">
import { IManagePK } from '@/models';
import { getPKDetails, savePK, uploadFilePath, defaultOrigin } from '@/services';
import { ISavePKReq } from '@/services/models';
import { message, Upload } from 'ant-design-vue';
import { Rule } from 'ant-design-vue/es/form';
import { ref, onMounted, computed, UnwrapRef, reactive, defineAsyncComponent } from 'vue';
import { UploadOutlined, QuestionOutlined } from '@ant-design/icons-vue';
import type { UploadChangeParam, UploadProps } from 'ant-design-vue';

const richText = defineAsyncComponent(() => import('@/components/richText.vue'));
const viewIntroduce = defineAsyncComponent(() => import('@/components/viewIntroduce.vue'));

const emits = defineEmits(['cancel', 'confirm']);
const props = defineProps<{ isEdit: boolean; goodsId: number }>();

const visible = ref(true);
const viewVisible = ref(false);
const fileList = ref<UploadProps['fileList']>([]);
const uploading = ref(false);
const acceptType = ".jpeg,.jpg,.png";
const token = localStorage.getItem('token');
const imgUrl = ref('');

const formRef = ref();
const loading = ref(false);
const form: UnwrapRef<IManagePK> = reactive({
  name: '',
  title: '',
  img: '',
  introduce: '',
  originalPrice: 0.01,
  settlementPrice: 0.01,
  currentPrice: 0.01,
  minPrice: 0.01,
  digit: 1,
  times: 1 // 分母不能为 0，所以从 0 开始
});
const rules: Record<string, Rule[]> = {
  name: [
    { required: true, message: '请输入PK 品名称', trigger: 'change' },
    { min: 2, message: '2-30 位字符！', trigger: 'blur' }
  ],
  title: [
    { required: true, message: '请输入商品标题', trigger: 'change' },
    { min: 2, message: '2-200 位字符！', trigger: 'blur' }
  ],
  originalPrice: [{ required: true, message: '请输入原价', trigger: 'change' }],
  settlementPrice: [{ required: true, message: '请输入结算价', trigger: 'change' }],
  currentPrice: [{ required: true, message: '请输入现价', trigger: 'change' }],
  minPrice: [{ required: true, message: '请输入竞猜小价', trigger: 'change' }],
  digit: [{ required: true, message: '请输入竞猜位数', trigger: 'change' }],
  times: [{ required: true, message: '请输入 PK 次数', trigger: 'change' }],
  introduce: [
    { required: true, message: '请输入商品介绍', trigger: 'change' },
  ],
};

const disabled = computed((): boolean => {
  const values = formRef.value?.getFieldsValue();
  const nameDisabled = values?.name?.trim()?.length < 2;
  const titleDisabled = values?.title?.trim()?.length < 2;
  const originalPriceDisabled = !values?.originalPrice;
  const settlementPriceDisabled = !values?.settlementPrice;
  const currentPriceDisabled = !values?.currentPrice;
  const minPriceDisabled = !values?.minPrice;
  const digitDisabled = !values?.digit;
  const timeDisabled = !values?.times;

  const price = (values?.minPrice * 10 ** values?.digit) / values?.times;
  const priceDisabled = values?.settlementPrice > price;
  return (
    nameDisabled ||
    titleDisabled ||
    originalPriceDisabled ||
    settlementPriceDisabled ||
    currentPriceDisabled ||
    minPriceDisabled ||
    digitDisabled ||
    timeDisabled ||
    priceDisabled
  );
});

onMounted(() => {
  if (props.isEdit) {
    getPKDetailsFn();
  }
});

const getPKDetailsFn = () => {
  const params = {
    id: props.goodsId
  };
  getPKDetails(params)
    .then(res => {
      const result = res?.data;
      form.name = result.name;
      form.title = result.title;
      form.img = result.img;
      form.introduce = result.introduction;
      form.originalPrice = result.price ? result.price / 100 : 0;
      form.settlementPrice = result.settlePrice ? result.settlePrice / 100 : 0;
      form.currentPrice = result.currentPrice ? result.currentPrice / 100 : 0;
      form.minPrice = result.guessSmallPrice ? result.guessSmallPrice / 100 : 0;
      form.digit = result.guessDigit;
      form.times = result.pkNum;

      // 处理图片
      if (result.img) {
        let url = result.img as string;
        let obj = {
          uid: result.img,
          name: result.img,
          status: 'done',
          url
        }
        obj.url = defaultOrigin + url;
        fileList.value = [obj as any];
        imgUrl.value = result.img;
      }
    })
}

const onBlur = (html: string) => {
  form.introduce = html;
};

const onSubmit = async (): Promise<void> => {
  loading.value = true;
  try {
    await formRef.value?.validate();
    const params: ISavePKReq = {
      name: form.name, // 商品名称
      title: form.title, // 商品标题
      img: imgUrl.value, // 商品图片
      price: form.originalPrice * 100, // 商品价格
      settlePrice: form.settlementPrice * 100, // 结算价格
      currentPrice: form.currentPrice * 100, // 当前价格
      guessDigit: form.digit, // 竞猜位数
      guessSmallPrice: form.minPrice * 100, // 竞猜小价
      pkNum: form.times, // PK次数
      introduction: form.introduce // 商品说明
    };
    if (props.isEdit) {
      params.id = props.goodsId;
    }
    savePK(params)
      .then(() => {
        loading.value = false;
        message.success(props.isEdit ? '商品编辑成功' : '商品添加成功');
        emits('confirm');
      })
      .finally(() => {
        loading.value = false;
      })
  } catch (error) {
    loading.value = false;
  }
};

const beforeUpload: UploadProps['beforeUpload'] = file => {
  const fileType = file.name
    .substring(file.name.lastIndexOf(".") + 1)
    .toLowerCase();
  if (!acceptType.includes(fileType)) {
    message.error("你上传的文件不符合格式，只能上传 jpeg, jpg, png 格式的图片！");
    return false || Upload.LIST_IGNORE;
  }
  if (file.size > 5 * 1024 * 1024) {
    message.error("你上传的图片超过了 5MB，从重新上传！");
    return false || Upload.LIST_IGNORE;
  }
};

const onChangeImg = ({ file }: UploadChangeParam) => {
  if (file.status !== 'uploading') {
    imgUrl.value = file.response.data;
  }
};

const onRemoveImg: UploadProps['onRemove'] = () => {
  fileList.value = [];
  imgUrl.value = '';
};

const onViewViewIntroduce = (): void => {
  viewVisible.value = true;
};
const onCancelViewIntroduce = (): void => {
  viewVisible.value = false;
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

.view-btn {
  margin-right: 32px;
}
</style>
