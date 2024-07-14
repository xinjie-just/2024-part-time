<!-- 添加或编辑员工 -->
<template>
    <a-modal v-model:open="isVisible" :width="640" :title="props.isEdit ? '编辑员工' : '添加员工'"
        :body-style="{ paddingTop: '24px', maxHeight: '500px', overflowY: 'scroll' }" @cancel="onCancel">
        <a-form :model="form" :rules="rules" ref="formRef" autocomplete="off" :label-col="{ span: 4 }">
            <a-form-item label="姓名" name="name">
                <a-input v-model:value.trim="form.name" :maxlength="6" allowClear placeholder="2-6 位字符" />
            </a-form-item>
            <a-form-item label="昵称" name="nickName">
                <a-input v-model:value.trim="form.nickName" :maxlength="16" allowClear placeholder="2-16 位字符" />
            </a-form-item>
            <a-form-item label="手机号码" name="phone">
                <a-input v-model:value.number.trim="form.phone" :maxlength="11" allowClear placeholder="请输入正确手机号码" />
            </a-form-item>
            <a-form-item label="密码" name="password">
                <a-input-password v-model:value.trim="form.password" :maxlength="16" allowClear
                    placeholder="6-16 位，必须包含数字和字母" />
            </a-form-item>
            <a-form-item label="权限" name="permission">
                <!-- TODO: Found 15 elements with non-unique id #form_item_permission -->
                <div v-for="(option, index) of options" :key="index" class="checkbox-item">
                    <a-checkbox>{{ option.label }}</a-checkbox>
                    <template v-if="option.children?.length">
                        <ul class="sub-list">
                            <li v-for="(subOption, subIndex) of option.children" :key="`${index}${subIndex}`"
                                class="checkbox-sub-item">
                                <a-checkbox>{{ subOption.label }}</a-checkbox>
                            </li>
                        </ul>
                    </template>
                </div>
            </a-form-item>
        </a-form>
        <template #footer>
            <a-button key="back" @click="onCancel">取消</a-button>
            <a-button key="submit" type="primary" :loading="loading" :disabled="disabled"
                @click="onSubmit">提交</a-button>
        </template>
    </a-modal>
</template>

<script setup lang="ts">
import { IManageStaff, IStaffPermission } from '@/models';
import { routes } from "@/routers";
import { message } from 'ant-design-vue';
import { Rule } from 'ant-design-vue/es/form';
import { ref, reactive, UnwrapRef, computed, onMounted, Ref } from 'vue';

const emits = defineEmits(['cancel', 'confirm']);
const props = defineProps<{ isEdit: boolean, staffId: number }>();

const isVisible = ref(true);
const form: UnwrapRef<IManageStaff> = reactive({
    name: '',
    nickName: '',
    phone: '',
    password: '',
    permission: []
});

const options: Ref<IStaffPermission[]> = ref([]);

const formRef = ref();
const loading = ref(false);
const disabled = computed((): boolean => {
    const values = formRef.value?.getFieldsValue();
    const nameDisabled = values?.name?.trim()?.length < 2;
    const phoneDisabled = !/^1[3-9]\d{9}$/.test(values?.phone?.trim());
    const passwordDisabled = !/^(?=.*[0-9])(?=.*[a-zA-Z]).{6,16}$/.test(values?.password?.trim());
    return nameDisabled || phoneDisabled || passwordDisabled;
});

const rules: Record<string, Rule[]> = {
    name: [
        { required: true, message: '请输入店铺名称', trigger: 'change' },
        { min: 2, message: '2-30 位字符！', trigger: 'blur' },

    ],
    phone: [
        { required: true, message: '请输入手机号码', trigger: 'change' },
        { pattern: /^1[3-9]\d{9}$/, message: '手机号码格式不正确！', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'change' },
        { pattern: /^(?=.*[0-9])(?=.*[a-zA-Z]).{6,16}$/, message: '6-16 位，必须包含数字和字母！', trigger: 'blur' },
    ],
};

const transformMenu = (menuItems) => {
    return menuItems.map(item => {
        // 初始化当前项的转换结果  
        const transformedItem = {
            value: item.path.substring(1),
            label: item.name,
            children: []
        };

        // 如果存在 children，则递归转换它们  
        if (item.children?.length > 0) {
            transformedItem.children = item.children.map(child => {
                return {
                    value: child.path.substring(1),
                    label: child.name,
                    children: [] // 如果 child 也有 children，可以在这里递归  
                };
            });
        }

        return transformedItem;
    });
}

onMounted(() => {
    const newRoutes = routes.find(item => item.path === "/")?.children;
    const permissionRoutes = newRoutes.filter(item => item.redirect !== "/");
    console.log("permissionRoutes", permissionRoutes);

    // 转换数据  
    options.value = transformMenu(permissionRoutes);

    console.log("staffId", props.staffId);
})

const onSubmit = async (): Promise<void> => {
    loading.value = true;
    try {
        await formRef.value?.validate();
        console.log('表单验证成功', form);
        // 这里可以添加提交表单的逻辑
        setTimeout(() => {
            loading.value = false;
            message.success(props.isEdit ? '店铺编辑成功' : '店铺添加成功');
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

<style lang="scss"></style>

<style lang="scss" scoped>
.checkbox-item {
    display: block;
    width: 100%;

    &:not(:last-of-type) {
        margin-bottom: 24px;
    }
}

.sub-list {
    margin-top: 8px;
    margin-left: 24px;
    overflow-y: auto;
}

.checkbox-sub-item {
    display: block;
    width: 100%;

    &:not(:last-of-type) {
        margin-bottom: 8px;
    }

}
</style>