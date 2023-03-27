<script setup lang="tsx">
import { onMounted, ref, reactive, watch } from 'vue';
import { NSpace, NButton, NCard } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import CommonTable from '~/src/components/common/CommonTable/index.vue';
import { getInstanceName } from '~/src/utils/common';
import { fetchsubletHouseList, disLaunchSublet } from '~/src/service/api';
import { useBoolean } from '~/src/hooks';
import SubletHouseDetail from './components/SubletHouseDetail.vue';

const table = ref<typeof CommonTable | null>(null);
const data = ref<Apartment.Campus[] | undefined>([]);
const { bool: showDetailModal, setTrue: openDetialModal, setFalse: closeDetailModal } = useBoolean();

const pageInfo = reactive<PageParams>({
  pageNumber: 1,
  pageSize: 10
});

// const message = useMessage();
const params = [
  {
    title: '公寓名称',
    key: 'apartmentName'
  },
  {
    title: '公寓房型名称',
    key: 'apartmentHouseName'
  },
  {
    title: '转租开始时间',
    key: 'beginTime'
  },
  {
    title: '转租结束时间',
    key: 'endTime'
  },
  {
    title: '转租人手机号',
    key: 'phoneNumber'
  },
  {
    title: '状态',
    key: 'status',
    render(row: Apartment.SubletHouse) {
      return row.status.name;
    }
  }
];
const applyId = ref();
const createColumns = (): DataTableColumns<Apartment.SubletHouse> => {
  return [
    ...params,
    {
      title: '操作',
      key: 'actions',
      width: 150,
      render(row) {
        return (
          <NSpace justify={'center'}>
            <NButton
              size={'small'}
              onClick={() => {
                applyId.value = row.id;
                openDetialModal();
              }}
            >
              详情
            </NButton>
            <NButton
              type="error"
              size={'small'}
              onClick={async () => {
                // applyId.value = row.id;
                if (row.id) await disLaunchSublet(row.id);
                await freshList();
              }}
            >
              下架
            </NButton>
          </NSpace>
        );
      }
    }
  ];
};

const columns = createColumns();
const totalCount = ref(0);
const freshList = async () => {
  loading.value = true;
  const res = await fetchsubletHouseList(pageInfo);
  data.value = res.data?.list;
  totalCount.value = res.data?.total as number;
  loading.value = false;
};

const name = getInstanceName('租房申请管理');
const loading = ref(false);

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

<script lang="ts" setup></script>
<template>
  <n-card title="租房申请" :bordered="false" class="rounded-16px shadow-sm hfull">
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
    </CommonTable>
    <n-modal
      v-model:show="showDetailModal"
      preset="card"
      title="详情"
      style="width: 750px"
      :mask-closable="false"
      :closable="true"
      :on-close="closeDetailModal"
    >
      <SubletHouseDetail :apply-id="applyId" />
    </n-modal>
  </n-card>
</template>
