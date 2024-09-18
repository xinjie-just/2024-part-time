<!-- 添加或编辑员工 -->
<template>
  <a-modal v-model:open="visible" :mask-closable="false" :keyboard="false" :width="720"
    :title="props.isEdit ? '编辑员工' : '添加员工'" :body-style="{ paddingTop: '32px', paddingBottom: '8px' }"
    @cancel="onCancel">
    <a-form :model="form" :rules="rules" ref="formRef" autocomplete="off" :label-col="{ span: 4 }">
      <a-form-item label="姓名" name="name">
        <a-input v-model:value.trim="form.name" :maxlength="6" allow-clear placeholder="2-6 位字符" />
      </a-form-item>
      <a-form-item label="登录名" name="loginName">
        <a-input v-model:value.trim="form.loginName" :maxlength="16" allow-clear placeholder="2-16 位字符" />
      </a-form-item>
      <a-form-item label="手机号码" name="phone">
        <a-input v-model:value.trim="form.phone" :maxlength="11" allow-clear placeholder="请输入正确手机号码" />
      </a-form-item>
      <a-form-item label="密码" name="password">
        <a-input-password v-model:value.trim="form.password" :maxlength="16" allow-clear
          placeholder="6-16 位，必须包含数字和字母" />
      </a-form-item>
      <a-form-item label="菜单权限" name="permission">
        <a-tree checkable :tree-data="treeData" v-model:checkedKeys="checkedKeys"></a-tree>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button key="back" :disabled="loading" @click="onCancel">取消</a-button>
      <a-button key="submit" type="primary" :loading="loading" :disabled="disabled" @click="onSubmit">提交</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { IManageStaff } from '@/models';
import { routes } from '@/routers';
import { getStaffInfo, saveStaffInfo } from '@/services';
import { ISaveStaffInfoReq } from '@/services/models';
import { message, TreeProps } from 'ant-design-vue';
import { Rule } from 'ant-design-vue/es/form';
import { ref, reactive, UnwrapRef, computed, onMounted, Ref } from 'vue';

const emits = defineEmits(['cancel', 'confirm']);
const props = defineProps<{ isEdit: boolean; staffId: number }>();

const visible = ref(true);
const form: UnwrapRef<IManageStaff> = reactive({
  name: '',
  loginName: '',
  phone: '',
  password: ''
});
const treeData: Ref<TreeProps['treeData']> = ref([]);
const checkedKeys: Ref<string[]> = ref([]);

const formRef = ref();
const getLoading = ref(false);
const loading = ref(false);
const disabled = computed((): boolean => {
  const values = formRef.value?.getFieldsValue();
  const nameDisabled = values?.name?.trim()?.length < 2;
  const loginNameDisabled = values?.loginName?.trim()?.length < 2;
  const phoneDisabled = !/^1[3-9]\d{9}$/.test(values?.phone?.trim());
  const passwordDisabled = !/^(?=.*[0-9])(?=.*[a-zA-Z]).{6,16}$/.test(values?.password?.trim());
  return nameDisabled || loginNameDisabled || phoneDisabled || passwordDisabled;
});

const rules: Record<string, Rule[]> = {
  name: [
    { required: true, message: '请输入店铺名称', trigger: 'change' },
    { min: 2, message: '2-30 位字符！', trigger: 'blur' }
  ],
  loginName: [
    { required: true, message: '请输入登录名', trigger: 'change' },
    { min: 2, message: '2-16 位字符！', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'change' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号码格式不正确！', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'change' },
    {
      pattern: /^(?=.*[0-9])(?=.*[a-zA-Z]).{6,16}$/,
      message: '6-16 位，必须包含数字和字母！',
      trigger: 'blur'
    }
  ]
};

const transformMenu = (menuItems) => {
  return menuItems.map((item) => {
    // 初始化当前项的转换结果
    const transformedItem = {
      key: item.path.substring(1),
      title: item.name,
      children: []
    };
    // 如果存在 children，则递归转换它们
    if (item.children?.length > 0) {
      transformedItem.children = item.children.map((child) => {
        return {
          key: child.path.substring(1),
          title: child.name,
          children: [] // 如果 child 也有 children，可以在这里递归
        };
      });
    }
    return transformedItem;
  });
};

onMounted(() => {
  const newRoutes = routes.find((item) => item.path === '/')?.children;
  const permissionRoutes = newRoutes.filter((item) => item.redirect !== '/');
  console.log('permissionRoutes', permissionRoutes);

  // 转换数据
  treeData.value = transformMenu(permissionRoutes);
  if (props.isEdit) {
    getStaffInfoFn();
  }
});

const getStaffInfoFn = () => {
  const params = {
    adminId: props.staffId,
  };
  getStaffInfo(params).then((res) => {
    const result = res.data;

    form.name = result.name;
    form.loginName = result.loginName;
    form.phone = result.phone;
    form.password = result.password;

    checkedKeys.value = result.menuPathList;
  })
}

const onSubmit = async (): Promise<void> => {
  loading.value = true;
  try {
    await formRef.value?.validate();
    console.log('表单验证成功', form);
    console.log('treeData', treeData.value);
    const params: ISaveStaffInfoReq = {
      name: form.name,
      loginName: form.loginName,
      password: form.password,
      phone: form.phone,
      menuPathList: checkedKeys.value
    };
    if (props.isEdit) {
      params.id = props.staffId;
    }
    saveStaffInfo(params)
      .then(() => {
        message.success(props.isEdit ? '店铺编辑成功' : '店铺添加成功');
        emits('confirm');
      })
      .finally(() => {
        loading.value = false;
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
