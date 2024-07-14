<!-- PK 品-已售 -->
<template>
  <div class="search">
    <div class="search-item">
      <label class="label" for="goodsName">商品名称：</label>
      <a-input id="goodsName" v-model:value="goodsName" placeholder="请输入商品名称" />
    </div>
    <div class="search-item">
      <label class="label" for="date">出售日期：</label>
      <a-range-picker id="date" v-model:value="date" :locale="locale" :disabled-date="disabledDate" />
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
        <a-button type="link" @click="onReturnGoods(record)">退货</a-button>
      </template>
    </template>
  </a-table>
  <a-pagination v-if="page.total" v-model:current="page.current" v-model:pageSize="page.pageSize"
    :page-size-options="['10', '20', '30', '40', '50']" show-size-changer show-quick-jumper :total="page.total"
    :show-total="total => `共 ${total} 条`" size="small" :disabled="tableLoading" class="pagination" @change="onChange" />
</template>

<script setup lang="ts">
import { createVNode, onMounted, Ref, ref } from 'vue';
import { IPKSoldOut, IPage } from '@/models';
import { message, Modal } from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/date-picker/locale/zh_CN';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';

const result = [
  { id: 1, orderId: '20240709122430001', goodsName: '商品名称1', originalPrice: 40, settlementPrice: 30, currentPrice: 35, sellTime: '2024-07-24 11:24:34' },
  { id: 2, orderId: '20240709122430001', goodsName: '商品名称2', originalPrice: 40, settlementPrice: 30, currentPrice: 35, sellTime: '2024-07-24 11:24:34' },
  { id: 3, orderId: '20240709122430001', goodsName: '商品名称3', originalPrice: 40, settlementPrice: 30, currentPrice: 35, sellTime: '2024-07-24 11:24:34' },
  { id: 4, orderId: '20240709122430001', goodsName: '商品名称4', originalPrice: 40, settlementPrice: 30, currentPrice: 35, sellTime: '2024-07-24 11:24:34' },
  { id: 5, orderId: '20240709122430001', goodsName: '商品名称5', originalPrice: 40, settlementPrice: 30, currentPrice: 35, sellTime: '2024-07-24 11:24:34' },
  { id: 6, orderId: '20240709122430001', goodsName: '商品名称6', originalPrice: 40, settlementPrice: 30, currentPrice: 35, sellTime: '2024-07-24 11:24:34' },
  { id: 7, orderId: '20240709122430001', goodsName: '商品名称7', originalPrice: 40, settlementPrice: 30, currentPrice: 35, sellTime: '2024-07-24 11:24:34' },
  { id: 8, orderId: '20240709122430001', goodsName: '商品名称8', originalPrice: 40, settlementPrice: 30, currentPrice: 35, sellTime: '2024-07-24 11:24:34' },
  { id: 9, orderId: '20240709122430001', goodsName: '商品名称9', originalPrice: 40, settlementPrice: 30, currentPrice: 35, sellTime: '2024-07-24 11:24:34' },
  { id: 10, orderId: '20240709122430001', goodsName: '商品名称10', originalPrice: 40, settlementPrice: 30, currentPrice: 35, sellTime: '2024-07-24 11:24:34' },
  { id: 11, orderId: '20240709122430001', goodsName: '商品名称11', originalPrice: 40, settlementPrice: 30, currentPrice: 35, sellTime: '2024-07-24 11:24:34' },
  { id: 12, orderId: '20240709122430001', goodsName: '商品名称12', originalPrice: 40, settlementPrice: 30, currentPrice: 35, sellTime: '2024-07-24 11:24:34' },
  { id: 13, orderId: '20240709122430001', goodsName: '商品名称13', originalPrice: 40, settlementPrice: 30, currentPrice: 35, sellTime: '2024-07-24 11:24:34' },
  { id: 14, orderId: '20240709122430001', goodsName: '商品名称14', originalPrice: 40, settlementPrice: 30, currentPrice: 35, sellTime: '2024-07-24 11:24:34' },
  { id: 15, orderId: '20240709122430001', goodsName: '商品名称15', originalPrice: 40, settlementPrice: 30, currentPrice: 35, sellTime: '2024-07-24 11:24:34' },
  { id: 16, orderId: '20240709122430001', goodsName: '商品名称16', originalPrice: 40, settlementPrice: 30, currentPrice: 35, sellTime: '2024-07-24 11:24:34' },
  { id: 17, orderId: '20240709122430001', goodsName: '商品名称17', originalPrice: 40, settlementPrice: 30, currentPrice: 35, sellTime: '2024-07-24 11:24:34' },
  { id: 18, orderId: '20240709122430001', goodsName: '商品名称18', originalPrice: 40, settlementPrice: 30, currentPrice: 35, sellTime: '2024-07-24 11:24:34' },
  { id: 19, orderId: '20240709122430001', goodsName: '商品名称19', originalPrice: 40, settlementPrice: 30, currentPrice: 35, sellTime: '2024-07-24 11:24:34' },
  { id: 20, orderId: '20240709122430001', goodsName: '商品名称20', originalPrice: 40, settlementPrice: 30, currentPrice: 35, sellTime: '2024-07-24 11:24:34' },
  { id: 21, orderId: '20240709122430001', goodsName: '商品名称21', originalPrice: 40, settlementPrice: 30, currentPrice: 35, sellTime: '2024-07-24 11:24:34' },
  { id: 22, orderId: '20240709122430001', goodsName: '商品名称22', originalPrice: 40, settlementPrice: 30, currentPrice: 35, sellTime: '2024-07-24 11:24:34' },
];

const locale = zhCN;
dayjs.locale('zh-cn');
type RangeValue = [Dayjs, Dayjs];
const date = ref<RangeValue>();
const goodsName = ref<string>('');
const page: Ref<IPage> = ref({
  total: 0,
  current: 1,
  pageSize: 10,
});
const data: Ref<IPKSoldOut[]> = ref([]);
const searchLoading = ref(false);
const resetLoading = ref(false);
const tableLoading = ref(false);
const currentGoods: Ref<IPKSoldOut> = ref({
  id: 0,
  orderId: '',
  goodsName: '',
  originalPrice: 0,
  settlementPrice: 0,
  currentPrice: 0,
  sellTime: ''
});

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 70,
    fixed: 'left',
  },
  {
    title: '订单编号',
    dataIndex: 'orderId',
    key: 'orderId',
    width: 150,
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
    title: '出售时间',
    dataIndex: 'sellTime',
    key: 'sellTime',
    width: 140,
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: 100,
    fixed: 'right',
  },
];

onMounted(() => {
  onSearch();
})

const disabledDate = (current: Dayjs) => {
  // Can not select days before today and today
  return current && current > dayjs().endOf('day');
};

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
  date.value = [dayjs(''), dayjs('')];
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
const onReturnGoods = (goods: IPKSoldOut): void => {
  currentGoods.value = goods;
  Modal.confirm({
    title: '退货确认',
    icon: createVNode(ExclamationCircleOutlined),
    content: '退货不能退全款，参与竞猜的小价格不退，其他都原路返退。',
    okText: '确认',
    okType: 'danger',
    cancelText: '取消',
    onOk() {
      message.success('退货成功');
      getList();
    },
    onCancel() {
      console.log('Cancel');
    },
  });
}
</script>

<style lang="scss"></style>

<style lang="scss" scoped></style>
