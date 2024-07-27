<!-- 线上商城-订单管理-扫一扫 -->
<template>
  <div class="search">
    <div class="search-item">
      <label class="label" for="orderId">订单编号：</label>
      <a-input v-model:value.trim="orderId" id="orderId" allow-clear placeholder="请输入订单编号" class="input"
        @pressEnter="onSearch" />
    </div>
    <div class="search-item">
      <label class="label" for="scanName">扫一扫名称：</label>
      <a-input v-model:value.trim="scanName" id="scanName" allow-clear placeholder="请输入扫一扫名称" class="input"
        @pressEnter="onSearch" />
    </div>
    <div class="search-item">
      <label class="label" for="phone">用户手机号码：</label>
      <a-input v-model:value.trim="phone" id="phone" allow-clear placeholder="请输入用户手机号码" class="input"
        @pressEnter="onSearch" />
    </div>
    <div class="search-item">
      <label class="label" for="sendFree">免费赠送：</label>
      <a-select v-model:value="sendFree" id="sendFree" placeholder="请选择"
        :options="[{ value: 1, label: '是' }, { value: 0, label: '否' }]" class="select" @change="onSearch"></a-select>
    </div>
    <div class="search-item">
      <a-button type="primary" html-type="submit" :loading="searchLoading" :disabled="resetLoading || tableLoading"
        @click="onSearch">搜索</a-button>
      <a-button html-type="reset" :loading="resetLoading" :disabled="searchLoading || tableLoading" @click="onReset"
        class="reset-btn">重置</a-button>
    </div>
  </div>
  <a-table :columns="columns" :data-source="data" :pagination="false" size="small" :scroll="{ x: 1000, y: 400 }"
    :loading="tableLoading" row-key="id">
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'index'">
        {{ page.pageSize * (page.current - 1) + index + 1 }}
      </template>
      <template v-if="column.key === 'sendFree'">
        <a-tag v-if="record.sendFree === 1" color="green">是</a-tag>
        <a-tag v-if="record.sendFree === 0" color="orange">否</a-tag>
      </template>
    </template>
  </a-table>
  <a-pagination v-if="page.total" v-model:current="page.current" v-model:pageSize="page.pageSize"
    :page-size-options="['10', '20', '30', '40', '50']" show-size-changer show-quick-jumper :total="page.total"
    :show-total="total => `共 ${total} 条`" size="small" :disabled="tableLoading" class="pagination" @change="onChange" />
</template>

<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue';
import { IScanOrder, IPage } from '@/models';
const result = [
  { id: 1, orderId: "订单编号1", scanName: '扫一扫名称1', phone: '13800138000', goodsSum: 100, sendFree: 1 },
  { id: 2, orderId: "订单编号2", scanName: '扫一扫名称2', phone: '13800138000', goodsSum: 120, sendFree: 0 },
];

const orderId = ref('');
const phone = ref('');
const scanName = ref('');
const sendFree = ref(null);
const page: Ref<IPage> = ref({
  total: 0,
  current: 1,
  pageSize: 10,
});
const data: Ref<IScanOrder[]> = ref([]);
const searchLoading = ref(false);
const resetLoading = ref(false);
const tableLoading = ref(false);

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 60,
    fixed: 'left',
  },
  {
    title: '订单编号',
    dataIndex: 'orderId',
    key: 'orderId',
    width: 160,
    fixed: 'left',
  },
  {
    title: '扫一扫名称',
    dataIndex: 'scanName',
    key: 'scanName',
    width: 220,
    ellipsis: true,
    fixed: 'left',
  },
  {
    title: '用户手机号码',
    dataIndex: 'phone',
    key: 'phone',
    width: 110,
  },
  {
    title: '商品金额（元）',
    dataIndex: 'goodsSum',
    key: 'goodsSum',
    width: 110,
  },
  {
    title: '免费赠送',
    dataIndex: 'sendFree',
    key: 'sendFree',
    width: 90,
  },
];

onMounted(() => {
  onSearch();
})

const onSearch = (): void => {
  // 模拟搜索操作，实际应从API获取数据  
  console.log('Searching with:', orderId.value.trim());
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
  orderId.value = '';
  phone.value = '';
  scanName.value = '';
  sendFree.value = null;
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
</script>
