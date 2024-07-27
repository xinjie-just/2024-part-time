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
                <a-button type="primary" html-type="submit" :loading="searchLoading"
                    :disabled="resetLoading || tableLoading" @click="onSearch">搜索</a-button>
                <a-button html-type="reset" :loading="resetLoading" :disabled="searchLoading || tableLoading"
                    @click="onReset" class="reset-btn">重置</a-button>
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
            :show-total="total => `共 ${total} 条`" size="small" :disabled="tableLoading" class="pagination"
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
    pageSize: 10,
});
const data: Ref<IPKHandle[]> = ref([]);
const selectedIds: Ref<number[]> = ref([]);
const result = [
    { id: 1, name: "PK 手名称1", nickName: '昵称1', phone: '13800138000', winningPercentage: 12, points: 500 },
    { id: 2, name: "PK 手名称2", nickName: '昵称2', phone: '13800138001', winningPercentage: 22, points: 600 },
    { id: 3, name: "PK 手名称3", nickName: '昵称3', phone: '13800138002', winningPercentage: 12, points: 700 },
    { id: 4, name: "PK 手名称4", nickName: '昵称4', phone: '13800138003', winningPercentage: 32, points: 800 },
    { id: 5, name: "PK 手名称5", nickName: '昵称5', phone: '13800138004', winningPercentage: 12, points: 900 },
    { id: 6, name: "PK 手名称6", nickName: '昵称6', phone: '13800138005', winningPercentage: 12, points: 1000 },
    { id: 7, name: "PK 手名称7", nickName: '昵称7', phone: '13800138006', winningPercentage: 12, points: 1100 },
    { id: 8, name: "PK 手名称8", nickName: '昵称8', phone: '13800138007', winningPercentage: 12, points: 1200 },
    { id: 9, name: "PK 手名称9", nickName: '昵称9', phone: '13800138008', winningPercentage: 12, points: 1300 },
    { id: 10, name: "PK 手名称10", nickName: '昵称10', phone: '13800138009', winningPercentage: 42, points: 1400 },
    { id: 11, name: "PK 手名称11", nickName: '昵称11', phone: '13800138010', winningPercentage: 12, points: 1500 },
    { id: 12, name: "PK 手名称12", nickName: '昵称12', phone: '13800138011', winningPercentage: 52, points: 500 },
    { id: 13, name: "PK 手名称13", nickName: '昵称13', phone: '13800138012', winningPercentage: 12, points: 400 },
    { id: 14, name: "PK 手名称14", nickName: '昵称14', phone: '13800138013', winningPercentage: 32, points: 500 },
    { id: 15, name: "PK 手名称15", nickName: '昵称15', phone: '13800138014', winningPercentage: 17, points: 600 },
    { id: 16, name: "PK 手名称16", nickName: '昵称16', phone: '13800138015', winningPercentage: 12, points: 500 },
    { id: 17, name: "PK 手名称17", nickName: '昵称17', phone: '13800138016', winningPercentage: 19, points: 300 },
    { id: 18, name: "PK 手名称18", nickName: '昵称18', phone: '13800138017', winningPercentage: 12, points: 200 },
    { id: 19, name: "PK 手名称19", nickName: '昵称19', phone: '13800138018', winningPercentage: 12, points: 100 },
    { id: 20, name: "PK 手名称20", nickName: '昵称20', phone: '13800138019', winningPercentage: 13, points: 500 },
    { id: 21, name: "PK 手名称21", nickName: '昵称21', phone: '13800138020', winningPercentage: 12, points: 50 },
    { id: 22, name: "PK 手名称22", nickName: '昵称22', phone: '13800138021', winningPercentage: 62, points: 550 },
];

const columns = [
    {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: 60,
        fixed: 'left',
    },
    {
        title: 'PK 手名称',
        dataIndex: 'name',
        key: 'name',
        width: 220,
        fixed: 'left',
    },
    {
        title: '手机号码',
        dataIndex: 'phone',
        key: 'phone',
        width: 120,
    },
    {
        title: '胜率（%）',
        dataIndex: 'winningPercentage',
        key: 'winningPercentage',
        width: 100,
        sorter: (a: IPKHandle, b: IPKHandle) => a.winningPercentage - b.winningPercentage,
    },
    {
        title: '积分',
        dataIndex: 'points',
        key: 'points',
        width: 100,
        sorter: (a: IPKHandle, b: IPKHandle) => a.points - b.points,
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

const onSelectChange = (selectedRowKeys: number[]) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    selectedIds.value = selectedRowKeys;
};

const onSubmit = async (): Promise<void> => {
    loading.value = true;
    try {
        // 这里可以添加提交表单的逻辑
        setTimeout(() => {
            loading.value = false;
            message.success('PK 手添加成功');
            emits('confirm');
        }, 1000);
    } catch (error) {
        console.log('表单验证失败', error);
        loading.value = false;
    }
};

const onCancel = (): void => {
    emits('cancel');
};
</script>
