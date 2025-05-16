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
      <a-select v-model:value="sendFree" id="sendFree" allow-clear placeholder="请选择" :options="[
        { value: 1, label: '是' },
        { value: 0, label: '否' }
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
      <template v-if="column.dataIndex === 'index'">
        {{ page.pageSize * (page.current - 1) + index + 1 }}
      </template>
      <template v-if="column.dataIndex === 'sendFree'">
        <a-tag v-if="record.sendFree === 1" color="green">是</a-tag>
        <a-tag v-if="record.sendFree === 0" color="orange">否</a-tag>
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
import { IScanOrder, IPage } from '@/models';
import { getScanOrderList } from '@/services';

const orderId = ref('');
const phone = ref('');
const scanName = ref('');
const sendFree = ref(null);
const page: Ref<IPage> = ref({
  total: 0,
  current: 1,
  pageSize: 10
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
    fixed: 'left'
  },
  {
    title: '订单编号',
    dataIndex: 'orderId',
    width: 160,
    fixed: 'left'
  },
  {
    title: '扫一扫名称',
    dataIndex: 'scanName',
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
    title: '商品金额（元）',
    dataIndex: 'goodsSum',
    width: 110
  },
  {
    title: '免费赠送',
    dataIndex: 'sendFree',
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
  const params = {
    orderNumber: orderId.value.trim(), //	订单编号
    productName: scanName.value.trim(), //	扫一扫商品名称
    userPhone: phone.value.trim(), //	用户手机号码
    freeGift: sendFree.value === 1 ? true : (sendFree.value === 0 ? false : null), // 免费赠送
    page: page.value.current,
    pageSize: page.value.pageSize
  };
  getScanOrderList(params)
    .then(res => {
      const result = res.data;
      page.value.total = result.totalNum;
      data.value = result.list.map(item => {
        return {
          id: item.id, // 订单ID
          orderId: item.orderNumber, // 订单编号
          scanName: item.productName, // 商品名称
          phone: item.userPhone, // 用户手机号
          goodsSum: item.price ? item.price / 100 : 0, // 商品价格
          sendFree: item.freeGift === null || item.freeGift === undefined ? '--' : +item.freeGift // 免费赠送
        }
      });
    })
    .finally(() => {
      searchLoading.value = false;
      resetLoading.value = false;
      tableLoading.value = false;
    })
};
</script>
