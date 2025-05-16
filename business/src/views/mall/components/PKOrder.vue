<!-- 线上商城-订单管理-PK 品 -->
<template>
  <div class="search">
    <div class="search-item">
      <label class="label" for="orderId">订单编号：</label>
      <a-input v-model:value.trim="orderId" id="orderId" allow-clear placeholder="请输入订单编号" class="input"
        @pressEnter="onSearch" />
    </div>
    <div class="search-item">
      <label class="label" for="PKName">PK 品名称：</label>
      <a-input v-model:value.trim="PKName" id="PKName" allow-clear placeholder="请输入 PK 品名称" class="input"
        @pressEnter="onSearch" />
    </div>
    <div class="search-item">
      <label class="label" for="phone">用户手机号码：</label>
      <a-input v-model:value.trim="phone" id="phone" allow-clear placeholder="请输入用户手机号码" class="input"
        @pressEnter="onSearch" />
    </div>
    <div class="search-item">
      <label class="label" for="PKPhone">pK 手手机号码：</label>
      <a-input v-model:value.trim="PKPhone" id="PKPhone" allow-clear placeholder="请输入 PK 手手机号码" class="input"
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
      <label class="label" for="status">发货状态：</label>
      <a-select v-model:value="status" id="status" allow-clear placeholder="请选择" :options="[
        { value: 1, label: '已发货' },
        { value: 0, label: '未发货' }
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
        <a-tag v-if="record.sendFree" color="green">是</a-tag>
        <a-tag v-else color="orange">否</a-tag>
      </template>
      <template v-if="column.dataIndex === 'status'">
        <a-switch v-model:checked="record.status" :checked-value="1" checked-children="已发货" :un-checked-value="0"
          un-checked-children="未发货" @change="onChangeStatus(record.id, record.status)" />
      </template>
      <template v-else-if="column.dataIndex === 'action'">
        <a-popconfirm placement="topRight" title="参与竞猜的小价不退，其余款项将原路退回" ok-text="确定"
          :ok-button-props="{ type: 'default', danger: true }" cancel-text="取消" @confirm="onConfirmRefund(record.id)"
          @cancel="onCancelRefund">
          <a-button type="link">退款</a-button>
        </a-popconfirm>
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
import { IPKOrder, IPage } from '@/models';
import { message } from 'ant-design-vue';
import { getPKOrderList, PKOrderRefund, PKOrderShipping } from '@/services';

const orderId = ref('');
const phone = ref('');
const PKPhone = ref('');
const PKName = ref('');
const sendFree = ref(null);
const status = ref(null);
const page: Ref<IPage> = ref({
  total: 0,
  current: 1,
  pageSize: 10
});
const data: Ref<IPKOrder[]> = ref([]);
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
    title: 'PK 品名称',
    dataIndex: 'PKName',
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
    title: 'PK 手手机号码',
    dataIndex: 'PKPhone',
    key: 'PKPhone',
    width: 110
  },
  {
    title: 'PK 品竞猜小价（元）',
    dataIndex: 'PKSum',
    width: 150
  },
  {
    title: '商品金额（元）',
    dataIndex: 'goodsSum',
    width: 120
  },
  {
    title: '免费赠送',
    dataIndex: 'sendFree',
    width: 90
  },
  {
    title: '发货状态',
    dataIndex: 'status',
    width: 100
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: 80,
    fixed: 'right'
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
  PKPhone.value = '';
  PKName.value = '';
  status.value = null;
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
    orderNumber: orderId.value, //	订单编号
    productName: PKName.value, //	PK品名称
    userPhone: phone.value, //	用户手机号码
    playerPhone: PKPhone.value, //	pK手手机号码
    freeGift: sendFree.value === 1 ? true : (sendFree.value === 0 ? false : null), // 免费赠送
    deliverGoods: status.value === 1 ? true : (status.value === 0 ? false : null), // 发货状态
    page: page.value.current,
    pageSize: page.value.pageSize
  };
  getPKOrderList(params)
    .then(res => {
      const result = res.data;
      page.value.total = result.totalNum;
      data.value = result.list.map(item => {
        return {
          id: item.id,
          orderId: item.orderNumber,
          PKName: item.productName,
          PKPhone: item.playerPhone,
          phone: item.userPhone,
          PKSum: item.guessSmallPrice ? item.guessSmallPrice / 100 : 0,
          goodsSum: item.price ? item.price / 100 : 0,
          sendFree: +item.freeGift,
          status: +item.deliverGoods
        }
      });
    })
    .finally(() => {
      searchLoading.value = false;
      resetLoading.value = false;
      tableLoading.value = false;
    })
};

const onConfirmRefund = (id: number): void => {
  const params = {
    orderId: id
  };
  PKOrderRefund(params).then(() => {
    message.success('退款操作成功');
    page.value.current = 1;
    getList();
  })
};
const onCancelRefund = (): void => {
  message.info('您取消了退款操作');
};

const onChangeStatus = (id: number, checked: boolean) => {
  console.log('id', checked);
  console.log('checked', checked);

  const params = {
    orderId: id,
  };
  PKOrderShipping(params).then(() => {
    message.success('发货状态修改成功');
    page.value.current = 1;
    getList();
  })
};
</script>
