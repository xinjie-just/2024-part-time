<!-- 账户提现 -->
<template>
  <div class="balance">
    <a-statistic title="可用余额（人民币）" :precision="2" prefix="¥" suffix="元" :value="balance" class="statistic" />
    <a-button :disabled="balanceLoading" :loading="balanceLoading" title="刷新余额" class="refresh-btn"
      @click="onRefreshBalance">
      <template #icon>
        <ReloadOutlined />
      </template>
    </a-button>
  </div>
  <a-alert message="请输入提现金额，并选择银行账户后点击提现按钮" type="info" show-icon class="alert" />
  <div class="handle">
    <div class="sum-wrap">
      <label for="sum" class="label">提现金额：</label>
      <a-input-number v-model:value="sum" :min="0.01" :max="balance" :precision="2" placeholder="请输入（元）"
        class="sum-input">
        <template #addonBefore>
          <span>￥</span>
        </template>
        <template #addonAfter>
          <a-button type="link" :disabled="!balance" size="small" class="total-money-btn"
            @click="sum = balance">全部金额</a-button>
        </template>
      </a-input-number>
      <a-button type="primary" ghost class="withdrawe-btn" :disabled="!(selectedIds.length && sum)"
        @click="onWithdrawe">
        <template #icon>
          <MoneyCollectOutlined />
        </template>
        提现
      </a-button>
    </div>
    <a-button type="primary" class="add-btn" @click="onAdd">
      <template #icon>
        <PlusOutlined />
      </template>
      添加账户
    </a-button>
  </div>

  <a-table :columns="columns" :data-source="data"
    :row-selection="{ type: 'radio', selectedRowKeys: selectedIds, onChange: onSelectChange }" :pagination="false"
    size="small" :scroll="{ x: 1000, y: 360 }" :loading="tableLoading" row-key="id">
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'index'">
        {{ index + 1 }}
      </template>
      <template v-else-if="column.key === 'action'">
        <a-popconfirm placement="topRight" :title="`确认删除账户 ${record.name} 吗？`" ok-text="确定"
          :ok-button-props="{ type: 'default', danger: true }" cancel-text="取消" @confirm="onConfirmDelete(record.id)"
          @cancel="onCancelDelete">
          <a-button type="link">删除</a-button>
        </a-popconfirm>
      </template>
    </template>
  </a-table>

  <confirm-account v-if="visible" @cancel="onCancel" @confirm="onConfirm" />
  <add-account v-if="addVisible" @cancel="onCancelAdd" @confirm="onConfirmAdd" />
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted, Ref, ref } from 'vue';
import { MoneyCollectOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons-vue';
import { IWithdrawe, IPage } from '@/models';
import { message } from 'ant-design-vue';
import { getAccountInfo, getBankCardList } from '@/services';

const confirmAccount = defineAsyncComponent(() => import('./components/confirmAccount.vue'));
const addAccount = defineAsyncComponent(() => import('./components/addAccount.vue'));

const balance = ref(0);
const sum = ref(0);
const visible = ref(false);
const addVisible = ref(false);
const selectedIds: Ref<number[]> = ref([]);

const result = [
  { id: 1, bank: '中国工商银行', name: '张三', account: '1234567890123456789' },
  { id: 2, bank: '中国农业银行', name: '张三', account: '1234567890123456789' },
  { id: 3, bank: '中国银行', name: '张三', account: '1234567890123456789' },
  { id: 4, bank: '中国建设银行', name: '张三', account: '1234567890123456789' },
  { id: 5, bank: '中国交通银行', name: '张三', account: '1234567890123456789' },
  { id: 6, bank: '中国邮政储蓄银行', name: '张三', account: '1234567890123456789' }
];

const data: Ref<IWithdrawe[]> = ref([]);
const tableLoading = ref(false);
const balanceLoading = ref(false);

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 70,
    fixed: 'left'
  },
  {
    title: '开户银行',
    dataIndex: 'bank',
    key: 'bank',
    width: 120
  },
  {
    title: '账户姓名',
    dataIndex: 'name',
    key: 'name',
    width: 100
  },
  {
    title: '银行卡号',
    dataIndex: 'account',
    key: 'account',
    width: 160
  },
  {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    width: 90,
    fixed: 'right'
  }
];

onMounted(() => {
  getAccountInfoFn();
  getList();
});

const onRefreshBalance = () => {
  getAccountInfoFn();
};

const getAccountInfoFn = () => {
  balanceLoading.value = true;
  getAccountInfo()
    .then(res => {
      const result = res.data;
      balance.value = result.balance;
    })
    .finally(() => {
      balanceLoading.value = false;
    })
};

const getList = (): void => {
  tableLoading.value = true;
  getBankCardList()
    .then(
      (res) => {
        const result = res.data;
        data.value = result.map(item => {
          return {
            id: item.id,
            bank: item.backName,
            name: item.cardUserName,
            account: item.cardNumber
          }
        });
      })
    .finally(() => {
      tableLoading.value = false;
    })
};

const onSelectChange = (selectedRowKeys: number[]) => {
  console.log('selectedRowKeys changed: ', selectedRowKeys);
  selectedIds.value = selectedRowKeys;
};

const onConfirmDelete = (id: number): void => {
  // 模拟删除操作，实际应从API删除数据
  console.log('Deleting--id', id);
  message.success('删除成功');
  getList();
};
const onCancelDelete = (): void => {
  message.info('您取消了删除');
};

const onWithdrawe = () => {
  visible.value = true;
};
const onCancel = () => {
  visible.value = false;
};
const onConfirm = () => {
  visible.value = false;
  selectedIds.value = [];
  sum.value = 0;
};

const onAdd = () => {
  addVisible.value = true;
};
const onCancelAdd = () => {
  addVisible.value = false;
};
const onConfirmAdd = () => {
  addVisible.value = false;
  getList();
};
</script>

<style lang="scss" scoped>
.balance {
  display: flex;
  align-items: center;
  margin-bottom: 16px;

  .refresh-btn {
    margin-left: 16px;
  }
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
    width: 280px;
  }

  .withdrawe-btn {
    margin-left: 16px;
  }
}
</style>
