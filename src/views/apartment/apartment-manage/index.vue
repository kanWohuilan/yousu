<template>
  <n-card title="公寓管理" :bordered="false" class="rounded-16px shadow-sm hfull">
    <n-space class="pb-12px" justify="space-between">
      <n-form
        ref="formRef"
        :model="searchModel"
        label-placement="left"
        :label-width="160"
        :style="{
          maxWidth: '640px'
        }"
        inline
      >
        <n-form-item label="公寓名称" path="name">
          <n-input v-model:value="searchModel.name" placeholder="请输入" />
        </n-form-item>
        <n-form-item>
          <n-button type="primary" @click="handleSearch"> 搜索 </n-button>
          <n-button class="ml-6" @click="handleResetSearch"> 重置 </n-button>
        </n-form-item>
      </n-form>
    </n-space>
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
    <table-action-modal
      v-model:visible="visible"
      style="width: 800px"
      :type="modalType"
      :edit-data="editData"
      :around-facilities-options="aroundFacilitiesOptions"
      :tag-options="tagOptions"
      @handleOver="handleOver"
    />
    <n-modal
      v-model:show="showRoomModal"
      preset="card"
      style="width: 1200px"
      title="维护房型"
      :mask-closable="false"
      :closable="true"
      :on-close="closeRoomModal"
    >
      <n-card :bordered="false" size="huge">
        <RoomType :apartment-id="currentApartmentId" />
      </n-card>
    </n-modal>
    <n-modal
      v-model:show="showDetailModal"
      preset="card"
      style="width: 850px"
      title="公寓详情"
      :mask-closable="false"
      :closable="true"
      :on-close="closeDetailModal"
    >
      <n-card :bordered="false" size="huge">
        <RoomDetial :apartment-id="currentApartmentId" />
      </n-card>
    </n-modal>
  </n-card>
</template>

<script setup lang="tsx">
import { onMounted, reactive, ref, watch } from 'vue';
import type { Ref } from 'vue';
import { NButton, NPopconfirm, NSpace } from 'naive-ui';
import type { DataTableColumns, PaginationProps } from 'naive-ui';
import { useBoolean, useLoading } from '@/hooks';
import {
  deleteApartment,
  getApartmentDetails,
  getApartmentList,
  getAroundFacilityList,
  getTagList
} from '@/service/api/apartment';
import TableActionModal from './components/TableActionModal.vue';
import RoomType from './components/RoomType.vue';
import RoomDetial from './components/RoomDetail.vue';
import type { ModalType } from './components/TableActionModal.vue';

const { startLoading, endLoading } = useLoading(false);
const { bool: visible, setTrue: openModal } = useBoolean();
const { bool: showRoomModal, setTrue: openRoomModal, setFalse: closeRoomModal } = useBoolean();
const { bool: showDetailModal, setTrue: openDetialModal, setFalse: closeDetailModal } = useBoolean();
const searchParam = ref({});
// const totalCount = ref(0);
const pagination: PaginationProps = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 15, 20, 25, 30],

  itemCount: 0
  // pageCount: 100
});
const onUpdatePageSize = (pageSize: number) => {
  // console.log('触发', pageSize);
  pagination.pageSize = pageSize;
  pagination.page = 1;
};
const onChange = (page: number) => {
  // console.log('触发', page);
  pagination.page = page;
  getTableData();
};
const tableData = ref<Apartment.ApartmentVo[]>([]);
// const setTableData = (data: Apartment.ApartmentVo[]) => {
//   tableData.value = data;
// };

const currentApartmentId = ref<string>('');
const searchModel = ref({
  name: ''
});
const handleSearch = () => {
  searchParam.value = {
    ...searchModel.value
  };
  getTableData();
};
const handleResetSearch = () => {
  searchModel.value = {
    name: ''
  };
  searchParam.value = {
    ...searchModel.value
  };
  getTableData();
};
const getTableData = async () => {
  startLoading();
  const { data } = await getApartmentList(
    {
      pageNumber: pagination.page as number,
      pageSize: pagination.pageSize as number
    },
    { ...searchParam.value }
  );
  // console.log(data);

  if (data) {
    // setTableData(data.list);
    tableData.value = data.list;
    // eslint-disable-next-line require-atomic-updates
    pagination.itemCount = data?.total as number;
    // console.log(pagination.itemCount);
    endLoading();
  }
};

