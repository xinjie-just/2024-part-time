<!-- 添加 PK 手 -->
<template>
  <a-modal v-model:open="visible" :mask-closable="false" :keyboard="false" :width="800" title="添加 PK 手"
    :body-style="{ paddingTop: '32px', paddingBottom: '8px' }" @cancel="onCancel">
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
    <a-table :columns="columns" :data-source="data"
      :row-selection="{ selectedRowKeys: selectedIds, onChange: onSelectChange }" :pagination="false" size="small"
      :scroll="{ x: 600, y: 400 }" :loading="tableLoading" row-key="id">
      <template #bodyCell="{ column, _, index }">
        <template v-if="column.key === 'index'">
          {{ page.pageSize * (page.current - 1) + index + 1 }}
        </template>
      </template>
    </a-table>
    <a-pagination v-if="page.total" v-model:current="page.current" v-model:pageSize="page.pageSize"
      :page-size-options="['10', '20', '30', '40', '50']" show-size-changer show-quick-jumper :total="page.total"
      :show-total="(total: number) => `共 ${total} 条`" size="small" :disabled="tableLoading" class="pagination"
      @change="onChange" />
    <template #footer>
      <a-button key="back" :disabled="loading" @click="onCancel">取消</a-button>
      <a-button key="submit" type="primary" :loading="loading" :disabled="!selectedIds.length"
        @click="onSubmit">提交</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { IPage, IPKHandle } from '@/models';
import { getToDoSelectPlayerList, savePKPlayer } from '@/services';
import { message } from 'ant-design-vue';
import { ref, onMounted, Ref } from 'vue';

const emits = defineEmits(['cancel', 'confirm']);

const name = ref<string>('');
const phone = ref<string>('');
const visible = ref(true);
const loading = ref(false);
const searchLoading = ref(false);
const resetLoading = ref(false);
const tableLoading = ref(false);
const page: Ref<IPage> = ref({
  total: 0,
  current: 1,
  pageSize: 10
});
const data: Ref<IPKHandle[]> = ref([]);
const selectedIds: Ref<number[]> = ref([]);

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 60,
    fixed: 'left'
  },
  {
    title: 'PK 手名称',
    dataIndex: 'name',
    key: 'name',
    width: 220,
    fixed: 'left'
  },
  {
    title: '手机号码',
    dataIndex: 'phone',
    key: 'phone',
    width: 120
  },
  {
    title: '胜率（%）',
    dataIndex: 'winningPercentage',
    key: 'winningPercentage',
    width: 100,
    sorter: (a: IPKHandle, b: IPKHandle) => a.winningPercentage - b.winningPercentage
  },
  {
    title: '积分',
    dataIndex: 'points',
    key: 'points',
    width: 100,
    sorter: (a: IPKHandle, b: IPKHandle) => a.points - b.points
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
  getToDoSelectPlayerList(params)
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

const onSelectChange = (selectedRowKeys: number[]) => {
  selectedIds.value = selectedRowKeys;
};

const onSubmit = async (): Promise<void> => {
  loading.value = true;
  try {
    // 这里可以添加提交表单的逻辑
    const params = {
      ids: selectedIds.value
    };
    savePKPlayer(params).then(() => {
      loading.value = false;
      message.success('PK 手添加成功');
      emits('confirm');
    })
  } catch (error) {
    console.log('表单验证失败', error);
    loading.value = false;
  }
};

const onCancel = (): void => {
  emits('cancel');
};
</script>
