<script setup lang="tsx">
import { onMounted, ref, reactive, watch, toRefs } from 'vue';
import type { DataTableColumns } from 'naive-ui';
import { NCard, NSpace, NButton } from 'naive-ui';
import CommonTable from '~/src/components/common/CommonTable/index.vue';
import { getInstanceName } from '~/src/utils/common';
import { fetchUserList, fetchroleList, modifyUsersRole, resetPassword } from '~/src/service/api';
import { useBoolean } from '~/src/hooks';
import { createRequiredFormRule, getConfirmPwdRule } from '~/src/utils';

const table = ref<typeof CommonTable | null>(null);
const data = ref<Auth.UserInfo[] | undefined>([]);
const { bool: showPasswordModal, setFalse: closePasswordModal, setTrue: openPasswordShow } = useBoolean(false);
const { bool: showRoleModal, setFalse: closeRoleModal, setTrue: openRoleModal } = useBoolean(false);

const loading = ref(false);
const userId = ref('');
const name = getInstanceName('用户管理');
const roleList = ref<Auth.Role[]>([]);
const passwodFormRef = ref();
const pageInfo = reactive<PageParams>({
  pageNumber: 1,
  pageSize: 10
});
const params: DataTableColumns<Auth.UserInfo> = [
  // {
  //   title: 'ID',
  //   key: 'id'
  // },
  {
    title: '用户名',
    key: 'username'
  },
  {
    title: '昵称',
    key: 'nickname'
  },
  {
    title: '手机号',
    key: 'phoneNumber'
  },
  {
    title: '角色',
    key: 'roleName'
  },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    width: 150,
    render(row) {
      return (
        <NSpace justify="space-around">
          <NButton
            size={'small'}
            onClick={() => {
              openPasswordShow();
              userId.value = row.id;
            }}
          >
            修改密码
          </NButton>
          <NButton
            size={'small'}
            onClick={() => {
              openRoleModal();
              userId.value = row.id;
              roleFromModel.value.roleId = row.roleId;
            }}
          >
            分配角色
          </NButton>
        </NSpace>
      );
    }
  }
];

// const message = useMessage();
const columns = params;

const totalCount = ref(0);
const roleFromModel = ref({
  roleId: ''
});
const clearRoleFormModel = () => {
  roleFromModel.value = {
    roleId: ''
  };
};

const passwordFormModel = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});
const passwordFormRules = {
  oldPassword: createRequiredFormRule('请输入旧密码'),
  newPassword: createRequiredFormRule('请输入新密码'),
  confirmPassword: getConfirmPwdRule(toRefs(passwordFormModel).newPassword)
};

const clearPasswordFormModel = () => {
  passwordFormModel.confirmPassword = '';
  passwordFormModel.newPassword = '';
  passwordFormModel.confirmPassword = '';
};
const freshList = async () => {
  loading.value = true;
  const res = await fetchUserList(pageInfo, searchParam.value);
  data.value = res.data?.list;
  totalCount.value = res.data?.total as number;
  loading.value = false;
};
const handlePageSizeUpdate = (pageSize: number) => {
  pageInfo.pageSize = pageSize;
  // console.log(pageSize);
};
const handleRoleModifySubmit = async () => {
  await modifyUsersRole(userId.value, roleFromModel.value.roleId);
  closeRoleModal();
  await freshList();
};
const handleModifyPassword = () => {
  if (!passwodFormRef.value) return;

  passwodFormRef.value.validate(async (errors: any) => {
    // console.log(errors);
    if (!errors) {
      // debugger;
      // if (!agreement.value) return;
      const { newPassword, oldPassword } = passwordFormModel;

      try {
        await resetPassword(userId.value, oldPassword, newPassword);
        window.$message?.success('修改密码成功!');
      } catch (error) {
        window.$message?.error(error as string);
      }

      // console.log(newPassword, oldPassword, confirmPassword);
      // fetchRegister(username, pwd, phone).then(res => {
      //   console.log(res);
      // });
      // (username, pwd, phone);
      // if (res.code === 200)
    } else {
      window.$message?.error('验证失败!');
    }
  });
};
const handlePageUpdate = (page: number) => {
  pageInfo.pageNumber = page;
};
const searchModel = ref({
  username: '',
  nickname: '',
  phoneNumber: '',
  roleId: ''
});
const searchParam = ref();

