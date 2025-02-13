<!-- 账户余额 -->
<template>
  <div class="header">
    <div class="balance">
      <a-statistic title="可用余额（人民币）" :precision="2" prefix="¥" suffix="元" :value="balance" />
      <a-button :disabled="balanceLoading" :loading="balanceLoading" title="刷新余额" class="refresh-btn"
        @click="onRefreshBalance">
        <template #icon>
          <ReloadOutlined />
        </template>
      </a-button>
    </div>
    <a-button type="primary" class="to-withdraw-btn" :disabled="!balance" @click="onToWithdraw">
      <template #icon>
        <MoneyCollectOutlined />
      </template>
      去提现
    </a-button>
  </div>
  <div class="search">
    <div class="search-item">
      <label class="label" for="date">交易日期：</label>
      <a-range-picker id="date" v-model:value="date" :locale="locale" :disabled-date="disabledDate" />
    </div>
    <div class="search-item">
      <label class="label" for="sources">来源：</label>
      <a-select id="sources" ref="select" v-model:value="source" style="width: 120px" :options="options"
        placeholder="请选择来源" @focus="focus" @change="handleChange"></a-select>
    </div>
    <div class="search-item">
      <a-button type="primary" html-type="submit" :loading="searchLoading" :disabled="resetLoading || tableLoading"
        @click="onSearch">搜索</a-button>
      <a-button html-type="reset" :loading="resetLoading" :disabled="searchLoading || tableLoading" @click="onReset"
        class="reset-btn">重置</a-button>
    </div>
  </div>
  <a-table :columns="columns" :data-source="data" :pagination="false" size="small" :scroll="{ x: 1000, y: 320 }"
    :loading="tableLoading" row-key="id">
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'index'">
        {{ page.pageSize * (page.current - 1) + index + 1 }}
      </template>
      <template v-else-if="column.key === 'source'">
        <a-tag v-if="record.source === 1" color="orange">订单</a-tag>
        <a-tag v-else-if="record.source === 2" color="blue">扣款</a-tag>
        <a-tag v-else-if="record.source === 3" color="purple">返点</a-tag>
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
import { MoneyCollectOutlined, ReloadOutlined } from '@ant-design/icons-vue';
import { IBalance, IPage } from '@/models';
import { SelectProps } from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/date-picker/locale/zh_CN';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { useRouter } from 'vue-router';
import { getAccountExchangeList, getAccountInfo } from '@/services';
import { formatTime } from '@/utils';
import { IGetAccountExchangeListReq } from '@/services/models';

const locale = zhCN;
dayjs.locale('zh-cn');
const router = useRouter();

const source: Ref<null | number> = ref(null);
const options = ref<SelectProps['options']>([
  {
    value: 1,
    label: '订单'
  },
  {
    value: 2,
    label: '扣款'
  },
  {
    value: 3,
    label: '返点'
  }
]);
const dateFormat = 'YYYY-MM-DD';
type RangeValue = [Dayjs, Dayjs];
const date = ref<RangeValue>();
const balance = ref(0);
const page: Ref<IPage> = ref({
  total: 0,
  current: 1,
  pageSize: 10
});
const data: Ref<IBalance[]> = ref([]);
const searchLoading = ref(false);
const resetLoading = ref(false);
const tableLoading = ref(false);
const balanceLoading = ref(false);

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 80
  },
  {
    title: '金额（元）',
    dataIndex: 'sum',
    width: 120
  },
  {
    title: '交易时间',
    dataIndex: 'time',
    width: 120
  },
  {
    title: '来源',
    dataIndex: 'source',
    width: 120
  }
];

onMounted(() => {
  getAccountInfoFn();
  onSearch();
});

const disabledDate = (current: Dayjs) => {
  return current && current > dayjs().endOf('day');
};

const focus = () => {
  console.log('focus');
};

const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};

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

const onSearch = (): void => {
  page.value.current = 1;
  page.value.pageSize = 10;
  searchLoading.value = true;
  tableLoading.value = true;
  getList();
};

const onReset = (): void => {
  date.value = undefined;
  source.value = null;
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
  tableLoading.value = true;
  // console.log("date[0]", dayjs(date).format(dateFormat));
  const params: IGetAccountExchangeListReq = {
    page: page.value.current,
    pageSize: page.value.pageSize
  };
  if (date.value !== null && date.value !== undefined) {
    params.completeStartTime = dayjs(date.value?.[0]).format(dateFormat);
    params.completeEndTime = dayjs(date.value?.[1]).format(dateFormat);
  }
  if (source.value !== null && source.value !== undefined) {
    params.source = source.value;
  }
  if (source.value !== null && source.value !== undefined) {
    params.source = source.value;
  }
  getAccountExchangeList(params)
    .then(res => {
      const result = res.data;
      page.value.total = result.totalNum;

      data.value = result.list.map(item => {
        return {
          id: item.id,
          sum: item.balance,
          time: formatTime(item.completeTime),
          source: item.source
        }
      })
    })
    .finally(() => {
      searchLoading.value = false;
      resetLoading.value = false;
      tableLoading.value = false;
    })
};

const onToWithdraw = (): void => {
  router.push('/account/withdrawe');
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e8e8e8;
}

.balance {
  display: flex;
  align-items: center;

  .refresh-btn {
    margin-left: 16px;
  }
}

.to-withdraw-btn {
  margin-left: 48px;
}
</style>
