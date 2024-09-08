<!-- 员工管理 -->
<template>
  <div class="search">
    <div class="search-item">
      <label class="label" for="name">姓名：</label>
      <a-input v-model:value.trim="name" id="name" allow-clear placeholder="请输入姓名" class="input"
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
        <a-popconfirm placement="topRight" :title="`确认删除员工 ${record.name} 吗？`" ok-text="确定"
          :ok-button-props="{ type: 'default', danger: true }" cancel-text="取消" @confirm="onConfirmDelete(record.id)"
          @cancel="onCancelDelete">
          <a-button type="link">删除</a-button>
        </a-popconfirm>
        <a-divider type="vertical" />
        <a-button type="link" @click="onEdit(record)">编辑</a-button>
      </template>
    </template>
  </a-table>
  <a-pagination v-if="page.total" v-model:current="page.current" v-model:pageSize="page.pageSize"
    :page-size-options="['10', '20', '30', '40', '50']" show-size-changer show-quick-jumper :total="page.total"
    :show-total="(total) => `共 ${total} 条`" size="small" :disabled="tableLoading" class="pagination"
    @change="onChange" />

  <manage-staff v-if="visible" :is-edit="isEdit" :staff-id="selectedStaffId" @cancel="onCancel" @confirm="onConfirm" />
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted, Ref, ref } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { IStaff, IPage } from '@/models';
import { message } from 'ant-design-vue';
import { deleteStaff, getStaffList } from '@/services';
import { formatTime } from '@/utils';

const manageStaff = defineAsyncComponent(() => import('./components/manageStaff.vue'));

const name = ref<string>('');
const phone = ref<string>('');
const page: Ref<IPage> = ref({
  total: 0,
  current: 1,
  pageSize: 10
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
    width: 70,
    fixed: 'left'
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: 140,
    fixed: 'left'
  },
  {
    title: '昵称',
    dataIndex: 'nickName',
    key: 'nickName',
    width: 140
  },
  {
    title: '手机号码',
    dataIndex: 'phone',
    key: 'phone',
    width: 130
  },
  {
    title: '注册时间',
    dataIndex: 'registrationTime',
    key: 'registrationTime',
    width: 160
  },
  {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    width: 130,
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
  selectedStaffId.value = 0;

  const params = {
    name: name.value.trim(),
    phone: phone.value.trim(),
    page: page.value.current,
    pageSize: page.value.pageSize
  };
  getStaffList(params)
    .then(res => {
      const result = res.data;
      page.value.total = result.totalNum;

      data.value = result.list.map(item => {
        return {
          id: item.id,
          name: item.name || '--',
          nickName: item.nick || '--',
          phone: item.phone || '--',
          registrationTime: formatTime(item.registerTime)
        }
      })
    })
    .finally(() => {
      searchLoading.value = false;
      resetLoading.value = false;
      tableLoading.value = false;
    })
};

const onConfirmDelete = (id: number): void => {
  deleteStaff({ id })
    .then(() => {
      message.success('删除成功');
      page.value.current = 1;
      getList();
    })
};
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
