<!-- 确认提现账户 -->
<template>
    <a-modal v-model:open="visible" title="提现确认" :body-style="{ paddingTop: '24px', paddingBottom: '24px' }"
        @cancel="onCancel">
        <a-alert message="请确认提现账户信息，提交后将不可修改" type="warning" show-icon />
        <template #footer>
            <a-button key="back" @click="onCancel">取消</a-button>
            <a-button key="submit" type="primary" :loading="loading" @click="onConfirm">提交</a-button>
        </template>
        <a-card title="账户信息" :bordered="false" class="account">
            <div class="account-item">
                <span class="key">开户银行：</span>
                <span class="value">中国工商银行</span>
            </div>
            <div class="account-item">
                <span class="key">账户姓名：</span>
                <span class="value">张三</span>
            </div>
            <div class="account-item">
                <span class="key">银行卡号：</span>
                <a-tooltip color="blue" title="1234567890123456789" placement="right" overlay-class-name="tips">
                    <span class="value">1234567890123456789</span>
                </a-tooltip>
            </div>
            <div class="account-item">
                <span class="key">提现金额：</span>
                <span class="value">100元</span>
            </div>
        </a-card>
    </a-modal>
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue';
import { ref } from 'vue';

const emits = defineEmits(['confirm', 'cancel']);

const loading = ref(false);
const visible = ref(true);

const onConfirm = () => {
    loading.value = true;
    setTimeout(() => {
        loading.value = false;
        message.success('提现成功');
        emits('confirm');
    }, 1000);
};

const onCancel = () => {
    emits('cancel');
};
</script>

<style lang="scss">
.tips {
    letter-spacing: 2px;
    font-size: 18px;
    font-weight: 700;
    min-width: fit-content;
}
</style>

<style lang="scss" scoped>
.account {
    margin-top: 16px;

    .account-item {
        display: flex;
        align-items: center;

        &:not(:last-of-type) {
            margin-bottom: 16px;
        }
    }

    .key {
        color: #999;
        font-size: 14px;
    }

    .value {
        color: #333;
        font-size: 16px;
        font-weight: 700;
        margin-left: 8px;
    }
}
</style>
