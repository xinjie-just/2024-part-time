<!-- 线上商城-订单管理-创意许愿 -->
<template>
  <div class="search">
    <div class="search-item">
      <label class="label" for="orderId">订单编号：</label>
      <a-input
        v-model:value.trim="orderId"
        id="orderId"
        allow-clear
        placeholder="请输入订单编号"
        class="input"
        @pressEnter="onSearch"
      />
    </div>
    <div class="search-item">
      <label class="label" for="wishingName">心愿名称：</label>
      <a-input
        v-model:value.trim="wishingName"
        id="wishingName"
        allow-clear
        placeholder="请输入心愿名称"
        class="input"
        @pressEnter="onSearch"
      />
    </div>
    <div class="search-item">
      <label class="label" for="phone">用户手机号码：</label>
      <a-input
        v-model:value.trim="phone"
        id="phone"
        allow-clear
        placeholder="请输入用户手机号码"
        class="input"
        @pressEnter="onSearch"
      />
    </div>
    <div class="search-item">
      <label class="label" for="wishingResult">许愿结果：</label>
      <a-select
        v-model:value="wishingResult"
        id="wishingResult"
        allow-clear
        placeholder="请选择"
        :options="[
          { value: 1, label: '已实现' },
          { value: 0, label: '未实现' }
        ]"
        class="select"
        @change="onSearch"
      />
    </div>
    <div class="search-item">
      <a-button
        type="primary"
        html-type="submit"
        :loading="searchLoading"
        :disabled="resetLoading || tableLoading"
        @click="onSearch"
        >搜索</a-button
      >
      <a-button
        html-type="reset"
        :loading="resetLoading"
        :disabled="searchLoading || tableLoading"
        @click="onReset"
        class="reset-btn"
        >重置</a-button
      >
    </div>
  </div>
  <a-table
    :columns="columns"
    :data-source="data"
    :pagination="false"
    size="small"
    :scroll="{ x: 1000, y: 400 }"
    :loading="tableLoading"
    row-key="id"
  >
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'index'">
        {{ page.pageSize * (page.current - 1) + index + 1 }}
      </template>
      <template v-if="column.key === 'status'">
        <a-tag v-if="record.status === 1" color="green">成</a-tag>
        <a-tag v-if="record.status === 0" color="orange">否</a-tag>
      </template>
      <template v-if="column.key === 'wishingResult'">
        <a-tag v-if="record.wishingResult === 1" color="green">已实现</a-tag>
        <a-switch
          v-if="record.wishingResult === 0"
          :checked="false"
          checked-children="已实现"
          un-checked-children="未实现"
          :loading="statusLoading"
          @change="onChangeWishingResult(index)"
        />
      </template>
    </template>
  </a-table>
  <a-pagination
    v-if="page.total"
    v-model:current="page.current"
    v-model:pageSize="page.pageSize"
    :page-size-options="['10', '20', '30', '40', '50']"
    show-size-changer
    show-quick-jumper
    :total="page.total"
    :show-total="(total) => `共 ${total} 条`"
    size="small"
    :disabled="tableLoading"
    class="pagination"
    @change="onChange"
  />
</template>

<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue';
import { IWishingOrder, IPage } from '@/models';
import { message } from 'ant-design-vue';
const result = [
  {
    id: 1,
    orderId: '订单编号1',
    wishingName: '心愿名称1',
    phone: '13800138000',
    miniSum: 100,
    bigSum: 2000,
    status: 0,
    wishingResult: 1
  },
  {
    id: 2,
    orderId: '订单编号2',
    wishingName: '心愿名称2',
    phone: '13800138000',
    miniSum: 120,
    bigSum: 2000,
    status: 1,
    wishingResult: 0
  }
];

const orderId = ref('');
const phone = ref('');
const wishingName = ref('');
const wishingResult = ref(null);
const page: Ref<IPage> = ref({
  total: 0,
  current: 1,
  pageSize: 10
});
const data: Ref<IWishingOrder[]> = ref([]);
const searchLoading = ref(false);
const resetLoading = ref(false);
const tableLoading = ref(false);
const statusLoading = ref(false);

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 60,
    fixed: 'left'
  },
  {
    title: '订单编号',
    dataIndex: 'orderId',
    key: 'orderId',
    width: 160,
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
    title: '用户手机号码',
    dataIndex: 'phone',
    key: 'phone',
    width: 110
  },
  {
    title: '小金额（元）',
    dataIndex: 'miniSum',
    key: 'miniSum',
    width: 110
  },
  {
    title: '大金额（元）',
    dataIndex: 'bigSum',
    key: 'bigSum',
    width: 110
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 110
  },
  {
    title: '许愿结果',
    dataIndex: 'wishingResult',
    key: 'wishingResult',
    width: 90
  }
];

onMounted(() => {
  onSearch();
});

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
  wishingName.value = '';
  wishingResult.value = null;
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

const onChangeWishingResult = (index: number) => {
  statusLoading.value = true;
  setTimeout(() => {
    statusLoading.value = false;
    result[index].wishingResult = 1;
    message.success('许愿结果修改成功');
    getList();
  }, 1000);
};
</script>
