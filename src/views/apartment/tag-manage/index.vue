<template>
  <n-card title="标签管理" :bordered="false" class="rounded-16px shadow-sm hfull">
    <n-space class="pb-12px" justify="space-between">
      <n-space>
        <n-button type="primary" @click="handleAddTable">
          <icon-ic-round-plus class="mr-4px text-20px" />
          新增
        </n-button>
      </n-space>
    </n-space>
    <n-data-table :columns="columns" :data="tableData" :bordered="false" />
    <n-pagination
      v-model:page="pagination.page"
      class="float-right"
      :item-count="pagination.itemCount"
      :page-sizes="pagination.pageSizes"
      :on-update:page="onChange"
      :on-update:page-size="onUpdatePageSize"
      show-size-picker
    />
    <table-action-modal v-model:visible="visible" :type="modalType" :edit-data="editData" @handleOver="handleOver" />
  </n-card>
</template>

<script setup lang="tsx">
import { reactive, ref, watch } from 'vue';
import type { Ref } from 'vue';
import { NButton, NPopconfirm, NSpace } from 'naive-ui';
import type { DataTableColumns, PaginationProps } from 'naive-ui';
import { useBoolean, useLoading } from '@/hooks';
import { deleteTag, getTagList } from '@/service/api/apartment';
import TableActionModal from './components/TableActionModal.vue';
import type { ModalType } from './components/TableActionModal.vue';

const { startLoading, endLoading } = useLoading(false);
const { bool: visible, setTrue: openModal } = useBoolean();

const tableData = ref<Apartment.Tag[]>([]);

function setTableData(data: Apartment.Tag[]) {
  tableData.value = data;
}

async function getTableData() {
  startLoading();
  const { data } = await getTagList({
    pageNumber: pagination.page as number,
    pageSize: pagination.pageSize as number
  });
  // console.log(data);
  if (data) {
    setTableData(data.list);
    // eslint-disable-next-line require-atomic-updates
    pagination.itemCount = data?.total as number;
    endLoading();
  }
}

const columns: Ref<DataTableColumns<Apartment.Tag>> = ref([
  {
    key: 'tagName',
    title: '标签',
    align: 'center'
  },
  {
    key: 'tagColor',
    title: '标签颜色',
    align: 'center'
  },
  {
    key: 'actions',
    title: '操作',
    align: 'center',
    render: row => {
      return (
        <NSpace justify={'center'}>
          <NButton size={'small'} onClick={() => handleEditTable(row.id)}>
            编辑
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDeleteTable(row.id)}>
            {{
              default: () => '确认删除',
              trigger: () => <NButton size={'small'}>删除</NButton>
            }}
          </NPopconfirm>
        </NSpace>
      );
    }
  }
]) as Ref<DataTableColumns<Apartment.Tag>>;

const modalType = ref<ModalType>('add');

function setModalType(type: ModalType) {
  modalType.value = type;
}

const editData = ref<Apartment.Tag | null>(null);

function setEditData(data: Apartment.Tag | null) {
  editData.value = data;
}

function handleAddTable() {
  openModal();
  setModalType('add');
}

function handleOver() {
  console.log('>>>>>>>>>>');
  getTableData();
}

function handleEditTable(rowId: string) {
  const findItem = tableData.value.find(item => item.id === rowId);
  if (findItem) {
    setEditData(findItem);
  }
  setModalType('edit');
  openModal();
}

async function handleDeleteTable(rowId: string) {
  const data = {
    id: rowId
  } as Apartment.Tag;
  await deleteTag(data);
  await getTableData();
  window.$message?.info(`删除成功`);
}

const pagination: PaginationProps = reactive({
  page: 1,
  pageSize: 5,
  showSizePicker: true,
  pageSizes: [5, 10, 15, 20, 25, 30]
});
const onUpdatePageSize = (pageSize: number) => {
  // console.log('触发', pageSize);
  pagination.pageSize = pageSize;
  pagination.page = 1;
};
const onChange = (page: number) => {
  // console.log('触发', page);
  pagination.page = page;
  // getTableData();
};
function init() {
  getTableData();
}
watch(
  () => pagination.pageSize,
  () => {
    getTableData();
  }
);
watch(
  () => pagination.page,
  () => {
    getTableData();
  }
);
// 初始化
init();
</script>
<script></script>

<style scoped></style>
