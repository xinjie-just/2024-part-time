<!-- 线上商城-PK 手管理 -->
<template>
  <div class="search">
    <div class="search-item">
      <label class="label" for="name">PK 手名称：</label>
      <a-input v-model:value.trim="name" id="name" allow-clear placeholder="请输入 PK 手名称" class="input"
        @pressEnter="onSearch" />
    </div>
    <div class="search-item">
      <label class="label" for="phone">手机号码：</label>
      <a-input v-model:value.trim="phone" id="phone" allow-clear placeholder="请输入手机号码" class="input"
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
  <a-table :columns="columns" :data-source="data" :pagination="false" size="small" :scroll="{ x: 1000, y: 360 }"
    :loading="tableLoading" row-key="id">
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'index'">
        {{ page.pageSize * (page.current - 1) + index + 1 }}
      </template>
      <template v-else-if="column.key === 'action'">
        <a-popconfirm placement="topRight" :title="`确认删除 PK 手 ${record.name} 吗？`" ok-text="确定"
          :ok-button-props="{ type: 'default', danger: true }" cancel-text="取消" @confirm="onConfirmDelete(record.id)"
          @cancel="onCancelDelete">
          <a-button type="link">删除</a-button>
        </a-popconfirm>
      </template>
    </template>
  </a-table>
  <a-pagination v-if="page.total" v-model:current="page.current" v-model:pageSize="page.pageSize"
    :page-size-options="['10', '20', '30', '40', '50']" show-size-changer show-quick-jumper :total="page.total"
    :show-total="(total: number) => `共 ${total} 条`" size="small" :disabled="tableLoading" class="pagination"
    @change="onChange" />

  <add-p-k-handle v-if="visible" @cancel="onCancel" @confirm="onConfirm" />
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted, Ref, ref } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { IPKHandle, IPage } from '@/models';
import { message } from 'ant-design-vue';
import { deletePKPlayer, getPKPlayerList } from '@/services';

const addPKHandle = defineAsyncComponent(() => import('./components/addPKHandle.vue'));

const name = ref<string>('');
const phone = ref<string>('');
const page: Ref<IPage> = ref({
  total: 0,
  current: 1,
  pageSize: 10
});
const data: Ref<IPKHandle[]> = ref([]);
const visible = ref(false);
const searchLoading = ref(false);
const resetLoading = ref(false);
const tableLoading = ref(false);

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 80,
    fixed: 'left'
  },
  {
    title: 'PK 手名称',
    dataIndex: 'name',
    width: 320,
    fixed: 'left'
  },
  {
    title: '手机号码',
    dataIndex: 'phone',
    width: 150
  },
  {
    title: '胜率（%）',
    dataIndex: 'winningPercentage',
    width: 150,
    sorter: (a: IPKHandle, b: IPKHandle) => a.winningPercentage - b.winningPercentage
  },
  {
    title: '积分',
    dataIndex: 'points',
    width: 150,
    sorter: (a: IPKHandle, b: IPKHandle) => a.points - b.points
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: 140,
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
  name.value = '';
  phone.value = '';
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
    name: name.value.trim(),
    phone: phone.value.trim(),
    page: page.value.current,
    pageSize: page.value.pageSize
  };
  getPKPlayerList(params)
    .then((res) => {
      const result = res.data;
      page.value.total = result.totalNum;
      data.value = result.list.map(item => {
        return {
          id: item.id,
          name: item.name,
          nickName: item.name,
          phone: item.phone,
          winningPercentage: item.winRate,
          points: item.integral
        };
      });
    })
    .finally(() => {
      searchLoading.value = false;
      resetLoading.value = false;
      tableLoading.value = false;
    })
};

const onConfirmDelete = (id: number): void => {
  const params = {
    id
  };
  deletePKPlayer(params).then(() => {
    message.success('删除成功');
    page.value.current = 1;
    getList();
  })
};
const onCancelDelete = (): void => {
  message.info('您取消了删除');
};

const onAdd = (): void => {
  visible.value = true;
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

<style lang="scss" scoped>
.add-btn {
  margin-bottom: 16px;
}
</style>
