<script setup lang="ts">
import { ref, withDefaults, defineExpose } from 'vue';
import type { RowData, TableColumns } from 'naive-ui/es/data-table/src/interface';
import { EnumMModalType } from '~/src/enum';
import TableActionModal from './components/TableActionModal';

interface PropsType {
  columns: TableColumns<any>;
  tableData: Array<RowData>;
  totalCount: number;
  loading: boolean;
  name: string;
  modalLoading: boolean;
  addBtnDisplay: boolean;
}

const props = withDefaults(defineProps<PropsType>(), {
  columns: () => [],
  tableData: () => [],
  totalCount: 1,
  loading: false,
  name: '',
  modalLoading: false,
  addBtnDisplay: true
});
const modalType = ref<number>(EnumMModalType.add);
const modalTile = ref<string>(`新增${props.name}`);
const modalShow = ref<boolean>(false);
const handleModalShow = (title: string, type: number) => {
  modalTile.value = title;
  modalType.value = type;

  modalShow.value = true;
};
const handleModalClose = () => {
  modalShow.value = false;
};
defineExpose({
  handleModalClose,
  handleModalShow
});
const emit = defineEmits(['pageChange', 'pageSizeChange', 'clearform', 'commit']);

const currentPage = ref(1);
// const itemCount =
const pageSizes = [10, 20, 30];
const handlePageUpdate = (page: number) => {
  currentPage.value = page;
  emit('pageChange', page);
};

const handlePageSizeUpdate = (pageSize: number) => {
  emit('pageSizeChange', pageSize);
};

const handleAdd = () => {
  emit('clearform');
  handleModalShow(`新增${props.name}`, EnumMModalType.add);
};
const handleCommit = () => {
  emit('commit', modalType.value);
};
</script>
<template>
  <n-space class="pb-12px" justify="space-between">
    <slot name="searchPart"></slot>
    <n-space class="pb-12px" justify="space-between">
      <n-space v-if="addBtnDisplay">
        <n-button type="primary" @click="handleAdd">
          <icon-ic-round-plus class="mr-4px text-20px" />
          新增
        </n-button>
      </n-space>
    </n-space>
  </n-space>
  <n-space vertical>
    <n-data-table :columns="columns" :data="tableData" :loading="loading" />
    <n-pagination
      v-model:page="currentPage"
      class="float-right"
      :item-count="totalCount"
      :page-sizes="pageSizes"
      :on-update:page="handlePageUpdate"
      :on-update:page-size="handlePageSizeUpdate"
      show-size-picker
      :disabled="loading"
    />
  </n-space>
  <TableActionModal
    :loading="modalLoading"
    :modal-show="modalShow"
    :title="modalTile"
    @close="handleModalClose"
    @commit="handleCommit"
  >
    <slot></slot>
  </TableActionModal>
</template>
