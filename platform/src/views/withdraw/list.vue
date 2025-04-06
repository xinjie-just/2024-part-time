<!-- 提现管理 -->
<template>
  <a-table :columns="columns" :data-source="data" :pagination="false" size="small" :scroll="{ x: 1000, y: 470 }"
    :loading="tableLoading" row-key="id">
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.dataIndex === 'index'">
        {{ page.pageSize * (page.current - 1) + index + 1 }}
      </template>
      <template v-if="column.dataIndex === 'status'">
        <a-tag v-if="+record.status === 0" color="default">
          未处理
        </a-tag>
        <a-tag v-if="+record.status === 1" color="success">
          已处理
        </a-tag>
        <a-tag v-if="+record.status === 2" color="error">
          已拒绝
        </a-tag>
      </template>
      <template v-else-if="column.dataIndex === 'action'">
        <a-button type="link" :disabled="+record.status !== 0" @click="onAudit(record)">处理</a-button>
      </template>
    </template>
  </a-table>
  <a-pagination v-if="page.total" v-model:current="page.current" v-model:pageSize="page.pageSize"
    :page-size-options="['10', '20', '30', '40', '50']" show-size-changer show-quick-jumper :total="page.total"
    :show-total="(total: number) => `共 ${total} 条`" size="small" :disabled="tableLoading" class="pagination"
    @change="onChange" />

  <audit-withdraw v-if="visible" :id="selectedId" @cancel="onCancel" @confirm="onConfirm" />
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted, Ref, ref } from 'vue';
import { getWithdrawList } from '@/services';
import { IWithdrawListItem } from '@/services/models';
import { IPage } from '@/models';

const auditWithdraw = defineAsyncComponent(() => import('./components/auditWithdraw.vue'));

const data: Ref<IWithdrawListItem[]> = ref([]);
const visible = ref(false);
const tableLoading = ref(false);
const selectedId = ref(0);
const page: Ref<IPage> = ref({
  total: 0,
  current: 1,
  pageSize: 10
});

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 70,
    fixed: 'left'
  },
  {
    title: '商户手机号',
    dataIndex: 'shopPhone',
    width: 110,
    fixed: 'left'
  },
  {
    title: '商户名称',
    dataIndex: 'shopName',
    width: 160
  },
  {
    title: '开户银行',
    dataIndex: 'bankName',
    width: 120
  },
  {
    title: '银行账号',
    dataIndex: 'cardNumber',
    width: 170
  },
  {
    title: '账户姓名',
    dataIndex: 'cardUserName',
    width: 100
  },
  {
    title: '提现金额（元）',
    dataIndex: 'amount',
    width: 120
  },
  {
    title: '申请时间',
    dataIndex: 'submitTime',
    width: 160
  },
  {
    title: '处理状态',
    dataIndex: 'status',
    width: 90
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: 100,
    fixed: 'right'
  }
];

onMounted(() => {
  getList();
});

const getList = (): void => {
  tableLoading.value = true;
  const params = {
    page: page.value.current,
    pageSize: page.value.pageSize
  };
  getWithdrawList(params)
    .then(res => {
      const result = res.data;
      page.value.total = result.totalNum;
      data.value = result.list.map(item => {
        return {
          ...item,
          amount: item.amount / 100
        };
      });
    })
    .finally(() => {
      tableLoading.value = false;
    })
};
const onChange = (current: number, pageSize: number): void => {
  page.value.current = current;
  page.value.pageSize = pageSize;
  getList();
};

const onAudit = (record: IWithdrawListItem): void => {
  visible.value = true;
  selectedId.value = record.id;
};

const onConfirm = (): void => {
  visible.value = false;
  getList();
}

const onCancel = (): void => {
  visible.value = false;
}

</script>

<style lang="scss" scoped>
.add-btn {
  margin-bottom: 16px;
}
</style>
