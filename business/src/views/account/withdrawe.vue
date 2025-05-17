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
      <a-button type="primary" ghost class="withdrawe-btn" :disabled="!selectedIds.length || sum === 0 || sum > balance"
        @click="onWithdrawe">
        <template #icon>
          <MoneyCollectOutlined />
        </template>
        提现
      </a-button>
    </div>
    <a-button type="primary" class="add-account-btn" @click="onAdd">
      <template #icon>
        <PlusOutlined />
      </template>
      添加账户
    </a-button>
  </div>

  <a-table :columns="columns" :data-source="data"
    :row-selection="{ type: 'radio', selectedRowKeys: selectedIds, onChange: onSelectChange }" :pagination="false"
    size="small" :scroll="{ x: 1000, y: 320 }" :loading="tableLoading" row-key="id">
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.dataIndex === 'index'">
        {{ index + 1 }}
      </template>
      <template v-else-if="column.dataIndex === 'action'">
        <a-popconfirm placement="topRight" :title="`确认删除账户 ${record.cardNumber} 吗？`" ok-text="确定"
          :ok-button-props="{ type: 'default', danger: true }" cancel-text="取消" @confirm="onConfirmDelete(record.id)"
          @cancel="onCancelDelete">
          <a-button type="link">删除</a-button>
        </a-popconfirm>
      </template>
    </template>
  </a-table>

  <confirm-account v-if="visible" :account="selectedAccount" :sum="sum" @cancel="onCancel" @confirm="onConfirm" />
  <add-account v-if="addVisible" @cancel="onCancelAdd" @confirm="onConfirmAdd" />
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted, Ref, ref } from 'vue';
import { MoneyCollectOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { getAccountInfo, getBankCardList, removeBankCard } from '@/services';
import { IBankCardListRes } from '@/services/models';

const confirmAccount = defineAsyncComponent(() => import('./components/confirmAccount.vue'));
const addAccount = defineAsyncComponent(() => import('./components/addAccount.vue'));

const balance = ref(0);
const sum = ref(0);
const visible = ref(false);
const addVisible = ref(false);
const selectedIds: Ref<number[]> = ref([]);
const selectedAccount: Ref<IBankCardListRes> = ref({
  id: 0, // 银行卡ID
  backName: '', // 银行卡开户银行
  cardUserName: '', // 银行卡户主名
  cardNumber: '', // 银行卡号
});

const data: Ref<IBankCardListRes[]> = ref([]);
const tableLoading = ref(false);
const balanceLoading = ref(false);

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    width: 70,
    fixed: 'left'
  },
  {
    title: '开户银行',
    dataIndex: 'backName',
    width: 120
  },
  {
    title: '账户姓名',
    dataIndex: 'cardUserName',
    width: 100
  },
  {
    title: '银行卡号',
    dataIndex: 'cardNumber',
    width: 160
  },
  {
    title: '操作',
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
      balance.value = result.balance / 100;
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
        data.value = result;
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
  removeBankCard({ id })
    .then(() => {
      message.success('删除成功');
      getList();
    })
};
const onCancelDelete = (): void => {
  message.info('您取消了删除');
};

const onWithdrawe = () => {
  selectedAccount.value = data.value.find(item => item.id === selectedIds.value[0]) as IBankCardListRes;
  visible.value = true;
};
const onCancel = () => {
  visible.value = false;
};
const onConfirm = () => {
  visible.value = false;
  selectedIds.value = [];
  sum.value = 0;
  getAccountInfoFn();
  getList();
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
