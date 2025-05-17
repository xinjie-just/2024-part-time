<!-- 代营店铺 -->
<template>
  <a-form ref="formRef" layout="inline" autocomplete="off" :model="formState" class="search">
    <a-form-item html-for="storeName" label="店铺名称" name="storeName" class="search-item">
      <a-input v-model:value.trim="formState.storeName" id="storeName" allow-clear placeholder="请输入店铺名称" class="input"
        @pressEnter="onSearch" />
    </a-form-item>
    <a-form-item class="search-item">
      <a-button type="primary" html-type="submit" :loading="searchLoading" :disabled="resetLoading || tableLoading"
        @click="onSearch">搜索</a-button>
      <a-button html-type="reset" :loading="resetLoading" :disabled="searchLoading || tableLoading" @click="onReset"
        class="reset-btn">重置</a-button>
    </a-form-item>
  </a-form>
  <a-button type="primary" class="add-btn" :disabled="tableLoading" @click="onAdd">
    <template #icon>
      <PlusOutlined />
    </template>
    添加
  </a-button>
  <a-table :columns="columns" :data-source="data" :pagination="false" size="small" :scroll="{ x: 1000, y: 360 }"
    :loading="tableLoading" row-key="id">
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.dataIndex === 'index'">
        {{ page.pageSize * (page.current - 1) + index + 1 }}
      </template>
      <template v-if="column.dataIndex === 'property'">
        <a-tag v-if="+record.property === 1" color="warning">自营店</a-tag>
        <a-tag v-if="+record.property === 2" color="processing">代营店</a-tag>
      </template>
      <template v-if="column.dataIndex === 'state'">
        <a-tag v-if="+record.state === 0" color="warning">
          <LockOutlined />
          已锁定
        </a-tag>
        <a-tag v-if="+record.state === 1" color="processing">
          <UnlockOutlined />
          未锁定
        </a-tag>
      </template>
      <template v-else-if="column.dataIndex === 'action'">
        <template v-if="record.state === 0">
          <a-button type="link" @click="onConfirmUnLock(record.id)">解锁</a-button>
        </template>
        <a-popconfirm placement="topRight" v-else :title="`锁定后将无法登录，确认锁定店铺 ${record.storeName} 吗？`" ok-text="确定"
          :ok-button-props="{ type: 'default', danger: true }" cancel-text="取消" @confirm="onConfirmLock(record.id)"
          @cancel="onCancelLock">
          <a-button type="link">锁定</a-button>
        </a-popconfirm>
      </template>
    </template>
  </a-table>
  <a-pagination v-if="page.total" v-model:current="page.current" v-model:pageSize="page.pageSize"
    :page-size-options="['10', '20', '30', '40', '50']" show-size-changer show-quick-jumper :total="page.total"
    :show-total="(total: number) => `共 ${total} 条`" size="small" :disabled="tableLoading" class="pagination"
    @change="onChange" />

  <add-shop v-if="visible" @cancel="onCancel" @confirm="onConfirm" />
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted, reactive, Ref, ref } from 'vue';
import { PlusOutlined, UnlockOutlined, LockOutlined } from '@ant-design/icons-vue';
import { IPage, IStore } from '@/models';
import { message } from 'ant-design-vue';
import { getAgentShopList, lockUnLockShop } from '@/services';
import { formatTime } from '@/utils';

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
    width: 80,
    fixed: 'left'
  },
  {
    title: '店铺名称',
    dataIndex: 'storeName',
    width: 380,
    ellipsis: true,
    fixed: 'left'
  },
  {
    title: '手机号码',
    dataIndex: 'phone',
    width: 140
  },
  {
    title: '注册时间',
    dataIndex: 'registrationTime',
    width: 160
  },
  {
    title: '店铺性质',
    dataIndex: 'property',
    width: 90
  },
  {
    title: '店铺状态',
    dataIndex: 'state',
    width: 110
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 110,
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
  formRef.value.resetFields();
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
  const values = formRef.value?.getFieldsValue();
  const params = {
    name: values.storeName.trim(),
    page: page.value.current,
    pageSize: page.value.pageSize
  };
  tableLoading.value = true;
  getAgentShopList(params)
    .then((res) => {
      const result = res.data;
      page.value.total = result.totalNum;
      data.value = result.list.map(item => {
        return {
          id: item.id,
          storeName: item.name,
          phone: item.phone,
          registrationTime: formatTime(item.registerTime),
          property: item.type,
          state: item.state
        }
      });
    })
    .finally(() => {
      searchLoading.value = false;
      resetLoading.value = false;
      tableLoading.value = false;
    })
};

const onConfirmLock = (id: number): void => {
  const params = {
    id,
    state: 0
  }
  lockUnLockShop(params).then(() => {
    message.success('锁定成功');
    page.value.current = 1;
    getList();
  })
};
const onCancelLock = (): void => {
  message.success('您取消了锁定');
};

const onConfirmUnLock = (id: number): void => {
  const params = {
    id,
    state: 1
  }
  lockUnLockShop(params).then(() => {
    message.success('解锁成功');
    page.value.current = 1;
    getList();
  })
};
</script>

<style lang="scss" scoped>
.add-btn {
  margin-bottom: 16px;
}
</style>
