<!-- 账户余额 -->
<template>
  <div class="header">
    <a-statistic title="可用余额（人民币）" :precision="2" prefix="¥" suffix="元" :value="112893" />
    <a-button type="primary" class="to-withdraw-btn" @click="onToWithdraw">
      <template #icon>
        <MoneyCollectOutlined />
      </template>
      去提现
    </a-button>
  </div>
  <div class="search">
    <div class="search-item">
      <label class="label" for="date">交易日期：</label>
      <a-range-picker id="date" v-model:value="date" />
    </div>
    <div class="search-item">
      <label class="label" for="sources">来源：</label>
      <a-select id="sources" ref="select" v-model:value="source" style="width: 120px" :options="options"
        placeholder="请选择来源" @focus="focus" @change="handleChange"></a-select>
    </div>
    <div class="search-item">
      <a-button type="primary" html-type="submit" :loading="searchLoading" :disabled="resetLoading || tableLoading"
        @click="onSearch">搜索</a-button>
      <a-button html-type="reset" :loading="resetLoading" :disabled="searchLoading || tableLoading" @click="onReset"
        class="reset-btn">重置</a-button>
    </div>
  </div>
  <a-table :columns="columns" :dataSource="data" :pagination="false" size="small" :scroll="{ x: 1000, y: 360 }"
    :loading="tableLoading" row-key="id">
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'index'">
        {{ page.pageSize * (page.current - 1) + index + 1 }}
      </template>
      <template v-else-if="column.key === 'source'">
        <a-tag v-if="record.source === 1" color="orange">订单</a-tag>
        <a-tag v-else-if="record.source === 2" color="blue">扣款</a-tag>
        <a-tag v-else-if="record.source === 3" color="purple">返点</a-tag>
      </template>
    </template>
  </a-table>
  <a-pagination v-if="page.total" v-model:current="page.current" v-model:pageSize="page.pageSize"
    :page-size-options="['10', '20', '30', '40', '50']" show-size-changer show-quick-jumper :total="page.total"
    :show-total="total => `共 ${total} 条`" size="small" :disabled="tableLoading" class="pagination" @change="onChange" />

</template>

<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue';
import { MoneyCollectOutlined } from '@ant-design/icons-vue';
import { IBalance, IPage } from '@/models';
import { SelectProps } from 'ant-design-vue';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';

const router = useRouter();

const source: Ref<null | number> = ref(null);
const options = ref<SelectProps['options']>([
  {
    value: 1,
    label: '订单',
  },
  {
    value: 2,
    label: '扣款',
  },
  {
    value: 3,
    label: '返点',
  },
]);

type RangeValue = [Dayjs, Dayjs];
const date = ref<RangeValue>();

const result = [
  { id: 1, sum: 12.45, time: '2023-01-01 12:00:00', source: 2 },
  { id: 2, sum: 13.45, time: '2023-01-02 12:00:00', source: 1 },
  { id: 3, sum: 14.45, time: '2023-01-03 12:00:00', source: 3 },
  { id: 4, sum: 15.45, time: '2023-01-04 12:00:00', source: 3 },
  { id: 5, sum: 16.45, time: '2023-01-05 12:00:00', source: 1 },
  { id: 6, sum: 17.45, time: '2023-01-06 12:00:00', source: 2 },
  { id: 7, sum: 18.45, time: '2023-01-07 12:00:00', source: 1 },
  { id: 8, sum: 19.45, time: '2023-01-08 12:00:00', source: 1 },
  { id: 9, sum: 20.45, time: '2023-01-09 12:00:00', source: 2 },
  { id: 10, sum: 21.45, time: '2023-01-10 12:00:00', source: 1 },
  { id: 11, sum: 22.45, time: '2023-01-11 12:00:00', source: 3 },
  { id: 12, sum: 23.45, time: '2023-01-12 12:00:00', source: 1 },
  { id: 13, sum: 24.45, time: '2023-01-13 12:00:00', source: 2 },
  { id: 14, sum: 25.45, time: '2023-01-14 12:00:00', source: 1 },
  { id: 15, sum: 26.45, time: '2023-01-15 12:00:00', source: 1 },
  { id: 16, sum: 27.45, time: '2023-01-16 12:00:00', source: 2 },
  { id: 17, sum: 28.45, time: '2023-01-17 12:00:00', source: 3 },
  { id: 18, sum: 29.45, time: '2023-01-18 12:00:00', source: 1 },
  { id: 19, sum: 30.45, time: '2023-01-19 12:00:00', source: 1 },
  { id: 20, sum: 31.45, time: '2023-01-20 12:00:00', source: 3 },
  { id: 21, sum: 32.45, time: '2023-01-21 12:00:00', source: 3 },
  { id: 22, sum: 33.45, time: '2023-01-22 12:00:00', source: 1 },
];


const page: Ref<IPage> = ref({
  total: 0,
  current: 1,
  pageSize: 10,
});
const data: Ref<IBalance[]> = ref([]);
const searchLoading = ref(false);
const resetLoading = ref(false);
const tableLoading = ref(false);

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 80,
  },
  {
    title: '金额（元）',
    dataIndex: 'sum',
    key: 'sum',
    width: 120,
  },
  {
    title: '交易时间',
    dataIndex: 'time',
    key: 'time',
    width: 120,
  },
  {
    title: '来源',
    dataIndex: 'source',
    key: 'source',
    width: 120,
  },
];

onMounted(() => {
  onSearch();
})

const focus = () => {
  console.log('focus');
};

const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};

const onSearch = (): void => {
  // 模拟搜索操作，实际应从API获取数据  
  console.log('Searching with:');
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
  source.value = null;
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
  }, 2000);
};

const onToWithdraw = (): void => {
  // 模拟跳转操作，实际应跳转到提现页面
  router.push('/account/withdrawe');
}
</script>

<style lang="scss" scoped>
.header {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e8e8e8;
}

.to-withdraw-btn {
  margin-left: 48px;
}
</style>
