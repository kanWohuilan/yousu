<script setup lang="tsx">
import { onMounted, ref, reactive, watch } from 'vue';
import { NSpace, NPopconfirm, NButton, NCard } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import { cloneDeep } from 'lodash';
import CommonTable from '~/src/components/common/CommonTable/index.vue';
import { getInstanceName } from '~/src/utils/common';
import { addPermission, fetchPermissionList, removePermission, modifyPermission } from '~/src/service/api';
import { useForm } from '~/src/hooks';
import { EnumMModalType } from '~/src/enum';

const table = ref<typeof CommonTable | null>(null);
const data = ref<Auth.Permission[] | undefined>([]);
const pageInfo = reactive<PageParams>({
  pageNumber: 1,
  pageSize: 10
});

const params = [
  {
    title: '权限名称',
    key: 'name'
  },
  {
    title: '权限编码',
    key: 'code'
  }
];
const createColumns = ({
  update,
  remove
}: {
  update: (row: Auth.Permission) => void;
  remove: (row: Auth.Permission) => void;
}): DataTableColumns<Auth.Permission> => {
  return [
    ...params,
    {
      title: '操作',
      key: 'actions',
      width: 150,
      render(row) {
        return (
          <NSpace justify={'center'}>
            <NButton type="info" size={'small'} onClick={() => update(row)}>
              编辑
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
const modalLoading = ref<boolean>(false);
// const message = useMessage();
const columns = createColumns({
  async update(row: Auth.Permission) {
    clearFormModel();
    table.value?.handleModalShow(`修改${name}`, EnumMModalType.modify);
    modalLoading.value = true;
    // eslint-disable-next-line no-warning-comments
    // TODO 接口中gisInfo有问题
    // const res = await fetchCampusDetails(row.id as string);
    formModel.value = cloneDeep(row);
    modalLoading.value = false;
  },
  async remove(row: Auth.Permission) {
    await removePermission(row.id as string);
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
  const res = await fetchPermissionList(pageInfo);
  data.value = res.data?.list;
  totalCount.value = res.data?.total as number;

  loading.value = false;
};
const { formModel, clearFormModel } = useForm<Auth.Permission>({ permissionType: 'MENU' });
const handleClearForm = () => {
  clearFormModel();
};
const name = getInstanceName('菜单管理');
const loading = ref(false);
const handleCommit = async (modalType: number) => {
  if (modalType === EnumMModalType.add) {
    await addPermission(formModel.value);
    // message.success('新增成功');
  } else {
    await modifyPermission(formModel.value);
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
});
</script>
<script></script>

<template>
  <n-card title="菜单管理" :bordered="false" class="rounded-16px shadow-sm hfull">
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
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="12" label="权限名称" path="">
          <n-input v-model:value="formModel.name" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="权限编码" path="">
          <n-input v-model:value="formModel.code" />
        </n-form-item-grid-item>
      </n-grid>
    </CommonTable>
  </n-card>
</template>
