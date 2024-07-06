<!-- 他店代注 -->
<template>
  <div>
    <a-form :model="searchForm" @submit="handleSearch" layout="inline" class="form">
      <a-form-item label="店铺名称">
        <a-input v-model="searchForm.storeName" allowClear placeholder="请输入店铺名称" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">搜索</a-button>
        <a-button html-type="reset" @click="handleReset" class="reset-btn">重置</a-button>
      </a-form-item>
    </a-form>
    <a-button type="primary" class="add-btn">
      <template #icon>
        <PlusOutlined />
      </template>
      添加
    </a-button>
    <a-table :columns="columns" :dataSource="data" :pagination="false" size="small" :scroll="{ y: 400 }" rowKey="index">
      <template #index="{ index }">
        {{ index + 1 }}
      </template>
    </a-table>
    <a-pagination v-model:current="current1" :pageSizeOptions="[10, 20, 30, 40, 50]" show-quick-jumper :total="500"
      :show-total="total => `共 ${total} 条`" size="small" class="pagination" @change="onChange" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';

interface Store {
  index: number;
  storeName: string;
  phone: string;
  registrationTime: string;
  status: string;
}

const searchForm = reactive({
  storeName: '',
});

const current1 = ref<number>(1);

const data: Store[] = [
  { index: 1, storeName: '店铺1', phone: '13800138000', registrationTime: '2023-01-01', status: '正常' },
  { index: 2, storeName: '店铺2', phone: '13800138001', registrationTime: '2023-01-02', status: '正常' },
  { index: 3, storeName: '店铺3', phone: '13800138002', registrationTime: '2023-01-03', status: '暂停' },
  { index: 4, storeName: '店铺4', phone: '13800138003', registrationTime: '2023-01-04', status: '正常' },
  { index: 5, storeName: '店铺5', phone: '13800138004', registrationTime: '2023-01-05', status: '注销' },
  { index: 6, storeName: '店铺6', phone: '13800138005', registrationTime: '2023-01-06', status: '正常' },
  { index: 7, storeName: '店铺7', phone: '13800138006', registrationTime: '2023-01-07', status: '暂停' },
  { index: 8, storeName: '店铺8', phone: '13800138007', registrationTime: '2023-01-08', status: '正常' },
  { index: 9, storeName: '店铺9', phone: '13800138008', registrationTime: '2023-01-09', status: '正常' },
  { index: 10, storeName: '店铺10', phone: '13800138009', registrationTime: '2023-01-10', status: '注销' },
  { index: 11, storeName: '店铺11', phone: '13800138010', registrationTime: '2023-01-11', status: '正常' },
  { index: 12, storeName: '店铺12', phone: '13800138011', registrationTime: '2023-01-12', status: '暂停' },
  { index: 13, storeName: '店铺13', phone: '13800138012', registrationTime: '2023-01-13', status: '正常' },
  { index: 14, storeName: '店铺14', phone: '13800138013', registrationTime: '2023-01-14', status: '正常' },
  { index: 15, storeName: '店铺15', phone: '13800138014', registrationTime: '2023-01-15', status: '注销' },
  { index: 16, storeName: '店铺16', phone: '13800138015', registrationTime: '2023-01-16', status: '正常' },
  { index: 17, storeName: '店铺17', phone: '13800138016', registrationTime: '2023-01-17', status: '暂停' },
  { index: 18, storeName: '店铺18', phone: '13800138017', registrationTime: '2023-01-18', status: '正常' },
  { index: 19, storeName: '店铺19', phone: '13800138018', registrationTime: '2023-01-19', status: '正常' },
  { index: 20, storeName: '店铺20', phone: '13800138019', registrationTime: '2023-01-20', status: '注销' },
  { index: 21, storeName: '店铺21', phone: '13800138020', registrationTime: '2023-01-21', status: '正常' },
  { index: 22, storeName: '店铺22', phone: '13800138021', registrationTime: '2023-01-22', status: '暂停' },
];

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: '店铺名称',
    dataIndex: 'storeName',
    key: 'storeName',
  },
  {
    title: '手机',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: '注册时间',
    dataIndex: 'registrationTime',
    key: 'registrationTime',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
  },
];

const handleSearch = () => {
  // 模拟搜索操作，实际应从API获取数据  
  console.log('Searching with:', searchForm);
};

const handleReset = () => {
  // 重置表单和表格数据  
  searchForm.storeName = '';
  // 假设重新从API获取数据  
  console.log('Resetting...');
};

const onChange = (page: number, pageSize: number) => {
  console.log('page: ', page);
  console.log('pageSize: ', pageSize);
};
</script>

<style lang="scss" scoped>
.form {
  margin-bottom: 16px;
}

.pagination {
  margin-top: 16px;
  text-align: right;
}

.reset-btn {
  margin-left: 16px;
}

.add-btn {
  margin-bottom: 16px;
}
</style>
