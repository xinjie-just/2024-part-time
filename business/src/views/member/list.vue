<!-- 会员管理 -->
<template>
  <div class="search">
    <div class="search-item">
      <label for="name">姓名：</label>
      <a-input v-model:value="name" id="name" allowClear placeholder="请输入姓名" class="input" @pressEnter="onSearch" />
    </div>
    <div class="search-item">
      <label for="phone">手机号码：</label>
      <a-input v-model:value="phone" id="phone" allowClear placeholder="请输入手机号码" class="input" @pressEnter="onSearch" />
    </div>
    <div class="search-item">
      <a-button type="primary" html-type="submit" :loading="searchLoading" :disabled="resetLoading || tableLoading"
        @click="onSearch">搜索</a-button>
      <a-button html-type="reset" :loading="resetLoading" :disabled="searchLoading || tableLoading" @click="onReset"
        class="reset-btn">重置</a-button>
    </div>
  </div>
  <a-button type="primary" class="send-btn" :disabled="selectedMemberId === 0" @click="onSend">
    <template #icon>
      <SendOutlined />
    </template>
    发送信息
  </a-button>
  <a-table :columns="columns" :dataSource="data" :row-selection="rowSelection" :pagination="false" size="small"
    :scroll="{ x: 1000, y: 400 }" :loading="tableLoading" :row-key="'id'">
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'index'">
        {{ page.pageSize * (page.current - 1) + index + 1 }}
      </template>
      <template v-if="column.key === 'avatar'">
        <img :src="record.avatar" alt="头像" class="member-list-avatar" />
      </template>
    </template>
  </a-table>
  <a-pagination v-if="page.total" v-model:current="page.current" v-model:pageSize="page.pageSize"
    :page-size-options="['10', '20', '30', '40', '50']" show-size-changer show-quick-jumper :total="page.total"
    :show-total="total => `共 ${total} 条`" size="small" :disabled="tableLoading" class="pagination" @change="onChange" />
</template>

<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue';
import { SendOutlined } from '@ant-design/icons-vue';
import { IMember, IPage } from '@/models';
const result = [
  { id: 1, nickName: '昵称1', avatar: 'https://via.placeholder.com/32X32', phone: '13800138000', registrationTime: '2023-01-01 12:00:00' },
  { id: 2, nickName: '昵称2', avatar: 'https://via.placeholder.com/32X32', phone: '13800138001', registrationTime: '2023-01-02 12:00:00' },
  { id: 3, nickName: '昵称3', avatar: 'https://via.placeholder.com/32X32', phone: '13800138002', registrationTime: '2023-01-03 12:00:00' },
  { id: 4, nickName: '昵称4', avatar: 'https://via.placeholder.com/32X32', phone: '13800138003', registrationTime: '2023-01-04 12:00:00' },
  { id: 5, nickName: '昵称5', avatar: 'https://via.placeholder.com/32X32', phone: '13800138004', registrationTime: '2023-01-05 12:00:00' },
  { id: 6, nickName: '昵称6', avatar: 'https://via.placeholder.com/32X32', phone: '13800138005', registrationTime: '2023-01-06 12:00:00' },
  { id: 7, nickName: '昵称7', avatar: 'https://via.placeholder.com/32X32', phone: '13800138006', registrationTime: '2023-01-07 12:00:00' },
  { id: 8, nickName: '昵称8', avatar: 'https://via.placeholder.com/32X32', phone: '13800138007', registrationTime: '2023-01-08 12:00:00' },
  { id: 9, nickName: '昵称9', avatar: 'https://via.placeholder.com/32X32', phone: '13800138008', registrationTime: '2023-01-09 12:00:00' },
  { id: 10, nickName: '昵称10', avatar: 'https://via.placeholder.com/32X32', phone: '13800138009', registrationTime: '2023-01-10 12:00:00' },
  { id: 11, nickName: '昵称11', avatar: 'https://via.placeholder.com/32X32', phone: '13800138010', registrationTime: '2023-01-11 12:00:00' },
  { id: 12, nickName: '昵称12', avatar: 'https://via.placeholder.com/32X32', phone: '13800138011', registrationTime: '2023-01-12 12:00:00' },
  { id: 13, nickName: '昵称13', avatar: 'https://via.placeholder.com/32X32', phone: '13800138012', registrationTime: '2023-01-13 12:00:00' },
  { id: 14, nickName: '昵称14', avatar: 'https://via.placeholder.com/32X32', phone: '13800138013', registrationTime: '2023-01-14 12:00:00' },
  { id: 15, nickName: '昵称15', avatar: 'https://via.placeholder.com/32X32', phone: '13800138014', registrationTime: '2023-01-15 12:00:00' },
  { id: 16, nickName: '昵称16', avatar: 'https://via.placeholder.com/32X32', phone: '13800138015', registrationTime: '2023-01-16 12:00:00' },
  { id: 17, nickName: '昵称17', avatar: 'https://via.placeholder.com/32X32', phone: '13800138016', registrationTime: '2023-01-17 12:00:00' },
  { id: 18, nickName: '昵称18', avatar: 'https://via.placeholder.com/32X32', phone: '13800138017', registrationTime: '2023-01-18 12:00:00' },
  { id: 19, nickName: '昵称19', avatar: 'https://via.placeholder.com/32X32', phone: '13800138018', registrationTime: '2023-01-19 12:00:00' },
  { id: 20, nickName: '昵称20', avatar: 'https://via.placeholder.com/32X32', phone: '13800138019', registrationTime: '2023-01-20 12:00:00' },
  { id: 21, nickName: '昵称21', avatar: 'https://via.placeholder.com/32X32', phone: '13800138020', registrationTime: '2023-01-21 12:00:00' },
  { id: 22, nickName: '昵称22', avatar: 'https://via.placeholder.com/32X32', phone: '13800138021', registrationTime: '2023-01-22 12:00:00' },
];

const name = ref<string>('');
const phone = ref<string>('');
const page: Ref<IPage> = ref({
  total: 0,
  current: 1,
  pageSize: 10,
});
const data: Ref<IMember[]> = ref([]);
const selectedMemberId = ref(0);
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
    title: '昵称',
    dataIndex: 'nickName',
    key: 'nickName',
    width: 120,
    fixed: 'left',
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    key: 'avatar',
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

const onSend = (): void => {
  visible.value = true;
}
const getList = (): void => {
  // 模拟获取列表操作，实际应从API获取数据
  tableLoading.value = true;
  selectedMemberId.value = 0;
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

const rowSelection = ref({
  type: 'radio',
  onChange: (selectedRowKey: (number), selectedRow: IMember) => {
    selectedMemberId.value = selectedRow.id;
    console.log('onChange---', `selectedRowKey: ${selectedRowKey}`, 'selectedRow: ', selectedRow);
  },
});
</script>

<style lang="scss">
.member-list-avatar {
  display: block;
  border-radius: 50%;
}
</style>

<style lang="scss" scoped>
.pagination {
  margin-top: 16px;
  text-align: right;
}

.send-btn {
  margin-bottom: 16px;
}

.search {
  display: flex;
  margin-bottom: 16px;

  .search-item {
    display: flex;
    align-items: center;

    &:not(:last-of-type) {
      margin-right: 24px;
    }
  }

  .input {
    width: 200px;
  }

  .reset-btn {
    margin-left: 16px;
  }
}
</style>
