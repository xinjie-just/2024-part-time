<!-- 代营店铺 -->
<template>
  <a-form ref="formRef" layout="inline" autocomplete="off" :model="formState" class="search">
    <a-form-item html-for="storeName" label="店铺名称" name="storeName" class="search-item">
      <a-input
        v-model:value.trim="formState.storeName"
        id="storeName"
        allow-clear
        placeholder="请输入店铺名称"
        class="input"
        @pressEnter="onSearch"
      />
    </a-form-item>
    <a-form-item class="search-item">
      <a-button
        type="primary"
        html-type="submit"
        :loading="searchLoading"
        :disabled="resetLoading || tableLoading"
        @click="onSearch"
        >搜索</a-button
      >
      <a-button
        html-type="reset"
        :loading="resetLoading"
        :disabled="searchLoading || tableLoading"
        @click="onReset"
        class="reset-btn"
        >重置</a-button
      >
    </a-form-item>
  </a-form>
  <a-button type="primary" class="add-btn" @click="onAdd">
    <template #icon>
      <PlusOutlined />
    </template>
    添加
  </a-button>
  <a-table
    :columns="columns"
    :data-source="data"
    :pagination="false"
    size="small"
    :scroll="{ x: 1000, y: 400 }"
    :loading="tableLoading"
    row-key="id"
  >
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'index'">
        {{ page.pageSize * (page.current - 1) + index + 1 }}
      </template>
      <template v-if="column.key === 'property'">
        <a-tag color="blue">{{ record.property }}</a-tag>
      </template>
      <template v-if="column.key === 'status'">
        <a-tag v-if="record.status === 1" color="warning">
          <LockOutlined />
          已锁定
        </a-tag>
        <a-tag v-if="record.status === 0" color="processing">
          <UnlockOutlined />
          未锁定
        </a-tag>
      </template>
      <template v-else-if="column.key === 'action'">
        <a-popconfirm
          placement="topRight"
          :title="`确认删除店铺 ${record.storeName} 吗？`"
          ok-text="确定"
          :ok-button-props="{ type: 'default', danger: true }"
          cancel-text="取消"
          @confirm="onConfirmDelete(record.id)"
          @cancel="onCancelDelete"
        >
          <a-button type="link">删除</a-button>
        </a-popconfirm>
        <a-divider type="vertical" />
        <template v-if="record.status === 1">
          <a-button type="link" @click="onConfirmUnLock(record.id)">解锁</a-button>
        </template>
        <a-popconfirm
          placement="topRight"
          v-else
          :title="`锁定后将无法登录，确认锁定店铺 ${record.storeName} 吗？`"
          ok-text="确定"
          :ok-button-props="{ type: 'default', danger: true }"
          cancel-text="取消"
          @confirm="onConfirmLock(record.id)"
          @cancel="onCancelLock"
        >
          <a-button type="link">锁定</a-button>
        </a-popconfirm>
      </template>
    </template>
  </a-table>
  <a-pagination
    v-if="page.total"
    v-model:current="page.current"
    v-model:pageSize="page.pageSize"
    :page-size-options="['10', '20', '30', '40', '50']"
    show-size-changer
    show-quick-jumper
    :total="page.total"
    :show-total="(total) => `共 ${total} 条`"
    size="small"
    :disabled="tableLoading"
    class="pagination"
    @change="onChange"
  />

  <add-shop v-if="visible" @cancel="onCancel" @confirm="onConfirm" />
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted, reactive, Ref, ref } from 'vue';
import { PlusOutlined, UnlockOutlined, LockOutlined } from '@ant-design/icons-vue';
import { IPage, IStore } from '@/models';
import { message } from 'ant-design-vue';
const result = [
  {
    id: 1,
    storeName: '店铺1',
    phone: '13800138000',
    registrationTime: '2023-01-01 12:00:00',
    property: '代营',
    status: 0
  },
  {
    id: 2,
    storeName: '店铺2',
    phone: '13800138001',
    registrationTime: '2023-01-02 12:00:00',
    property: '代营',
    status: 0
  },
  {
    id: 3,
    storeName: '店铺3',
    phone: '13800138002',
    registrationTime: '2023-01-03 12:00:00',
    property: '代营',
    status: 1
  },
  {
    id: 4,
    storeName: '店铺4',
    phone: '13800138003',
    registrationTime: '2023-01-04 12:00:00',
    property: '代营',
    status: 0
  },
  {
    id: 5,
    storeName: '店铺5',
    phone: '13800138004',
    registrationTime: '2023-01-05 12:00:00',
    property: '代营',
    status: 1
  },
  {
    id: 6,
    storeName: '店铺6',
    phone: '13800138005',
    registrationTime: '2023-01-06 12:00:00',
    property: '代营',
    status: 1
  },
  {
    id: 7,
    storeName: '店铺7',
    phone: '13800138006',
    registrationTime: '2023-01-07 12:00:00',
    property: '代营',
    status: 1
  },
  {
    id: 8,
    storeName: '店铺8',
    phone: '13800138007',
    registrationTime: '2023-01-08 12:00:00',
    property: '代营',
    status: 1
  },
  {
    id: 9,
    storeName: '店铺9',
    phone: '13800138008',
    registrationTime: '2023-01-09 12:00:00',
    property: '代营',
    status: 0
  },
  {
    id: 10,
    storeName: '店铺10',
    phone: '13800138009',
    registrationTime: '2023-01-10 12:00:00',
    property: '代营',
    status: 1
  },
  {
    id: 11,
    storeName: '店铺11',
    phone: '13800138010',
    registrationTime: '2023-01-11 12:00:00',
    property: '代营',
    status: 1
  },
  {
    id: 12,
    storeName: '店铺12',
    phone: '13800138011',
    registrationTime: '2023-01-12 12:00:00',
    property: '代营',
    status: 1
  },
  {
    id: 13,
    storeName: '店铺13',
    phone: '13800138012',
    registrationTime: '2023-01-13 12:00:00',
    property: '代营',
    status: 1
  },
  {
    id: 14,
    storeName: '店铺14',
    phone: '13800138013',
    registrationTime: '2023-01-14 12:00:00',
    property: '代营',
    status: 0
  },
  {
    id: 15,
    storeName: '店铺15',
    phone: '13800138014',
    registrationTime: '2023-01-15 12:00:00',
    property: '代营',
    status: 0
  },
  {
    id: 16,
    storeName: '店铺16',
    phone: '13800138015',
    registrationTime: '2023-01-16 12:00:00',
    property: '代营',
    status: 1
  },
  {
    id: 17,
    storeName: '店铺17',
    phone: '13800138016',
    registrationTime: '2023-01-17 12:00:00',
    property: '代营',
    status: 1
  },
  {
    id: 18,
    storeName: '店铺18',
    phone: '13800138017',
    registrationTime: '2023-01-18 12:00:00',
    property: '代营',
    status: 0
  },
  {
    id: 19,
    storeName: '店铺19',
    phone: '13800138018',
    registrationTime: '2023-01-19 12:00:00',
    property: '代营',
    status: 0
  },
  {
    id: 20,
    storeName: '店铺20',
    phone: '13800138019',
    registrationTime: '2023-01-20 12:00:00',
    property: '代营',
    status: 1
  },
  {
    id: 21,
    storeName: '店铺21',
    phone: '13800138020',
    registrationTime: '2023-01-21 12:00:00',
    property: '代营',
    status: 1
  },
  {
    id: 22,
    storeName: '店铺22',
    phone: '13800138021',
    registrationTime: '2023-01-22 12:00:00',
    property: '代营',
    status: 0
  }
];