const handleSearch = () => {
  searchParam.value = {
    ...searchModel.value
  };
  freshList();
};
const handleResetSearch = () => {
  searchModel.value = {
    username: '',
    nickname: '',
    phoneNumber: '',
    roleId: ''
  };
  searchParam.value = {
    ...searchModel.value
  };
  freshList();
};
watch(pageInfo, () => {
  freshList();
});
onMounted(() => {
  // 请求
  freshList();
  fetchroleList().then(res => {
    roleList.value = res.data?.list as Auth.Role[];
  });
});
</script>

<script lang="ts" setup></script>
<template>
  <n-card title="用户管理" :bordered="false" class="rounded-16px shadow-sm hfull">
    <CommonTable
      ref="table"
      :columns="columns"
      :table-data="data"
      :total-count="totalCount"
      :modal-loading="false"
      :loading="loading"
      :name="name"
      :add-btn-display="false"
      @page-size-change="handlePageSizeUpdate"
      @page-change="handlePageUpdate"
    >
      <template #searchPart>
        <n-space class="pb-12px" justify="space-between">
          <n-form ref="formRef" :model="searchModel" label-placement="left">
            <n-grid :cols="24" :x-gap="18">
              <n-form-item-grid-item :span="6" label="用户名">
                <n-input v-model:value="searchModel.username" placeholder="请输入" />
              </n-form-item-grid-item>
              <n-form-item-grid-item :span="6" label="昵称">
                <n-input v-model:value="searchModel.nickname" placeholder="请输入" />
              </n-form-item-grid-item>
              <n-form-item-grid-item :span="6" label="手机号">
                <n-input v-model:value="searchModel.phoneNumber" placeholder="请输入" />
              </n-form-item-grid-item>
              <n-form-item-grid-item :span="6" label="角色">
                <n-select
                  v-model:value="searchModel.roleId"
                  label-field="name"
                  value-field="id"
                  :options="roleList"
                  clearable
                />
              </n-form-item-grid-item>

              <n-form-item-grid-item :span="6">
                <n-button type="primary" @click="handleSearch"> 搜索 </n-button>
                <n-button class="ml-6" @click="handleResetSearch"> 重置 </n-button>
              </n-form-item-grid-item>
            </n-grid>
          </n-form>
        </n-space>
      </template>
    </CommonTable>
    <n-modal
      v-model:show="showPasswordModal"
      preset="card"
      title="修改密码"
      style="width: 750px"
      :mask-closable="false"
      :closable="true"
      :on-close="
        () => {
          closePasswordModal();
          clearPasswordFormModel();
        }
      "
    >
      <n-form
        ref="passwodFormRef"
        label-placement="left"
        :label-width="100"
        :model="passwordFormModel"
        :rules="passwordFormRules"
      >
        <n-form-item label="旧密码" path="oldPassword">
          <n-input v-model:value="passwordFormModel.oldPassword" type="password" />
        </n-form-item>
        <n-form-item label="新密码" path="newPassword">
          <n-input v-model:value="passwordFormModel.newPassword" type="password" />
        </n-form-item>
        <n-form-item label="确认密码" path="confirmPassword">
          <n-input v-model:value="passwordFormModel.confirmPassword" type="password" />
        </n-form-item>
        <n-space class="w-full pt-16px" :size="24" justify="end">
          <n-button
            class="w-72px"
            @click="
              () => {
                closePasswordModal();
                clearPasswordFormModel();
              }
            "
            >取消</n-button
          >
          <n-button class="w-72px" type="primary" @click="handleModifyPassword">确定</n-button>
        </n-space>
      </n-form>
    </n-modal>
    <n-modal
      v-model:show="showRoleModal"
      preset="card"
      title="分配角色"
      style="width: 750px"
      :mask-closable="false"
      :closable="true"
      :on-close="
        () => {
          closeRoleModal();
          clearRoleFormModel();
        }
      "
    >
      <n-form label-placement="left" :label-width="100" :model="roleFromModel">
        <n-form-item label="角色名" path="roleId">
          <n-select v-model:value="roleFromModel.roleId" label-field="name" value-field="id" :options="roleList" />
        </n-form-item>
        <n-space class="w-full pt-16px" :size="24" justify="end">
          <n-button
            class="w-72px"
            @click="
              () => {
                closeRoleModal();
                clearRoleFormModel();
              }
            "
            >取消</n-button
          >
          <n-button class="w-72px" type="primary" @click="handleRoleModifySubmit">确定</n-button>
        </n-space>
      </n-form>
    </n-modal>
  </n-card>
</template>
