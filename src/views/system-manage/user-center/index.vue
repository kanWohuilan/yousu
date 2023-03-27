<script setup lang="tsx">
import { onMounted, reactive, ref, toRefs } from 'vue';
import { NCard } from 'naive-ui';
import { useAuthStore } from '@/store';
import { modifyUser, resetPassword, fetchroleList } from '~/src/service';
import { useBoolean } from '~/src/hooks';
import { createRequiredFormRule, getConfirmPwdRule } from '~/src/utils';
const auth = useAuthStore();
const userInfoModel = reactive({
  id: auth.userInfo.id,
  username: auth.userInfo.username,
  nickname: auth.userInfo.nickname,
  phoneNumber: auth.userInfo.phoneNumber,
  roleId: auth.userInfo.roleId
});
// const message = useMessage();
const roleList = ref<Auth.Role[]>([]);
const { bool: showPasswordModal, setFalse: closePasswordModal, setTrue: openPasswordShow } = useBoolean(false);
const passwodFormRef = ref();
const passwordFormModel = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const handleModifyPassword = () => {
  if (!passwodFormRef.value) return;

  passwodFormRef.value.validate(async (errors: any) => {
    // console.log(errors);
    if (!errors) {
      // debugger;
      // if (!agreement.value) return;
      const { newPassword, oldPassword } = passwordFormModel;

      try {
        await resetPassword(auth.userInfo.id, oldPassword, newPassword);
        window.$message?.success('修改密码成功!');
      } catch (error) {
        window.$message?.error(error as string);
      }
    } else {
      window.$message?.error('验证失败!');
    }
  });
};
const passwordFormRules = {
  oldPassword: createRequiredFormRule('请输入旧密码'),
  newPassword: createRequiredFormRule('请输入新密码'),
  confirmPassword: getConfirmPwdRule(toRefs(passwordFormModel).newPassword)
};

const handleReset = () => {
  userInfoModel.nickname = auth.userInfo.nickname;
  userInfoModel.phoneNumber = auth.userInfo.phoneNumber;
};
const clearPasswordFormModel = () => {
  passwordFormModel.confirmPassword = '';
  passwordFormModel.newPassword = '';
  passwordFormModel.confirmPassword = '';
};
const handleSubmit = async () => {
  try {
    await modifyUser(userInfoModel);
    auth.userInfo.phoneNumber = userInfoModel.phoneNumber;
    auth.userInfo.nickname = userInfoModel.nickname;
    // message.success('修改成功');
  } catch (e) {}
};

onMounted(() => {
  fetchroleList().then(res => {
    roleList.value = res.data?.list as Auth.Role[];
  });
});
</script>

<script lang="ts" setup></script>
<template>
  <n-card title="用户中心" :bordered="false" class="rounded-16px shadow-sm hfull">
    <div class="w-md" style="position: absolute; left: 50%; top: 50%; transform: translateX(-50%) translateY(-50%)">
      <n-form class="justify-center" :model="userInfoModel">
        <n-form-item label="用户名">
          <n-input v-model:value="userInfoModel.username" disabled></n-input>
        </n-form-item>
        <n-form-item label="昵称">
          <n-input v-model:value="userInfoModel.nickname"></n-input>
        </n-form-item>
        <n-form-item label="手机号">
          <n-input v-model:value="userInfoModel.phoneNumber"></n-input>
        </n-form-item>
        <n-form-item label="角色">
          <n-select
            v-model:value="userInfoModel.roleId"
            label-field="name"
            value-field="id"
            :options="roleList"
            placeholder="暂无角色"
            disabled
          />
        </n-form-item>
        <n-space>
          <n-button type="info" @click="handleSubmit">确认修改</n-button>
          <n-button @click="handleReset">重置</n-button>
          <n-button @click="openPasswordShow">修改密码</n-button>
        </n-space>
      </n-form>
    </div>
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
  </n-card>
</template>
