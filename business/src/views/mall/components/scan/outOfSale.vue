<!-- 扫一扫-停售 -->
<template>
  <div class="search">
    <div class="search-item">
      <label class="label" for="goodsName">商品名称：</label>
      <a-input v-model:value.trim="goodsName" id="goodsName" allowClear placeholder="请输入商品名称" class="input"
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
        <a-popconfirm :title="`确认上架商品 ${record.goodsName} 吗？`" ok-text="确定"
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

  <manage-scan v-if="visible" :is-edit="isEdit" :goods-id="currentGoods.id" @cancel="onCancel" @confirm="onConfirm" />
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted, Ref, ref } from 'vue';
import { IScanOutOfSale, IPage } from '@/models';
import { message } from 'ant-design-vue';

const manageScan = defineAsyncComponent(() => import('../manageScan.vue'));

const result = [
  { id: 1, goodsName: '商品名称1', originalPrice: 40, settlementPrice: 30, currentPrice: 35 },
  { id: 2, goodsName: '商品名称2', originalPrice: 40, settlementPrice: 30, currentPrice: 35 },
  { id: 3, goodsName: '商品名称3', originalPrice: 40, settlementPrice: 30, currentPrice: 35 },
  { id: 4, goodsName: '商品名称4', originalPrice: 40, settlementPrice: 30, currentPrice: 35 },
  { id: 5, goodsName: '商品名称5', originalPrice: 40, settlementPrice: 30, currentPrice: 35 },
  { id: 6, goodsName: '商品名称6', originalPrice: 40, settlementPrice: 30, currentPrice: 35 },
  { id: 7, goodsName: '商品名称7', originalPrice: 40, settlementPrice: 30, currentPrice: 35 },
  { id: 8, goodsName: '商品名称8', originalPrice: 40, settlementPrice: 30, currentPrice: 35 },
  { id: 9, goodsName: '商品名称9', originalPrice: 40, settlementPrice: 30, currentPrice: 35 },
  { id: 10, goodsName: '商品名称10', originalPrice: 40, settlementPrice: 30, currentPrice: 35 },
  { id: 11, goodsName: '商品名称11', originalPrice: 40, settlementPrice: 30, currentPrice: 35 },
  { id: 12, goodsName: '商品名称12', originalPrice: 40, settlementPrice: 30, currentPrice: 35 },
  { id: 13, goodsName: '商品名称13', originalPrice: 40, settlementPrice: 30, currentPrice: 35 },
  { id: 14, goodsName: '商品名称14', originalPrice: 40, settlementPrice: 30, currentPrice: 35 },
  { id: 15, goodsName: '商品名称15', originalPrice: 40, settlementPrice: 30, currentPrice: 35 },
  { id: 16, goodsName: '商品名称16', originalPrice: 40, settlementPrice: 30, currentPrice: 35 },
  { id: 17, goodsName: '商品名称17', originalPrice: 40, settlementPrice: 30, currentPrice: 35 },
  { id: 18, goodsName: '商品名称18', originalPrice: 40, settlementPrice: 30, currentPrice: 35 },
  { id: 19, goodsName: '商品名称19', originalPrice: 40, settlementPrice: 30, currentPrice: 35 },
  { id: 20, goodsName: '商品名称20', originalPrice: 40, settlementPrice: 30, currentPrice: 35 },
  { id: 21, goodsName: '商品名称21', originalPrice: 40, settlementPrice: 30, currentPrice: 35 },
  { id: 22, goodsName: '商品名称22', originalPrice: 40, settlementPrice: 30, currentPrice: 35 },
];

const goodsName = ref<string>('');
const page: Ref<IPage> = ref({
  total: 0,
  current: 1,
  pageSize: 10,
});
const data: Ref<IScanOutOfSale[]> = ref([]);
const searchLoading = ref(false);
const resetLoading = ref(false);
const tableLoading = ref(false);
const visible = ref(false);
const currentGoods: Ref<IScanOutOfSale> = ref({
  id: 0,
  goodsName: '',
  originalPrice: 0,
  settlementPrice: 0,
  currentPrice: 0,
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
    title: '商品名称',
    dataIndex: 'goodsName',
    key: 'goodsName',
    width: 220,
    fixed: 'left',
  },
  {
    title: '原价（元）',
    dataIndex: 'originalPrice',
    key: 'avatar',
    width: 110,
  },
  {
    title: '结算价（元）',
    dataIndex: 'settlementPrice',
    key: 'settlementPrice',
    width: 110,
  },
  {
    title: '现价（元）',
    dataIndex: 'currentPrice',
    key: 'currentPrice',
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
  console.log('Searching with:', goodsName.value.trim());
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
  goodsName.value = '';
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
  // 模拟删除操作，实际应从API删除数据
  console.log('Putawaying--id', id);
  message.success('上架操作成功');
  page.value.current = 1;
  getList();
}
const onCancelPutaway = (): void => {
  message.info('您取消了上架操作');
};

const onEdit = (record: IScanOutOfSale): void => {
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
