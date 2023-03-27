<template>
  <n-card title="房型管理" :bordered="false" class="rounded-16px shadow-sm hfull">
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
import { deleteHouseType, getHouseTypeList } from '@/service/api/apartment';
import TableActionModal from './components/TableActionModal.vue';
import type { ModalType } from './components/TableActionModal.vue';

const { startLoading, endLoading } = useLoading(false);
const { bool: visible, setTrue: openModal } = useBoolean();

const tableData = ref<Apartment.HouseType[]>([]);

function setTableData(data: Apartment.HouseType[]) {
  tableData.value = data;
}

async function getTableData() {
  startLoading();
  const { data } = await getHouseTypeList({
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

const columns: Ref<DataTableColumns<Apartment.HouseType>> = ref([
  {
    key: 'typeName',
    title: '房型',
    align: 'center'
  },
  {
    key: 'typeIntroduce',
    title: '类型介绍',
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
]) as Ref<DataTableColumns<Apartment.HouseType>>;

const modalType = ref<ModalType>('add');

function setModalType(type: ModalType) {
  modalType.value = type;
}

const editData = ref<Apartment.HouseType | null>(null);

function setEditData(data: Apartment.HouseType | null) {
  editData.value = data;
}

function handleAddTable() {
  openModal();
  setModalType('add');
}

function handleOver() {
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
  } as Apartment.HouseType;
  await deleteHouseType(data);
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
