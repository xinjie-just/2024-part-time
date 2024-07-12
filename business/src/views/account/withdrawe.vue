<!-- 账户提现 -->
<template>
  <a-statistic title="可用余额（人民币）" :precision="2" prefix="¥" suffix="元" :value="totalMoney" class="statistic" />
  <a-alert message="请输入提现金额，并选择银行账户" type="info" show-icon class="alert" />
  <div class="handle">
    <a-button type="primary" class="withdrawe-btn" :disabled="!(selectedIds.length && sum)" @click="onWithdrawe">
      <template #icon>
        <MoneyCollectOutlined />
      </template>
      提现
    </a-button>
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
      <a-button type="link" :disabled="!totalMoney" class="total-money-btn" @click="sum = totalMoney">全部金额</a-button>
    </div>
  </div>
  <a-table :columns="columns" :dataSource="data"
    :row-selection="{ type: 'radio', selectedRowKeys: selectedIds, onChange: onSelectChange }" :pagination="false"
    size="small" :scroll="{ x: 1000, y: 360 }" :loading="tableLoading" :row-key="'id'">
    <template #bodyCell="{ column, _, index }">
      <template v-if="column.key === 'index'">
        {{ page.pageSize * (page.current - 1) + index + 1 }}
      </template>
    </template>
  </a-table>
  <a-pagination v-if="page.total" v-model:current="page.current" v-model:pageSize="page.pageSize"
    :page-size-options="['10', '20', '30', '40', '50']" show-size-changer show-quick-jumper :total="page.total"
    :show-total="total => `共 ${total} 条`" size="small" :disabled="tableLoading" class="pagination" @change="onChange" />

  <confirm-account v-if="visible" @cancel="onCancel" @confirm="onConfirm" />
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted, Ref, ref } from 'vue';
import { MoneyCollectOutlined } from '@ant-design/icons-vue';
import { IWithdrawe, IPage } from '@/models';

const confirmAccount = defineAsyncComponent(() => import('./components/confirmAccount.vue'));

const totalMoney = ref(112893);
const sum = ref(0);
const visible = ref(false);;
const selectedIds: Ref<number[]> = ref([]);

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
    title: '账户姓名',
    dataIndex: 'name',
    key: 'name',
    width: 120,
  },
  {
    title: '银行卡号',
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

const onSelectChange = (selectedRowKeys: number[]) => {
  console.log('selectedRowKeys changed: ', selectedRowKeys);
  selectedIds.value = selectedRowKeys;
};

const onWithdrawe = () => {
  visible.value = true;
}
const onCancel = () => {
  visible.value = false;
}
const onConfirm = () => {
  visible.value = false;
  selectedIds.value = [];
  sum.value = 0;
}
</script>

<style lang="scss" scoped>
.statistic {
  margin-bottom: 16px;
}

.alert {
  margin-bottom: 16px;
}

.handle {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
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
  margin-left: 8px;
}
</style>
