<!-- 线上商城-扫一扫 -->
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
  <a-button type="primary" class="add-btn" @click="onAdd">
    <template #icon>
      <PlusOutlined />
    </template>
    添加
  </a-button>
  <a-table :columns="columns" :data-source="data" :pagination="false" size="small" :scroll="{ x: 1000, y: 340 }"
    :loading="tableLoading" row-key="id">
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'index'">
        {{ page.pageSize * (page.current - 1) + index + 1 }}
      </template>
      <template v-if="column.key === 'QRCode'">
        <a-popover trigger="click">
          <template #title>
            <span class="popover-title"> {{ record.goodsName }}</span>
          </template>
          <template #content>
            <a-qrcode ref="qrcodeCanvasRef" :size="200" value="http://www.antdv.com" />
            <a-button type="primary" class="popover-download-btn" @click="onDownloadChange">下载</a-button>
          </template>
          <img :src="record.QRCode" alt="二维码" title="点击查看" class="q-r-code" />
        </a-popover>
      </template>
      <template v-if="column.key === 'state'">
        <a-tag v-if="record.state === 0" color="default">待售</a-tag>
        <a-tag v-if="record.state === 1" color="processing">销售中</a-tag>
        <a-tag v-if="record.state === 2" color="default">停售</a-tag>
      </template>
      <template v-if="column.key === 'action'">
        <a-button type="link" :disabled="record.state === 1" @click="onEdit(record)">编辑</a-button>
        <a-divider type="vertical" />
        <a-popconfirm v-if="record.state === 1" placement="topRight" :title="`确认下架商品 ${record.goodsName} 吗？`"
          ok-text="确定" :ok-button-props="{ type: 'default', danger: true }" cancel-text="取消"
          @confirm="onConfirmOutOf(record.id)" @cancel="onCancelOutOf">
          <a-button type="link">下架</a-button>
        </a-popconfirm>
        <a-popconfirm v-if="record.state === 0 || record.state === 2" placement="topRight"
          :title="`确认上架商品 ${record.goodsName} 吗？`" ok-text="确定" :ok-button-props="{ type: 'default', danger: true }"
          cancel-text="取消" @confirm="onConfirmPutaway(record.id)" @cancel="onCancelPutaway">
          <a-button type="link">上架</a-button>
        </a-popconfirm>
      </template>
    </template>
  </a-table>
  <a-pagination v-if="page.total" v-model:current="page.current" v-model:pageSize="page.pageSize"
    :page-size-options="['10', '20', '30', '40', '50']" show-size-changer show-quick-jumper :total="page.total"
    :show-total="(total: number) => `共 ${total} 条`" size="small" :disabled="tableLoading" class="pagination"
    @change="onChange" />

  <manage-scan v-if="visible" :is-edit="isEdit" :goods-id="currentGoods.id" @cancel="onCancel" @confirm="onConfirm" />
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted, Ref, ref } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { IScanForSale, IPage } from '@/models';
import { message } from 'ant-design-vue';
import { getScanList, setScanState } from '@/services';

const manageScan = defineAsyncComponent(() => import('./components/manageScan.vue'));

const goodsName = ref<string>('');
const page: Ref<IPage> = ref({
  total: 0,
  current: 1,
  pageSize: 10
});
const data: Ref<IScanForSale[]> = ref([]);
const searchLoading = ref(false);
const resetLoading = ref(false);
const tableLoading = ref(false);
const visible = ref(false);
const currentGoods: Ref<IScanForSale> = ref({
  id: 0,
  goodsName: '',
  originalPrice: 0,
  settlementPrice: 0,
  minPrice: 0,
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
    width: 220,
    ellipsis: true,
    fixed: 'left'
  },
  {
    title: '原价（元）',
    dataIndex: 'originalPrice',
    width: 110
  },
  {
    title: '结算价（元）',
    dataIndex: 'settlementPrice',
    width: 110
  },
  {
    title: '竞猜小价（元）',
    dataIndex: 'minPrice',
    width: 130
  },
  {
    title: '二维码',
    dataIndex: 'QRCode',
    width: 100
  },
  {
    title: '状态',
    dataIndex: 'state',
    width: 80
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: 160,
    fixed: 'right'
  }
];

const qrcodeCanvasRef = ref();

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

const onDownloadChange = async () => {
  const url = await qrcodeCanvasRef.value.toDataURL();
  const a = document.createElement('a');
  a.download = 'QRCode.png';
  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
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
    name: goodsName.value.trim(),
    page: page.value.current,
    pageSize: page.value.pageSize
  };
  getScanList(params)
    .then(res => {
      const result = res.data;
      page.value.total = result.totalNum;
      data.value = result.list.map(item => {
        return {
          id: item.id,
          goodsName: item.name || "",
          originalPrice: item.price ? item.price / 100 : 0,
          settlementPrice: item.settlePrice ? item.settlePrice / 100 : 0,
          minPrice: item.guessSmallPrice ? item.guessSmallPrice / 100 : 0,
          QRCode: item?.QRCode || "",
          state: item.state
        }
      })
    })
    .finally(() => {
      searchLoading.value = false;
      resetLoading.value = false;
      tableLoading.value = false;
    })
};
const onConfirmOutOf = (id: number): void => {
  const params = {
    id,
    state: 2, //1:销售中; 2:停止销售
  };
  setScanState(params)
    .then(() => {
      message.success('下架操作成功');
      getList();
    })
};
const onCancelOutOf = (): void => {
  message.info('您取消了下架操作');
};

const onConfirmPutaway = (id: number): void => {
  const params = {
    id,
    state: 1, //1:销售中; 2:停止销售
  };
  setScanState(params)
    .then(() => {
      message.success('上架操作成功');
      getList();
    })
};
const onCancelPutaway = (): void => {
  message.info('您取消了上架操作');
};

const onAdd = (): void => {
  isEdit.value = false;
  visible.value = true;
};
const onEdit = (record: IScanForSale): void => {
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
