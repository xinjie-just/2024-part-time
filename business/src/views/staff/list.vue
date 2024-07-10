<!-- 员工管理 -->
<template>
  <div class="search">
    <div class="search-item">
      <label class="label" for="name">姓名：</label>
      <a-input v-model:value="name" id="name" allowClear placeholder="请输入姓名" class="input" @pressEnter="onSearch" />
    </div>
    <div class="search-item">
      <label class="label" for="phone">手机号码：</label>
      <a-input v-model:value="phone" id="phone" allowClear placeholder="请输入手机号码" class="input" @pressEnter="onSearch" />
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
  <a-table :columns="columns" :dataSource="data" :pagination="false" size="small" :scroll="{ x: 1000, y: 400 }"
    :loading="tableLoading" :row-key="'id'">
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'index'">
        {{ page.pageSize * (page.current - 1) + index + 1 }}
      </template>
      <template v-else-if="column.key === 'action'">
        <a-popconfirm :title="`确认删除员工 ${record.name} 吗？`" ok-text="确定" cancel-text="取消"
          @confirm="onConfirmDelete(record.id)" @cancel="onCancelDelete">
          <a-button type="link">删除</a-button>
        </a-popconfirm>
        <a-divider type="vertical" />
        <a-button type="link" @click="onEdit(record)">编辑</a-button>
      </template>
    </template>
  </a-table>
  <a-pagination v-if="page.total" v-model:current="page.current" v-model:pageSize="page.pageSize"
    :page-size-options="['10', '20', '30', '40', '50']" show-size-changer show-quick-jumper :total="page.total"
    :show-total="total => `共 ${total} 条`" size="small" :disabled="tableLoading" class="pagination" @change="onChange" />

  <manage-staff v-if="visible" :is-edit="isEdit" :staff-id="selectedStaffId" @cancel="onCancel" @confirm="onConfirm" />
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted, Ref, ref } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { IStaff, IPage } from '@/models';
import { message } from 'ant-design-vue';
const result = [
  { id: 1, name: "姓名1", nickName: '昵称1', phone: '13800138000', registrationTime: '2023-01-01 12:00:00' },
  { id: 2, name: "姓名2", nickName: '昵称2', phone: '13800138001', registrationTime: '2023-01-02 12:00:00' },
  { id: 3, name: "姓名3", nickName: '昵称3', phone: '13800138002', registrationTime: '2023-01-03 12:00:00' },
  { id: 4, name: "姓名4", nickName: '昵称4', phone: '13800138003', registrationTime: '2023-01-04 12:00:00' },
  { id: 5, name: "姓名5", nickName: '昵称5', phone: '13800138004', registrationTime: '2023-01-05 12:00:00' },
  { id: 6, name: "姓名6", nickName: '昵称6', phone: '13800138005', registrationTime: '2023-01-06 12:00:00' },
  { id: 7, name: "姓名7", nickName: '昵称7', phone: '13800138006', registrationTime: '2023-01-07 12:00:00' },
  { id: 8, name: "姓名8", nickName: '昵称8', phone: '13800138007', registrationTime: '2023-01-08 12:00:00' },
  { id: 9, name: "姓名9", nickName: '昵称9', phone: '13800138008', registrationTime: '2023-01-09 12:00:00' },
  { id: 10, name: "姓名10", nickName: '昵称10', phone: '13800138009', registrationTime: '2023-01-10 12:00:00' },
  { id: 11, name: "姓名11", nickName: '昵称11', phone: '13800138010', registrationTime: '2023-01-11 12:00:00' },
  { id: 12, name: "姓名12", nickName: '昵称12', phone: '13800138011', registrationTime: '2023-01-12 12:00:00' },
  { id: 13, name: "姓名13", nickName: '昵称13', phone: '13800138012', registrationTime: '2023-01-13 12:00:00' },
  { id: 14, name: "姓名14", nickName: '昵称14', phone: '13800138013', registrationTime: '2023-01-14 12:00:00' },
  { id: 15, name: "姓名15", nickName: '昵称15', phone: '13800138014', registrationTime: '2023-01-15 12:00:00' },
  { id: 16, name: "姓名16", nickName: '昵称16', phone: '13800138015', registrationTime: '2023-01-16 12:00:00' },
  { id: 17, name: "姓名17", nickName: '昵称17', phone: '13800138016', registrationTime: '2023-01-17 12:00:00' },
  { id: 18, name: "姓名18", nickName: '昵称18', phone: '13800138017', registrationTime: '2023-01-18 12:00:00' },
  { id: 19, name: "姓名19", nickName: '昵称19', phone: '13800138018', registrationTime: '2023-01-19 12:00:00' },
  { id: 20, name: "姓名20", nickName: '昵称20', phone: '13800138019', registrationTime: '2023-01-20 12:00:00' },
  { id: 21, name: "姓名21", nickName: '昵称21', phone: '13800138020', registrationTime: '2023-01-21 12:00:00' },
  { id: 22, name: "姓名22", nickName: '昵称22', phone: '13800138021', registrationTime: '2023-01-22 12:00:00' },
];

const manageStaff = defineAsyncComponent(() => import('./components/manageStaff.vue'));

const name = ref<string>('');
const phone = ref<string>('');
const page: Ref<IPage> = ref({
  total: 0,
  current: 1,
  pageSize: 10,
});
const data: Ref<IStaff[]> = ref([]);
const selectedStaffId = ref(0);
const visible = ref(false);
const isEdit = ref(false);
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
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: 120,
    fixed: 'left',
  },
  {
    title: '昵称',
    dataIndex: 'nickName',
    key: 'nickName',
    width: 120,
  },
  {
    title: '手机号码',
    dataIndex: 'phone',
    key: 'phone',
    width: 150,
  },
  {
    title: '注册时间',
    dataIndex: 'registrationTime',
    key: 'registrationTime',
    width: 170,
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
  selectedStaffId.value = 0;
  setTimeout(() => {
    page.value.total = result.length;

    const startIndex = (page.value.current - 1) * page.value.pageSize;
    const endIndex = startIndex + page.value.pageSize;
    data.value = result.filter((_, index) => index >= startIndex && index < endIndex);
    searchLoading.value = false;
    resetLoading.value = false;
    tableLoading.value = false;
  }, 2000);
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

const onEdit = (row: IStaff): void => {
  isEdit.value = true;
  visible.value = true;
  selectedStaffId.value = row.id;
};
const onAdd = (): void => {
  isEdit.value = false;
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
