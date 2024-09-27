<!-- 创意许愿-可许 -->
<template>
  <div class="search">
    <div class="search-item">
      <label class="label" for="wishingName">心愿名称：</label>
      <a-input v-model:value.trim="wishingName" id="wishingName" allow-clear placeholder="请输入心愿名称" class="input"
        @pressEnter="onSearch" />
    </div>
    <div class="search-item">
      <a-button type="primary" html-type="submit" :loading="searchLoading" :disabled="resetLoading || tableLoading"
        @click="onSearch">搜索</a-button>
      <a-button html-type="reset" :loading="resetLoading" :disabled="searchLoading || tableLoading" @click="onReset"
        class="reset-btn">重置</a-button>
    </div>
  </div>
  <a-button type="primary" class="add-btn" @click="onAdd">
    <template #icon>
      <PlusOutlined />
    </template>
    添加
  </a-button>
  <a-table :columns="columns" :data-source="data" :pagination="false" size="small" :scroll="{ x: 1000, y: 340 }"
    :loading="tableLoading" row-key="id">
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'index'">
        {{ page.pageSize * (page.current - 1) + index + 1 }}
      </template>
      <template v-if="column.key === 'QRCode'">
        <a-popover trigger="click">
          <template #title>
            <span class="popover-title"> {{ record.wishingName }}</span>
          </template>
          <template #content>
            <a-qrcode ref="qrcodeCanvasRef" :size="200" value="http://www.antdv.com" />
            <a-button type="primary" class="popover-download-btn" @click="onDownloadChange">下载</a-button>
          </template>
          <img :src="record.QRCode" alt="二维码" title="点击查看" class="q-r-code" />
        </a-popover>
      </template>
      <template v-else-if="column.key === 'action'">
        <a-button type="link" @click="onEdit(record)">编辑</a-button>
        <a-divider type="vertical" />
        <a-popconfirm placement="topRight" :title="`确认停许心愿 ${record.wishingName} 吗？`" ok-text="确定"
          :ok-button-props="{ type: 'default', danger: true }" cancel-text="取消" @confirm="onConfirmStop(record.id)"
          @cancel="onCancelStop">
          <a-button type="link">停许</a-button>
        </a-popconfirm>
      </template>
    </template>
  </a-table>
  <a-pagination v-if="page.total" v-model:current="page.current" v-model:pageSize="page.pageSize"
    :page-size-options="['10', '20', '30', '40', '50']" show-size-changer show-quick-jumper :total="page.total"
    :show-total="(total: number) => `共 ${total} 条`" size="small" :disabled="tableLoading" class="pagination"
    @change="onChange" />

  <manage-wishing v-if="visible" :is-edit="isEdit" :goods-id="currentGoods.id" @cancel="onCancel"
    @confirm="onConfirm" />
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted, Ref, ref } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { IMayWishing, IPage } from '@/models';
import { message } from 'ant-design-vue';
import { getWishingList, setWishingState } from '@/services';

const manageWishing = defineAsyncComponent(() => import('../manageWishing.vue'));

const wishingName = ref<string>('');
const page: Ref<IPage> = ref({
  total: 0,
  current: 1,
  pageSize: 10
});
const data: Ref<IMayWishing[]> = ref([]);
const searchLoading = ref(false);
const resetLoading = ref(false);
const tableLoading = ref(false);
const visible = ref(false);
const currentGoods: Ref<IMayWishing> = ref({
  id: 0,
  wishingName: '',
  referenceValue: 0,
  QRCode: ''
});
const isEdit = ref(false);

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 80,
    fixed: 'left'
  },
  {
    title: '心愿名称',
    dataIndex: 'wishingName',
    key: 'wishingName',
    width: 220,
    ellipsis: true,
    fixed: 'left'
  },
  {
    title: '参考价值（元）',
    dataIndex: 'referenceValue',
    key: 'referenceValue',
    width: 110
  },
  {
    title: '二维码',
    dataIndex: 'QRCode',
    key: 'QRCode',
    width: 100
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: 160,
    fixed: 'right'
  }
];

const qrcodeCanvasRef = ref();

onMounted(() => {
  onSearch();
});

const onSearch = (): void => {
  page.value.current = 1;
  page.value.pageSize = 10;
  searchLoading.value = true;
  tableLoading.value = true;
  getList();
};

const onDownloadChange = async () => {
  const url = await qrcodeCanvasRef.value.toDataURL();
  const a = document.createElement('a');
  a.download = 'QRCode.png';
  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const onReset = (): void => {
  wishingName.value = '';
  page.value.current = 1;
  page.value.pageSize = 10;
  resetLoading.value = true;
  tableLoading.value = true;
  getList();
};

const onChange = (current: number, pageSize: number): void => {
  page.value.current = current;
  page.value.pageSize = pageSize;
  getList();
};

const getList = (): void => {
  tableLoading.value = true;
  const params = {
    // state: 0, // 许愿状态(0:待许愿;1:可许心愿; 2:停止许愿)
    name: wishingName.value.trim(),
    page: page.value.current,
    pageSize: page.value.pageSize
  };
  getWishingList(params)
    .then(res => {
      const result = res.data;
      page.value.total = result.totalNum;
      data.value = result.list.map(item => {
        return {
          id: item.id,
          wishingName: item.name || "",
          referenceValue: item.price || 0,
          QRCode: item?.QRCode || ""
        }
      })
    })
    .finally(() => {
      searchLoading.value = false;
      resetLoading.value = false;
      tableLoading.value = false;
    })
};
const onConfirmStop = (id: number): void => {
  const params = {
    id,
    state: 2, // 心愿状态(0:待许愿; 1:可许心愿; 2:停止许愿)
  };
  setWishingState(params)
    .then(() => {
      message.success('停许操作成功');
      page.value.current = 1;
      getList();
    })
};
const onCancelStop = (): void => {
  message.info('您取消了停许操作');
};

const onAdd = (): void => {
  isEdit.value = false;
  visible.value = true;
};
const onEdit = (record: IMayWishing): void => {
  isEdit.value = true;
  visible.value = true;
  currentGoods.value = record;
};
const onCancel = (): void => {
  visible.value = false;
};
const onConfirm = (): void => {
  visible.value = false;
  page.value.current = 1;
  getList();
};
</script>

<style lang="scss">
.q-r-code {
  display: block;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
}
</style>

<style lang="scss" scoped>
.add-btn {
  margin-bottom: 16px;
}

.popover-download-btn {
  display: block;
  margin: 16px auto 8px;
}

.popover-title {
  display: block;
  text-align: center;
  margin: 8px auto;
  max-width: 200px; // 不大于头像图片宽度
  word-break: break-all;
}
</style>
