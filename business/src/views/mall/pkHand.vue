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
  <a-table :columns="columns" :data-source="data" :pagination="false" size="small" :scroll="{ x: 1000, y: 400 }"
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
    :show-total="total => `共 ${total} 条`" size="small" :disabled="tableLoading" class="pagination" @change="onChange" />

  <add-p-k-handle v-if="visible" @cancel="onCancel" @confirm="onConfirm" />
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted, Ref, ref } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { IPKHandle, IPage } from '@/models';
import { message } from 'ant-design-vue';
const result = [
  { id: 1, name: "PK 手名称1", nickName: '昵称1', phone: '13800138000', winningPercentage: 12, points: 500 },
  { id: 2, name: "PK 手名称2", nickName: '昵称2', phone: '13800138001', winningPercentage: 13, points: 1500 },
  { id: 3, name: "PK 手名称3", nickName: '昵称3', phone: '13800138002', winningPercentage: 14, points: 500 },
  { id: 4, name: "PK 手名称4", nickName: '昵称4', phone: '13800138003', winningPercentage: 15, points: 2500 },
  { id: 5, name: "PK 手名称5", nickName: '昵称5', phone: '13800138004', winningPercentage: 16, points: 530 },
  { id: 6, name: "PK 手名称6", nickName: '昵称6', phone: '13800138005', winningPercentage: 17, points: 3500 },
  { id: 7, name: "PK 手名称7", nickName: '昵称7', phone: '13800138006', winningPercentage: 18, points: 500 },
  { id: 8, name: "PK 手名称8", nickName: '昵称8', phone: '13800138007', winningPercentage: 19, points: 4500 },
  { id: 9, name: "PK 手名称9", nickName: '昵称9', phone: '13800138008', winningPercentage: 12, points: 500 },
  { id: 10, name: "PK 手名称10", nickName: '昵称10', phone: '13800138009', winningPercentage: 11, points: 5500 },
  { id: 11, name: "PK 手名称11", nickName: '昵称11', phone: '13800138010', winningPercentage: 10, points: 590 },
  { id: 12, name: "PK 手名称12", nickName: '昵称12', phone: '13800138011', winningPercentage: 9, points: 6500 },
  { id: 13, name: "PK 手名称13", nickName: '昵称13', phone: '13800138012', winningPercentage: 54, points: 500 },
  { id: 14, name: "PK 手名称14", nickName: '昵称14', phone: '13800138013', winningPercentage: 45, points: 7500 },
  { id: 15, name: "PK 手名称15", nickName: '昵称15', phone: '13800138014', winningPercentage: 32, points: 520 },
  { id: 16, name: "PK 手名称16", nickName: '昵称16', phone: '13800138015', winningPercentage: 47, points: 8500 },
  { id: 17, name: "PK 手名称17", nickName: '昵称17', phone: '13800138016', winningPercentage: 78, points: 500 },
  { id: 18, name: "PK 手名称18", nickName: '昵称18', phone: '13800138017', winningPercentage: 53, points: 9500 },
  { id: 19, name: "PK 手名称19", nickName: '昵称19', phone: '13800138018', winningPercentage: 78, points: 500 },
  { id: 20, name: "PK 手名称20", nickName: '昵称20', phone: '13800138019', winningPercentage: 91, points: 510 },
  { id: 21, name: "PK 手名称21", nickName: '昵称21', phone: '13800138020', winningPercentage: 12, points: 50 },
  { id: 22, name: "PK 手名称22", nickName: '昵称22', phone: '13800138021', winningPercentage: 39, points: 500 },
];

const addPKHandle = defineAsyncComponent(() => import('./components/addPKHandle.vue'));

const name = ref<string>('');
const phone = ref<string>('');
const page: Ref<IPage> = ref({
  total: 0,
  current: 1,
  pageSize: 10,
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
    fixed: 'left',
  },
  {
    title: 'PK 手名称',
    dataIndex: 'name',
    key: 'name',
    width: 320,
    fixed: 'left',
  },
  {
    title: '手机号码',
    dataIndex: 'phone',
    key: 'phone',
    width: 150,
  },
  {
    title: '胜率（%）',
    dataIndex: 'winningPercentage',
    key: 'winningPercentage',
    width: 150,
    sorter: (a: IPKHandle, b: IPKHandle) => a.winningPercentage - b.winningPercentage,
  },
  {
    title: '积分',
    dataIndex: 'points',
    key: 'points',
    width: 150,
    sorter: (a: IPKHandle, b: IPKHandle) => a.points - b.points,
  },
  {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    width: 140,
    fixed: 'right',
  },
];

onMounted(() => {
  onSearch();
})

const onSearch = (): void => {
  // 模拟搜索操作，实际应从API获取数据  
  console.log('Searching with:', name.value.trim());
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

const onConfirmDelete = (id: number): void => {
  // 模拟删除操作，实际应从API删除数据
  console.log('Deleting--id', id);
  message.success('删除成功');
  page.value.current = 1;
  getList();
}
const onCancelDelete = (): void => {
  message.info('您取消了删除');
};

const onAdd = (): void => {
  visible.value = true;
}
const onCancel = (): void => {
  visible.value = false;
}
const onConfirm = (): void => {
  visible.value = false;
  page.value.current = 1;
  getList();
}
</script>

<style lang="scss" scoped>
.add-btn {
  margin-bottom: 16px;
}
</style>
