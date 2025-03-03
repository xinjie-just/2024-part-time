<!-- 线上商城-订单管理-创意许愿 -->
<template>
  <div class="search">
    <div class="search-item">
      <label class="label" for="orderId">订单编号：</label>
      <a-input v-model:value.trim="orderId" id="orderId" allow-clear placeholder="请输入订单编号" class="input"
        @pressEnter="onSearch" />
    </div>
    <div class="search-item">
      <label class="label" for="wishingName">心愿名称：</label>
      <a-input v-model:value.trim="wishingName" id="wishingName" allow-clear placeholder="请输入心愿名称" class="input"
        @pressEnter="onSearch" />
    </div>
    <div class="search-item">
      <label class="label" for="phone">用户手机号码：</label>
      <a-input v-model:value.trim="phone" id="phone" allow-clear placeholder="请输入用户手机号码" class="input"
        @pressEnter="onSearch" />
    </div>
    <div class="search-item">
      <label class="label" for="wishingResult">许愿结果：</label>
      <a-select v-model:value="wishingResult" id="wishingResult" allow-clear placeholder="请选择" :options="[
        { value: 1, label: '已实现' },
        { value: 0, label: '未实现' }
      ]" class="select" @change="onSearch" />
    </div>
    <div class="search-item">
      <a-button type="primary" html-type="submit" :loading="searchLoading" :disabled="resetLoading || tableLoading"
        @click="onSearch">搜索</a-button>
      <a-button html-type="reset" :loading="resetLoading" :disabled="searchLoading || tableLoading" @click="onReset"
        class="reset-btn">重置</a-button>
    </div>
  </div>
  <a-table :columns="columns" :data-source="data" :pagination="false" size="small" :scroll="{ x: 1000, y: 360 }"
    :loading="tableLoading" row-key="id">
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
        <a-switch v-if="record.wishingResult === 0" :checked="false" checked-children="已实现" un-checked-children="未实现"
          :loading="statusLoading" @change="onChangeWishingResult(record.orderId)" />
      </template>
    </template>
  </a-table>
  <a-pagination v-if="page.total" v-model:current="page.current" v-model:pageSize="page.pageSize"
    :page-size-options="['10', '20', '30', '40', '50']" show-size-changer show-quick-jumper :total="page.total"
    :show-total="(total: number) => `共 ${total} 条`" size="small" :disabled="tableLoading" class="pagination"
    @change="onChange" />
</template>

<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue';
import { IWishingOrder, IPage } from '@/models';
import { message } from 'ant-design-vue';
import { achieveWishingOrder, getWishingOrderList } from '@/services';

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
    width: 160,
    fixed: 'left'
  },
  {
    title: '心愿名称',
    dataIndex: 'wishingName',
    width: 220,
    ellipsis: true,
    fixed: 'left'
  },
  {
    title: '用户手机号码',
    dataIndex: 'phone',
    width: 110
  },
  {
    title: '小金额（元）',
    dataIndex: 'minPrice',
    width: 110
  },
  {
    title: '大金额（元）',
    dataIndex: 'maxPrice',
    width: 110
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 110
  },
  {
    title: '许愿结果',
    dataIndex: 'wishingResult',
    width: 90
  }
];

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

const onReset = (): void => {
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
  const params = {
    orderNumber: orderId.value.trim(), //	订单编号
    productName: wishingName.value.trim(), //	创意许愿商品名称
    userPhone: phone.value.trim(), //	用户手机号码
    wishResult: wishingResult.value === 1 ? true : (wishingResult.value === 0 ? false : null), // 许愿结果
    page: page.value.current,
    pageSize: page.value.pageSize
  };
  getWishingOrderList(params)
    .then(res => {
      const result = res.data;
      page.value.total = result.totalNum;
      data.value = result.list.map(item => {
        return {
          id: item.id,
          orderId: item.orderNumber,
          wishingName: item.productName,
          phone: item.userPhone,
          minPrice: item.minPrice ? item.minPrice / 100 : 0,
          maxPrice: item.maxPrice ? item.maxPrice / 100 : 0,
          status: item.status === null || item.status === undefined ? '--' : +item.status,
          wishingResult: item.wishResult === null || item.wishResult === undefined ? '--' : +item.wishResult
        }
      });
    })
    .finally(() => {
      searchLoading.value = false;
      resetLoading.value = false;
      tableLoading.value = false;
    })
};

const onChangeWishingResult = (orderId: number) => {
  statusLoading.value = true;
  const params = {
    orderId
  };
  achieveWishingOrder(params)
    .then(() => {
      message.success('许愿结果修改成功');
      getList();
    }).finally(() => {
      statusLoading.value = false;
    })
};
</script>