const addShop = defineAsyncComponent(() => import('./components/addShop.vue'));

interface FormState {
  storeName: string;
}
const formState = reactive<FormState>({
  storeName: ''
});
const formRef = ref();

const page: Ref<IPage> = ref({
  total: 0,
  current: 1,
  pageSize: 10
});
const data: Ref<IStore[]> = ref([]);
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
    title: '店铺名称',
    dataIndex: 'storeName',
    key: 'storeName',
    width: 380,
    ellipsis: true,
    fixed: 'left'
  },
  {
    title: '手机号码',
    dataIndex: 'phone',
    key: 'phone',
    width: 140
  },
  {
    title: '注册时间',
    dataIndex: 'registrationTime',
    key: 'registrationTime',
    width: 160
  },
  {
    title: '店铺性质',
    dataIndex: 'property',
    key: 'property',
    width: 90
  },
  {
    title: '店铺状态',
    dataIndex: 'status',
    key: 'status',
    width: 110
  },
  {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    width: 160,
    fixed: 'right'
  }
];

onMounted(() => {
  onSearch();
});

const onSearch = (): void => {
  // 模拟搜索操作，实际应从API获取数据
  const values = formRef.value?.getFieldsValue();
  console.log('values', values);
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
  formRef.value.resetFields();
  const values = formRef.value?.getFieldsValue();
  console.log('values', values);
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
};
const onCancelDelete = (): void => {
  message.info('您取消了删除');
};

const onConfirmLock = (id: number): void => {
  // 模拟锁定操作，实际应从API锁定数据
  console.log('Lock--id', id);
  message.success('锁定成功');
  page.value.current = 1;
  getList();
};
const onCancelLock = (): void => {
  message.success('您取消了锁定');
};

const onConfirmUnLock = (id: number): void => {
  // 模拟解锁操作，实际应从API解锁数据
  console.log('UnLock--id', id);
  message.success('解锁成功');
  page.value.current = 1;
  getList();
};
</script>

<style lang="scss" scoped>
.add-btn {
  margin-bottom: 16px;
}
</style>
