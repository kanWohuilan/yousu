<script setup lang="tsx">
import { onMounted, ref, reactive, watch } from 'vue';
import { NSpace, NPopconfirm, NButton, NCard } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import { cloneDeep } from 'lodash';
import CommonTable from '~/src/components/common/CommonTable/index.vue';
import { getInstanceName } from '~/src/utils/common';
import {
  addrole,
  fetchroleList,
  deleterole,
  editrole,
  getPermissions,
  fetchPermissionList,
  modifyRolePermissions
} from '~/src/service/api';
import { useBoolean, useForm } from '~/src/hooks';
import { EnumMModalType } from '~/src/enum';

const table = ref<typeof CommonTable | null>(null);
const data = ref<Auth.Role[] | undefined>([]);
const pageInfo = reactive<PageParams>({
  pageNumber: 1,
  pageSize: 10
});
const { bool: showPermissionModal, setFalse: closePermissionModal, setTrue: openPermissionModal } = useBoolean(false);
const permissionFormModel = ref({ permissionIds: [], id: '' });
const params = [
  {
    title: '角色',
    key: 'name'
  }
];
const permissionList = ref<Auth.Permission[]>([]);
const createColumns = ({
  update,
  remove
}: {
  update: (row: Auth.Role) => void;
  remove: (row: Auth.Role) => void;
}): DataTableColumns<Auth.Role> => {
  return [
    ...params,
    {
      title: '操作',
      key: 'actions',
      align: 'center',
      width: 280,
      render(row) {
        return (
          <NSpace justify={'center'}>
            <NButton type="info" size={'small'} onClick={() => update(row)}>
              编辑
            </NButton>
            <NButton
              type="info"
              size={'small'}
              onClick={async () => {
                permissionFormModel.value.id = row.id as string;
                const res = await getPermissions(row.id as string);
                const permissions = res.data || [];

                permissionFormModel.value.permissionIds = permissions.map((item: any) => {
                  return item.id;
                });

                openPermissionModal();
              }}
            >
              权限配置
            </NButton>
            <NPopconfirm onPositiveClick={() => remove(row)}>
              {{
                default: () => '确认删除',
                trigger: () => (
                  <NButton type="error" size={'small'}>
                    删除
                  </NButton>
                )
              }}
            </NPopconfirm>
          </NSpace>
        );
      }
    }
  ];
};
const clearPermissionForm = () => {
  permissionFormModel.value = {
    permissionIds: [],
    id: ''
  };
};
const handlePermissionSubmit = () => {
  modifyRolePermissions(permissionFormModel.value.id, permissionFormModel.value.permissionIds).then(() => {
    closePermissionModal();
    clearPermissionForm();
  });
};
const modalLoading = ref<boolean>(false);
// const message = useMessage();
const columns = createColumns({
  async update(row: Auth.Role) {
    clearFormModel();
    table.value?.handleModalShow(`修改${name}`, EnumMModalType.modify);
    modalLoading.value = true;
    // eslint-disable-next-line no-warning-comments
    // TODO 接口中gisInfo有问题
    // const res = await fetchCampusDetails(row.id as string);
    formModel.value = cloneDeep(row);
    modalLoading.value = false;
  },
  async remove(row: Auth.Role) {
    await deleterole(row.id as string);
    // message.success('删除成功');
    const restCount = (totalCount.value - 1) % pageInfo.pageSize;
    let tempPageNum = (totalCount.value - 1 - restCount) / pageInfo.pageSize;
    if (restCount > 0) tempPageNum += 1;
    if (pageInfo.pageNumber > 1 && tempPageNum < pageInfo.pageNumber) {
      pageInfo.pageNumber = tempPageNum;
    } else {
      await freshList();
    }
  }
});
const totalCount = ref(0);
const freshList = async () => {
  loading.value = true;
  const res = await fetchroleList(pageInfo);
  data.value = res.data?.list;
  totalCount.value = res.data?.total as number;

  loading.value = false;
};
const { formModel, clearFormModel } = useForm<Auth.Role>({});
const handleClearForm = () => {
  clearFormModel();
};
const name = getInstanceName('角色管理');
const loading = ref(false);
const handleCommit = async (modalType: number) => {
  if (modalType === EnumMModalType.add) {
    await addrole(formModel.value);
    // message.success('新增成功');
  } else {
    await editrole(formModel.value);
    // message.success('更新成功');
  }
  table.value?.handleModalClose();
  await freshList();
};
const handlePageSizeUpdate = (pageSize: number) => {
  pageInfo.pageSize = pageSize;
  // console.log(pageSize);
};
const handlePageUpdate = (page: number) => {
  pageInfo.pageNumber = page;
};
watch(pageInfo, () => {
  freshList();
});
onMounted(() => {
  // 请求
  freshList();
  fetchPermissionList().then(res => {
    permissionList.value = res.data?.list as Auth.Permission[];
  });
});
</script>

<script lang="ts" setup></script>
<template>
  <n-card title="角色管理" :bordered="false" class="rounded-16px shadow-sm hfull">
    <CommonTable
      ref="table"
      :columns="columns"
      :table-data="data"
      :total-count="totalCount"
      :loading="loading"
      :modal-loading="modalLoading"
      :name="name"
      @page-size-change="handlePageSizeUpdate"
      @page-change="handlePageUpdate"
      @clearform="handleClearForm"
      @commit="handleCommit"
    >
      <n-form-item label="角色" path="name">
        <n-input v-model:value="formModel.name" />
      </n-form-item>
    </CommonTable>
    <n-modal
      v-model:show="showPermissionModal"
      preset="card"
      title="权限配置"
      style="width: 750px"
      :mask-closable="false"
      :closable="true"
      :on-close="
        () => {
          closePermissionModal();
          clearPermissionForm();
          freshList();
        }
      "
    >
      <n-form label-placement="left" :label-width="100" :model="permissionFormModel">
        <n-form-item label="权限选择" path="handlePersonId">
          <n-checkbox-group v-model:value="permissionFormModel.permissionIds">
            <n-grid :y-gap="8" :cols="3">
              <n-gi v-for="item in permissionList" :key="item.id">
                <n-checkbox :value="item.id" :label="item.name" />
              </n-gi>
            </n-grid>
          </n-checkbox-group>
        </n-form-item>
        <n-space class="w-full pt-16px" :size="24" justify="end">
          <n-button
            class="w-72px"
            @click="
              () => {
                closePermissionModal();
                clearPermissionForm();
              }
            "
            >取消</n-button
          >
          <n-button class="w-72px" type="primary" @click="handlePermissionSubmit">确定</n-button>
        </n-space>
      </n-form>
    </n-modal>
  </n-card>
</template>
