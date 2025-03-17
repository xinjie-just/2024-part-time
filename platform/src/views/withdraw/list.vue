<!-- 提现管理 -->
<template>
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
        {{ index + 1 }}
      </template>
      <template v-else-if="column.key === 'action'">
        <a-popconfirm placement="topRight" :title="`确认删除该配置吗？`" ok-text="确定"
          :ok-button-props="{ type: 'default', danger: true }" cancel-text="取消" @confirm="onConfirmDelete(record.id)"
          @cancel="onCancelDelete">
          <a-button type="link">删除</a-button>
        </a-popconfirm>
      </template>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { deleteConfig, getConfigList } from '@/services';
import { IGetConfigListRes } from '@/services/models';

const data: Ref<IGetConfigListRes[]> = ref([]);
const visible = ref(false);
const isEdit = ref(false);
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
    title: '数据分类',
    dataIndex: 'type',
    width: 140,
    fixed: 'left'
  },
  {
    title: '数据名称',
    dataIndex: 'name',
    width: 140
  },
  {
    title: '数据值',
    dataIndex: 'value',
    width: 130
  },
  {
    title: '数据排序',
    dataIndex: 'sort',
    width: 160
  },
  {
    title: '数据备注',
    dataIndex: 'remark',
    width: 200
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: 130,
    fixed: 'right'
  }
];

onMounted(() => {
  getList();
});

const getList = (): void => {
  tableLoading.value = true;

  getConfigList()
    .then(res => {
      const result = res.data;
      data.value = result;
    })
    .finally(() => {
      tableLoading.value = false;
    })
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
</script>

<style lang="scss" scoped>
.add-btn {
  margin-bottom: 16px;
}
</style>