const aroundFacilitiesOptions = ref<Apartment.AroundFacility[]>([]);
const tagOptions = ref<Apartment.Tag[]>([]);
const handleRoomType = (id: string) => {
  currentApartmentId.value = id;
  openRoomModal();
};

const columns: Ref<DataTableColumns<Apartment.ApartmentVo>> = ref([
  {
    key: 'name',
    title: '公寓名称',
    align: 'center'
  },
  {
    key: 'site',
    title: '公寓地点',
    align: 'center'
  },
  {
    key: 'zipCode',
    title: '邮编',
    align: 'center'
  },

  {
    key: 'beds',
    title: '总床位数',
    align: 'center'
  },
  {
    key: 'buildYear',
    title: '建成年份',
    align: 'center'
  },
  {
    key: 'maxFloor',
    title: '最高楼层',
    align: 'center'
  },
  {
    key: 'weeklyPrice',
    title: '最低周租金',
    align: 'center'
  },
  {
    key: 'currency',
    title: '币种',
    align: 'center',
    render: row => {
      return row.currency.name;
    }
  },
  {
    key: 'aroundFacilities',
    title: '周边设施',
    align: 'center',
    render: row => {
      const aroundFacilities: string[] = row.aroundFacilities;
      const aroundFacilitiesName: string[] = [];
      aroundFacilities.forEach(aroundId => {
        return aroundFacilitiesOptions.value.forEach(item => {
          if (item.id === aroundId) {
            return aroundFacilitiesName.push(item.name);
          }
          return undefined;
        });
      });
      return aroundFacilitiesName.map(item => {
        return <n-tag> {item} </n-tag>;
      });
    }
  },
  {
    key: 'tags',
    title: '标签',
    align: 'center',
    render: row => {
      const tags: string[] = row.tags;
      const tagsName: string[] = [];
      tags.forEach(tagId => {
        return tagOptions.value.forEach(item => {
          // console.log(item);
          if (item.id === tagId) {
            return tagsName.push(item.tagName);
          }
          return undefined;
        });
      });
      return tagsName.map(item => {
        return <n-tag> {item} </n-tag>;
      });
    }
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
          <NButton size={'small'} onClick={() => handleDetails(row.id)}>
            详情
          </NButton>
          <NButton size={'small'} onClick={() => handleRoomType(row.id)}>
            维护房型
          </NButton>
        </NSpace>
      );
    }
  }
]) as Ref<DataTableColumns<Apartment.ApartmentVo>>;

function handleDetails(id: string) {
  openDetialModal();
  currentApartmentId.value = id;
}

const modalType = ref<ModalType>('add');

function setModalType(type: ModalType) {
  modalType.value = type;
}

const editData = ref<Apartment.ApartmentDetailVo | null>(null);

function setEditData(data: Apartment.ApartmentDetailVo | null) {
  data!.buildYear = new Date(data!.buildYear, 1, 1).getTime();
  editData.value = data;
}

function handleAddTable() {
  openModal();
  setModalType('add');
}

function handleOver() {
  // console.log('>>>>>>>>>>');
  getTableData();
}

async function handleEditTable(rowId: string) {
  const { data } = await getApartmentDetails(rowId);
  if (data) {
    setEditData(data as Apartment.ApartmentDetailVo);
  }
  setModalType('edit');
  openModal();
}

async function handleDeleteTable(rowId: string) {
  const data = {
    id: rowId
  } as Apartment.ApartmentDelete;
  await deleteApartment(data);
  await getTableData();
  window.$message?.info(`删除成功`);
}

async function getAroundFacilitiesOptions() {
  const { data } = await getAroundFacilityList();
  if (data) {
    aroundFacilitiesOptions.value = data.list;
  }
}

async function getTags() {
  const { data } = await getTagList();
  if (data) {
    tagOptions.value = data.list;
  }
}
// pagination.itemCount = data?.total;
watch(
  () => pagination.pageSize,
  () => {
    getTableData();
  }
);
function init() {
  getAroundFacilitiesOptions();
  getTags();
  getTableData();
}
onMounted(() => {
  init();
});
// 初始化
</script>
<script></script>

<style scoped></style>
