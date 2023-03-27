<script setup lang="tsx">
import { onMounted, ref, reactive, watch } from 'vue';
import { NSpace, NPopconfirm, NButton, NCard } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import { cloneDeep } from 'lodash';
import CommonTable from '~/src/components/common/CommonTable/index.vue';
import { getInstanceName } from '~/src/utils/common';
import { fetchSignOrderList, removeCampus } from '~/src/service/api';
import { useForm } from '~/src/hooks';
import { EnumMModalType } from '~/src/enum';

const table = ref<typeof CommonTable | null>(null);
const data = ref<Apartment.Campus[] | undefined>([]);
const pageInfo = reactive<PageParams>({
  pageNumber: 1,
  pageSize: 10
});
const searchModel = ref({
  salesStaff: ''
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
    salesStaff: ''
  };
  searchParam.value = {
    ...searchModel.value
  };
  freshList();
};
const params = [
  {
    title: '中文名',
    key: 'customerChineseName'
  },
  {
    title: '护照-名',
    key: 'customerPassportFirstName'
  },
  {
    title: '护照-姓',
    key: 'customerPassportLastName'
  },
  {
    title: '出生日期',
    key: 'customerBirthday'
  },
  {
    title: '性别',
    key: 'customerGender'
  },
  {
    title: '开始时间',
    key: 'beginTime'
  },
  {
    title: '结束时间',
    key: 'endTime'
  },
  {
    title: '成交价格',
    key: 'weeklyPrice'
  },
  {
    title: '销售人员',
    key: 'salesStaff'
  },
  {
    title: '签约日期',
    key: 'signDate'
  }
];
const createColumns = ({
  update,
  remove
}: {
  update: (row: Apartment.Campus) => void;
  remove: (row: Apartment.Campus) => void;
}): DataTableColumns<Apartment.Campus> => {
  return [
    ...params,
    {
      title: '操作',
      key: 'actions',
      width: 150,
      render(row) {
        return (
          <NSpace justify={'center'}>
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
  async update(row: Apartment.Campus) {
    clearFormModel();
    table.value?.handleModalShow(`修改${name}`, EnumMModalType.modify);
    modalLoading.value = true;
    // eslint-disable-next-line no-warning-comments
    // TODO 接口中gisInfo有问题
    // const res = await fetchCampusDetails(row.id as string);
    formModel.value = cloneDeep(row);
    modalLoading.value = false;
  },
  async remove(row: Apartment.Campus) {
    await removeCampus(row.id as string);
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
  const res = await fetchSignOrderList(pageInfo, searchModel.value);
  data.value = res.data?.list;
  totalCount.value = res.data?.total as number;

  loading.value = false;
};
const { formModel, clearFormModel } = useForm<Apartment.Campus>({});

const name = getInstanceName('签约管理');
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
  <n-card title="签约管理" :bordered="false" class="rounded-16px shadow-sm hfull">
    <CommonTable
      ref="table"
      :columns="columns"
      :table-data="data"
      :total-count="totalCount"
      :loading="loading"
      :modal-loading="modalLoading"
      :name="name"
      :add-btn-display="false"
      @page-size-change="handlePageSizeUpdate"
      @page-change="handlePageUpdate"
    >
      <template #searchPart>
        <n-space class="pb-12px" justify="space-between">
          <n-form ref="formRef" :model="searchModel" label-placement="left">
            <n-grid :cols="24" :x-gap="18">
              <n-form-item-grid-item :span="6" label="销售人员">
                <n-input v-model:value="searchModel.salesStaff" placeholder="请输入" />
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
  </n-card>
</template>
