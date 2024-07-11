<!-- 账户提现 -->
<template>
  <div class="header">
    <a-statistic title="可用余额（人民币）" :precision="2" prefix="¥" suffix="元" :value="totalMoney" />
    <div class="sum-wrap">
      <label for="sum" class="label">提现金额：</label>
      <a-input-number v-model:value="sum" :min="0.01" :max="totalMoney" :precision="2" class="sum-input">
        <template #addonBefore>
          <span>￥</span>
        </template>
        <template #addonAfter>
          <span>RMB</span>
        </template>
      </a-input-number>
      <a-button type="primary" :disabled="!totalMoney" class="total-money-btn" @click="sum = totalMoney">全部金额</a-button>
    </div>
  </div>
  <a-button type="primary" class="withdrawe-btn" :disabled="!state.selectedRowKeys.length" @click="onWithdrawe">
    <template #icon>
      <MoneyCollectOutlined />
    </template>
    提现
  </a-button>
  <a-table :columns="columns" :dataSource="data" :row-selection="rowSelection" :pagination="false" size="small"
    :scroll="{ x: 1000, y: 360 }" :loading="tableLoading" :row-key="'id'">
    <template #bodyCell="{ column, _, index }">
      <template v-if="column.key === 'index'">
        {{ page.pageSize * (page.current - 1) + index + 1 }}
      </template>
    </template>
  </a-table>
  <a-pagination v-if="page.total" v-model:current="page.current" v-model:pageSize="page.pageSize"
    :page-size-options="['10', '20', '30', '40', '50']" show-size-changer show-quick-jumper :total="page.total"
    :show-total="total => `共 ${total} 条`" size="small" :disabled="tableLoading" class="pagination" @change="onChange" />

</template>

<script setup lang="ts">
import { onMounted, reactive, Ref, ref } from 'vue';
import { MoneyCollectOutlined } from '@ant-design/icons-vue';
import { IWithdrawe, IPage } from '@/models';

type Key = string | number;

const totalMoney = ref(112893);
const sum = ref(0);

const result = [
  { id: 1, bank: "中国工商银行", name: '张三', account: '1234567890123456789', },
  { id: 2, bank: "中国农业银行", name: '张三', account: '1234567890123456789', },
  { id: 3, bank: "中国银行", name: '张三', account: '1234567890123456789', },
  { id: 4, bank: "中国建设银行", name: '张三', account: '1234567890123456789', },
  { id: 5, bank: "中国交通银行", name: '张三', account: '1234567890123456789', },
  { id: 6, bank: "中国邮政储蓄银行", name: '张三', account: '1234567890123456789', },
];

const page: Ref<IPage> = ref({
  total: 0,
  current: 1,
  pageSize: 10,
});
const data: Ref<IWithdrawe[]> = ref([]);
const tableLoading = ref(false);

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 80,
  },
  {
    title: '开户银行',
    dataIndex: 'bank',
    key: 'bank',
    width: 120,
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: 120,
  },
  {
    title: '银行账户',
    dataIndex: 'account',
    key: 'account',
    width: 120,
  },
];

onMounted(() => {
  getList();
})


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
    tableLoading.value = false;
  }, 2000);
};

const state = reactive<{
  selectedRowKeys: Key[];
  loading: boolean;
}>({
  selectedRowKeys: [], // Check here to configure the default column
  loading: false,
});


const onSelectChange = (selectedRowKeys: Key[]) => {
  console.log('selectedRowKeys changed: ', selectedRowKeys);
  state.selectedRowKeys = selectedRowKeys;
};

const rowSelection = ref({
  type: 'radio',
  selectedRowKeys: state.selectedRowKeys,
  onChange: onSelectChange,
});

const onWithdrawe = () => {
  console.log('提现');
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e8e8e8;
}

.sum-wrap {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  .label {
    min-width: fit-content;
  }

  .sum-input {
    width: 240px;
  }
}

.total-money-btn {
  margin-left: 16px;
}

.withdrawe-btn {
  margin-bottom: 16px;
}
</style>
