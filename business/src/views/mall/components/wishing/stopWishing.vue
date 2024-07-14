<!-- 创意许愿-停许心愿 -->
<template>
  <div class="search">
    <div class="search-item">
      <label class="label" for="wishingName">心愿名称：</label>
      <a-input v-model:value.trim="wishingName" id="wishingName" allowClear placeholder="请输入心愿名称" class="input"
        @pressEnter="onSearch" />
    </div>
    <div class="search-item">
      <a-button type="primary" html-type="submit" :loading="searchLoading" :disabled="resetLoading || tableLoading"
        @click="onSearch">搜索</a-button>
      <a-button html-type="reset" :loading="resetLoading" :disabled="searchLoading || tableLoading" @click="onReset"
        class="reset-btn">重置</a-button>
    </div>
  </div>
  <a-table :columns="columns" :dataSource="data" :pagination="false" size="small" :scroll="{ x: 1000, y: 380 }"
    :loading="tableLoading" row-key="id">
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'index'">
        {{ page.pageSize * (page.current - 1) + index + 1 }}
      </template>
      <template v-else-if="column.key === 'action'">
        <a-button type="link" @click="onEdit(record)">编辑</a-button>
        <a-divider type="vertical" />
        <a-popconfirm :title="`确认上架心愿 ${record.wishingName} 吗？`" ok-text="确定"
          :ok-button-props="{ type: 'default', danger: true }" cancel-text="取消" @confirm="onConfirmPutaway(record.id)"
          @cancel="onCancelPutaway">
          <a-button type="link">上架</a-button>
        </a-popconfirm>
      </template>
    </template>
  </a-table>
  <a-pagination v-if="page.total" v-model:current="page.current" v-model:pageSize="page.pageSize"
    :page-size-options="['10', '20', '30', '40', '50']" show-size-changer show-quick-jumper :total="page.total"
    :show-total="total => `共 ${total} 条`" size="small" :disabled="tableLoading" class="pagination" @change="onChange" />

  <manage-wishing v-if="visible" :is-edit="isEdit" :goods-id="currentGoods.id" @cancel="onCancel"
    @confirm="onConfirm" />
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted, Ref, ref } from 'vue';
import { IMayWishing, IPage } from '@/models';
import { message } from 'ant-design-vue';

const manageWishing = defineAsyncComponent(() => import('../manageWishing.vue'));

const result = [
  { id: 1, wishingName: '心愿名称1', referenceValue: 40, QRCode: 'https://via.placeholder.com/32X32' },
  { id: 2, wishingName: '心愿名称2', referenceValue: 40, QRCode: 'https://via.placeholder.com/32X32' },
  { id: 3, wishingName: '心愿名称3', referenceValue: 40, QRCode: 'https://via.placeholder.com/32X32' },
  { id: 4, wishingName: '心愿名称4', referenceValue: 40, QRCode: 'https://via.placeholder.com/32X32' },
  { id: 5, wishingName: '心愿名称5', referenceValue: 40, QRCode: 'https://via.placeholder.com/32X32' },
  { id: 6, wishingName: '心愿名称6', referenceValue: 40, QRCode: 'https://via.placeholder.com/32X32' },
  { id: 7, wishingName: '心愿名称7', referenceValue: 40, QRCode: 'https://via.placeholder.com/32X32' },
  { id: 8, wishingName: '心愿名称8', referenceValue: 40, QRCode: 'https://via.placeholder.com/32X32' },
  { id: 9, wishingName: '心愿名称9', referenceValue: 40, QRCode: 'https://via.placeholder.com/32X32' },
  { id: 10, wishingName: '心愿名称10', referenceValue: 40, QRCode: 'https://via.placeholder.com/32X32' },
  { id: 11, wishingName: '心愿名称11', referenceValue: 40, QRCode: 'https://via.placeholder.com/32X32' },
  { id: 12, wishingName: '心愿名称12', referenceValue: 40, QRCode: 'https://via.placeholder.com/32X32' },
  { id: 13, wishingName: '心愿名称13', referenceValue: 40, QRCode: 'https://via.placeholder.com/32X32' },
  { id: 14, wishingName: '心愿名称14', referenceValue: 40, QRCode: 'https://via.placeholder.com/32X32' },
  { id: 15, wishingName: '心愿名称15', referenceValue: 40, QRCode: 'https://via.placeholder.com/32X32' },
  { id: 16, wishingName: '心愿名称16', referenceValue: 40, QRCode: 'https://via.placeholder.com/32X32' },
  { id: 17, wishingName: '心愿名称17', referenceValue: 40, QRCode: 'https://via.placeholder.com/32X32' },
  { id: 18, wishingName: '心愿名称18', referenceValue: 40, QRCode: 'https://via.placeholder.com/32X32' },
  { id: 19, wishingName: '心愿名称19', referenceValue: 40, QRCode: 'https://via.placeholder.com/32X32' },
  { id: 20, wishingName: '心愿名称20', referenceValue: 40, QRCode: 'https://via.placeholder.com/32X32' },
  { id: 21, wishingName: '心愿名称21', referenceValue: 40, QRCode: 'https://via.placeholder.com/32X32' },
  { id: 22, wishingName: '心愿名称22', referenceValue: 40, QRCode: 'https://via.placeholder.com/32X32' },
];

const wishingName = ref<string>('');
const page: Ref<IPage> = ref({
  total: 0,
  current: 1,
  pageSize: 10,
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
    fixed: 'left',
  },
  {
    title: '心愿名称',
    dataIndex: 'wishingName',
    key: 'wishingName',
    width: 220,
    fixed: 'left',
  },
  {
    title: '参考价值（元）',
    dataIndex: 'referenceValue',
    key: 'referenceValue',
    width: 110,
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: 160,
    fixed: 'right',
  },
];

onMounted(() => {
  onSearch();
})

const onSearch = (): void => {
  // 模拟搜索操作，实际应从API获取数据  
  console.log('Searching with:', wishingName.value.trim());
  page.value.current = 1;
  page.value.pageSize = 10;
  searchLoading.value = true;
  tableLoading.value = true;
  getList();
};

const onReset = (): void => {
  // 假设重新从API获取数据  
  console.log('Resetting...');

  // 重置表单和表格数据  
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
  // 模拟获取列表操作，实际应从API获取数据
  tableLoading.value = true;
  setTimeout(() => {
    page.value.total = result.length;

    const startIndex = (page.value.current - 1) * page.value.pageSize;
    const endIndex = startIndex + page.value.pageSize;
    data.value = result.filter((_, index) => index >= startIndex && index < endIndex);
    searchLoading.value = false;
    resetLoading.value = false;
    tableLoading.value = false;
  }, 1000);
};
const onConfirmPutaway = (id: number): void => {
  console.log('Putawaying--id', id);
  message.success('上架操作成功');
  page.value.current = 1;
  getList();
}
const onCancelPutaway = (): void => {
  message.info('您取消了上架操作');
};

const onEdit = (record: IMayWishing): void => {
  isEdit.value = true;
  visible.value = true;
  currentGoods.value = record;
}
const onCancel = (): void => {
  visible.value = false;
}
const onConfirm = (): void => {
  visible.value = false;
  page.value.current = 1;
  getList();
}
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
