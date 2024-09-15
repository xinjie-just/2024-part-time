<!-- PK 品-停售 -->
<template>
  <div class="search">
    <div class="search-item">
      <label class="label" for="goodsName">商品名称：</label>
      <a-input v-model:value.trim="goodsName" id="goodsName" allow-clear placeholder="请输入商品名称" class="input"
        @pressEnter="onSearch" />
    </div>
    <div class="search-item">
      <a-button type="primary" html-type="submit" :loading="searchLoading" :disabled="resetLoading || tableLoading"
        @click="onSearch">搜索</a-button>
      <a-button html-type="reset" :loading="resetLoading" :disabled="searchLoading || tableLoading" @click="onReset"
        class="reset-btn">重置</a-button>
    </div>
  </div>
  <a-table :columns="columns" :data-source="data" :pagination="false" size="small" :scroll="{ x: 1000, y: 380 }"
    :loading="tableLoading" row-key="id">
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'index'">
        {{ page.pageSize * (page.current - 1) + index + 1 }}
      </template>
      <template v-else-if="column.key === 'action'">
        <a-button type="link" @click="onEdit(record)">编辑</a-button>
        <a-divider type="vertical" />
        <a-popconfirm placement="topRight" :title="`确认上架商品 ${record.goodsName} 吗？`" ok-text="确定"
          :ok-button-props="{ type: 'default', danger: true }" cancel-text="取消" @confirm="onConfirmPutaway(record.id)"
          @cancel="onCancelPutaway">
          <a-button type="link">上架</a-button>
        </a-popconfirm>
      </template>
    </template>
  </a-table>
  <a-pagination v-if="page.total" v-model:current="page.current" v-model:pageSize="page.pageSize"
    :page-size-options="['10', '20', '30', '40', '50']" show-size-changer show-quick-jumper :total="page.total"
    :show-total="(total: number) => `共 ${total} 条`" size="small" :disabled="tableLoading" class="pagination"
    @change="onChange" />

  <manage-p-k v-if="visible" :is-edit="isEdit" :goods-id="currentGoods.id" @cancel="onCancel" @confirm="onConfirm" />
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted, Ref, ref } from 'vue';
import { IPKOutOfSale, IPage } from '@/models';
import { message } from 'ant-design-vue';
import { getPKList, setPKState } from '@/services';

const managePK = defineAsyncComponent(() => import('../managePK.vue'));

const goodsName = ref<string>('');
const page: Ref<IPage> = ref({
  total: 0,
  current: 1,
  pageSize: 10
});
const data: Ref<IPKOutOfSale[]> = ref([]);
const searchLoading = ref(false);
const resetLoading = ref(false);
const tableLoading = ref(false);
const visible = ref(false);
const currentGoods: Ref<IPKOutOfSale> = ref({
  id: 0,
  goodsName: '',
  originalPrice: 0,
  settlementPrice: 0,
  currentPrice: 0,
  QRCode: ''
});
const isEdit = ref(false);

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 80,
    fixed: 'left'
  },
  {
    title: '商品名称',
    dataIndex: 'goodsName',
    key: 'goodsName',
    width: 220,
    ellipsis: true,
    fixed: 'left'
  },
  {
    title: '原价（元）',
    dataIndex: 'originalPrice',
    key: 'originalPrice',
    width: 110
  },
  {
    title: '结算价（元）',
    dataIndex: 'settlementPrice',
    key: 'settlementPrice',
    width: 110
  },
  {
    title: '现价（元）',
    dataIndex: 'currentPrice',
    key: 'currentPrice',
    width: 110
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: 160,
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
  goodsName.value = '';
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
  const params = {
    state: 2, // 商品状态(1:销售中; 2:停止销售)
    name: goodsName.value.trim(),
    page: page.value.current,
    pageSize: page.value.pageSize
  };
  getPKList(params)
    .then(res => {
      const result = res.data;
      page.value.total = result.totalNum;
      data.value = result.list.map(item => {
        return {
          id: item.id,
          goodsName: item.name || "",
          originalPrice: item.price || 0,
          settlementPrice: item.settlePrice || 0,
          currentPrice: item.currentPrice || 0,
          miniPrice: item.guessSmallPrice || 0,
          QRCode: item?.QRCode || ""
        }
      })
    })
    .finally(() => {
      searchLoading.value = false;
      resetLoading.value = false;
      tableLoading.value = false;
    })
};
const onConfirmPutaway = (id: number): void => {
  getList();
  const params = {
    id,
    state: 1, //1:销售中; 2:停止销售
  };
  setPKState(params)
    .then(() => {
      message.success('上架操作成功');
      page.value.current = 1;
      getList();
    })
};
const onCancelPutaway = (): void => {
  message.info('您取消了上架操作');
};

const onEdit = (record: IPKOutOfSale): void => {
  isEdit.value = true;
  visible.value = true;
  currentGoods.value = record;
};
const onCancel = (): void => {
  visible.value = false;
};
const onConfirm = (): void => {
  visible.value = false;
  page.value.current = 1;
  getList();
};
</script>

<style lang="scss">
.q-r-code {
  display: block;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
}
</style>

<style lang="scss" scoped>
.add-btn {
  margin-bottom: 16px;
}

.popover-download-btn {
  display: block;
  margin: 16px auto 8px;
}

.popover-title {
  display: block;
  text-align: center;
  margin: 8px auto;
  max-width: 200px; // 不大于头像图片宽度
  word-break: break-all;
}
</style>
