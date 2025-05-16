<!-- 会员管理，商品信息带有商家信息，用户扫描商品，第一次登录时成为对应商品商家的会员 -->
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
  <a-button type="primary" class="send-btn" :disabled="!selectedIds.length" @click="onSend">
    <template #icon>
      <SendOutlined />
    </template>
    发送信息
  </a-button>
  <a-table :columns="columns" :data-source="data"
    :row-selection="{ selectedRowKeys: selectedIds, onChange: onSelectChange }" :pagination="false" size="small"
    :scroll="{ x: 1000, y: 360 }" :loading="tableLoading" row-key="id">
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.dataIndex === 'index'">
        {{ page.pageSize * (page.current - 1) + index + 1 }}
      </template>
      <template v-if="column.dataIndex === 'avatar'">
        <a-popover trigger="click">
          <template #title>
            <span class="popover-title"> {{ record.nickName }}</span>
          </template>
          <template #content>
            <img :src="record.avatar" alt="头像" title="点击查看" class="big-avatar" />
          </template>
          <img :src="record.avatar" alt="头像" title="点击查看" class="small-avatar" />
        </a-popover>
      </template>
    </template>
  </a-table>
  <a-pagination v-if="page.total" v-model:current="page.current" v-model:pageSize="page.pageSize"
    :page-size-options="['10', '20', '30', '40', '50']" show-size-changer show-quick-jumper :total="page.total"
    :show-total="(total: number) => `共 ${total} 条`" size="small" :disabled="tableLoading" class="pagination"
    @change="onChange" />

  <send-message v-if="visible" :selected-ids="selectedIds" @cancel="onCancel" @confirm="onConfirm" />
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted, Ref, ref } from 'vue';
import { SendOutlined } from '@ant-design/icons-vue';
import { IMember, IPage } from '@/models';
import { getMemberList } from '@/services';
import { formatTime } from '@/utils';

const sendMessage = defineAsyncComponent(() => import('./components/sendMessage.vue'));

const visible = ref(false);
const name = ref<string>('');
const phone = ref<string>('');
const page: Ref<IPage> = ref({
  total: 0,
  current: 1,
  pageSize: 10
});
const data: Ref<IMember[]> = ref([]);
const selectedIds: Ref<number[]> = ref([]);
const searchLoading = ref(false);
const resetLoading = ref(false);
const tableLoading = ref(false);

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    width: 70,
    fixed: 'left'
  },
  {
    title: '昵称',
    dataIndex: 'nickName',
    width: 140,
    fixed: 'left'
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    width: 120
  },
  {
    title: '手机号码',
    dataIndex: 'phone',
    width: 150
  },
  {
    title: '注册时间',
    dataIndex: 'registrationTime',
    width: 170
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

const onSend = (): void => {
  visible.value = true;
}

const onCancel = (): void => {
  visible.value = false;
};

const onConfirm = (): void => {
  visible.value = false;
  getList();
};

const getList = (): void => {
  tableLoading.value = true;
  selectedIds.value = [];
  const params = {
    name: name.value.trim(),
    phone: phone.value.trim(),
    page: page.value.current,
    pageSize: page.value.pageSize
  };
  getMemberList(params)
    .then((res) => {
      const result = res.data;
      page.value.total = result.totalNum;
      data.value = result.list.map(item => {
        return {
          id: item.id,
          nickName: item.name,
          avatar: item.headIcon,
          phone: item.phone,
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

const onSelectChange = (selectedRowKeys: number[]) => {
  selectedIds.value = selectedRowKeys;
};
</script>

<style lang="scss">
.small-avatar {
  display: block;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
}

.big-avatar {
  display: block;
  max-width: 192px;
  max-height: 192px;
  width: auto;
  height: auto;
  border-radius: 50%;
}
</style>

<style lang="scss" scoped>
.send-btn {
  margin-bottom: 16px;
}

.popover-title {
  display: block;
  text-align: center;
  margin: 8px auto;
  max-width: 192px; // 不大于二维码图片宽度
  word-break: break-all;
}
</style>
