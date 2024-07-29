<!-- 线上商城-订单管理-PK 品 -->
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
      <label class="label" for="PKName">PK 品名称：</label>
      <a-input
        v-model:value.trim="PKName"
        id="PKName"
        allow-clear
        placeholder="请输入 PK 品名称"
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
      <label class="label" for="PKPhone">pK 手手机号码：</label>
      <a-input
        v-model:value.trim="PKPhone"
        id="PKPhone"
        allow-clear
        placeholder="请输入 PK 手手机号码"
        class="input"
        @pressEnter="onSearch"
      />
    </div>
    <div class="search-item">
      <label class="label" for="sendFree">免费赠送：</label>
      <a-select
        v-model:value="sendFree"
        id="sendFree"
        allow-clear
        placeholder="请选择"
        :options="[
          { value: 1, label: '是' },
          { value: 0, label: '否' }
        ]"
        class="select"
        @change="onSearch"
      />
    </div>
    <div class="search-item">
      <label class="label" for="status">发货状态：</label>
      <a-select
        v-model:value="status"
        id="status"
        allow-clear
        placeholder="请选择"
        :options="[
          { value: 1, label: '已发货' },
          { value: 0, label: '未发货' }
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
      <template v-if="column.key === 'sendFree'">
        <a-tag v-if="record.sendFree === 1" color="green">是</a-tag>
        <a-tag v-if="record.sendFree === 0" color="orange">否</a-tag>
      </template>
      <template v-if="column.key === 'status'">
        <a-switch
          v-model:checked="record.status"
          :checked-value="1"
          checked-children="已发货"
          :un-checked-value="0"
          un-checked-children="未发货"
          @change="onChangeStatus"
        />
      </template>
      <template v-else-if="column.key === 'action'">
        <a-popconfirm
          placement="topRight"
          title="参与竞猜的小价不退，其余款项将原路退回"
          ok-text="确定"
          :ok-button-props="{ type: 'default', danger: true }"
          cancel-text="取消"
          @confirm="onConfirmRefund(record.id)"
          @cancel="onCancelRefund"
        >
          <a-button type="link">退款</a-button>
        </a-popconfirm>
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
import { IPKOrder, IPage } from '@/models';
import { message } from 'ant-design-vue';
const result = [
  {
    id: 1,
    orderId: '订单编号1',
    PKName: 'PK 品名称1',
    PKPhone: '13800138000',
    phone: '13800138000',
    PKSum: 100,
    goodsSum: 100,
    sendFree: 1,
    status: 1
  },
  {
    id: 2,
    orderId: '订单编号2',
    PKName: 'PK 品名称2',
    PKPhone: '13800138000',
    phone: '13800138000',
    PKSum: 120,
    goodsSum: 120,
    sendFree: 0,
    status: 0
  }
];

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
    key: 'orderId',
    width: 160,
    fixed: 'left'
  },
  {
    title: 'PK 品名称',
    dataIndex: 'PKName',
    key: 'PKName',
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
    title: 'PK 手手机号码',
    dataIndex: 'PKPhone',
    key: 'PKPhone',
    width: 110
  },
  {
    title: 'PK 品竞猜小价（元）',
    dataIndex: 'PKSum',
    key: 'PKSum',
    width: 150
  },
  {
    title: '商品金额（元）',
    dataIndex: 'goodsSum',
    key: 'goodsSum',
    width: 120
  },
  {
    title: '免费赠送',
    dataIndex: 'sendFree',
    key: 'sendFree',
    width: 90
  },
  {
    title: '发货状态',
    dataIndex: 'status',
    key: 'status',
    width: 100
  },
  {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    width: 80,
    fixed: 'right'
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

const onConfirmRefund = (id: number): void => {
  // 模拟删除操作，实际应从API删除数据
  console.log('Deleting--id', id);
  message.success('退款操作成功');
  page.value.current = 1;
  getList();
};
const onCancelRefund = (): void => {
  message.info('您取消了退款操作');
};

const onChangeStatus = (checked: boolean, event: Event) => {
  console.log('checked', checked);
  console.log('event', event);
  page.value.current = 1;
  getList();
};
</script>
