<!-- 配置管理 -->
<template>
  <a-button type="primary" class="add-btn" @click="onAdd">
    <template #icon>
      <PlusOutlined />
    </template>
    添加
  </a-button>
  <a-table :columns="columns" :data-source="data" :pagination="false" size="small" :scroll="{ x: 1000, y: 430 }"
    :loading="tableLoading" row-key="id">
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.dataIndex === 'index'">
        {{ page.pageSize * (page.current - 1) + index + 1 }}
      </template>
      <template v-if="column.dataIndex === 'remark'">
        {{ record.remark || '--' }}
      </template>
      <template v-else-if="column.dataIndex === 'action'">
        <a-popconfirm placement="topRight" :title="`确认删除该配置吗？`" ok-text="确定"
          :ok-button-props="{ type: 'default', danger: true }" cancel-text="取消" @confirm="onConfirmDelete(record.id)"
          @cancel="onCancelDelete">
          <a-button type="link">删除</a-button>
        </a-popconfirm>
        <a-button type="link" @click="onEdit(record)">编辑</a-button>
      </template>
    </template>
  </a-table>
  <a-pagination v-if="page.total" v-model:current="page.current" v-model:pageSize="page.pageSize"
    :page-size-options="['10', '20', '30', '40', '50']" show-size-changer show-quick-jumper :total="page.total"
    :show-total="(total: number) => `共 ${total} 条`" size="small" :disabled="tableLoading" class="pagination"
    @change="onChange" />

  <manage-config v-if="visible" :is-edit="isEdit" :edit-info="selectedConfig" @cancel="onCancel" @confirm="onConfirm" />
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted, Ref, ref } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { deleteConfig, getConfigList } from '@/services';
import { IConfigListItem } from '@/services/models';
import { IPage } from '@/models';

const manageConfig = defineAsyncComponent(() => import('./components/manageConfig.vue'));

const page: Ref<IPage> = ref({
  total: 0,
  current: 1,
  pageSize: 10
});
const data: Ref<IConfigListItem[]> = ref([]);
const visible = ref(false);
const isEdit = ref(false);
const tableLoading = ref(false);
const selectedConfig: Ref<IConfigListItem> = ref({} as IConfigListItem);

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 60,
    fixed: 'left'
  },
  {
    title: '数据分类',
    dataIndex: 'type',
    width: 120,
    fixed: 'left'
  },
  {
    title: '数据名称',
    dataIndex: 'name',
    width: 120
  },
  {
    title: '数据值',
    dataIndex: 'value',
    width: 120
  },
  {
    title: '数据备注',
    dataIndex: 'remark',
    width: 240
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: 120,
    fixed: 'right'
  }
];

onMounted(() => {
  getList();
});

const getList = (): void => {
  tableLoading.value = true;
  const params = {
    page: page.value.current,
    pageSize: page.value.pageSize
  };
  getConfigList(params)
    .then(res => {
      const result = res.data;
      page.value.total = result.totalNum;
      data.value = result.list;
    })
    .finally(() => {
      tableLoading.value = false;
    })
};

const onChange = (current: number, pageSize: number): void => {
  page.value.current = current;
  page.value.pageSize = pageSize;
  getList();
};

const onConfirmDelete = (id: number): void => {
  deleteConfig({ id })
    .then(() => {
      message.success('删除成功');
      getList();
    })
};
const onCancelDelete = (): void => {
  message.info('您取消了删除');
};

const onAdd = (): void => {
  isEdit.value = false;
  visible.value = true;
};

const onEdit = (record: IConfigListItem): void => {
  isEdit.value = true;
  visible.value = true;
  selectedConfig.value = record;
};
const onCancel = (): void => {
  visible.value = false;
};

const onConfirm = (): void => {
  visible.value = false;
  getList();
};

</script>

<style lang="scss" scoped>
.add-btn {
  margin-bottom: 16px;
}
</style>
