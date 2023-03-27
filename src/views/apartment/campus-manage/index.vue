<script setup lang="tsx">
import { onMounted, ref, reactive, watch, nextTick } from 'vue';
import { NSpace, NPopconfirm, NButton, NCard } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import { cloneDeep } from 'lodash-es';
import CommonTable from '~/src/components/common/CommonTable/index.vue';
import { getInstanceName } from '~/src/utils/common';
import { addCampus, fetchCampusList, removeCampus, modifyCampus, fetchCountry, fetchCity } from '~/src/service/api';
import { useForm } from '~/src/hooks';
import { EnumMModalType } from '~/src/enum';

const table = ref<typeof CommonTable | null>(null);
const data = ref<Apartment.Campus[] | undefined>([]);
const countryOptions = ref<CountryAndCity[]>([]);
const cityOptions = ref<CountryAndCity[]>([]);
const filteredCityOptions = ref<CountryAndCity[]>([]);
const pageInfo = reactive<PageParams>({
  pageNumber: 1,
  pageSize: 10
});
const searchParam = ref();
const searchModel = ref({
  chineseName: '',
  originalName: ''
});

const handleSearch = () => {
  searchParam.value = {
    ...searchModel.value
  };
  freshList();
};
const handleResetSearch = () => {
  searchModel.value = {
    chineseName: '',
    originalName: ''
  };
  searchParam.value = {
    ...searchModel.value
  };
  freshList();
};
const params = [
  {
    title: '原名称',
    key: 'originalName'
  },
  {
    title: '中文名称',
    key: 'chineseName'
  },
  {
    title: '经度',
    key: 'gisInfo.longitude'
  },
  {
    title: '纬度',
    key: 'gisInfo.latitude'
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
  async update(row: Apartment.Campus) {
    clearFormModel();
    table.value?.handleModalShow(`修改${name}`, EnumMModalType.modify);
    modalLoading.value = true;
    formModel.value = cloneDeep(row);
    nextTick(() => {
      formModel.value.cityId = row.cityId;
    });

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
  const res = await fetchCampusList(pageInfo, searchParam.value);
  data.value = res.data?.list;
  totalCount.value = res.data?.total as number;

  loading.value = false;
};
const { formModel, clearFormModel } = useForm<Apartment.Campus>({ gisInfo: {}, cityId: null, countryId: null });

const handleClearForm = () => {
  clearFormModel();
};
const name = getInstanceName('校区管理');
const loading = ref(false);
const handleCommit = async (modalType: number) => {
  if (modalType === EnumMModalType.add) {
    await addCampus(formModel.value);
    // message.success('新增成功');
  } else {
    await modifyCampus(formModel.value);
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
watch(
  () => formModel.value.countryId,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      formModel.value.cityId = null;
      filteredCityOptions.value = cityOptions.value.filter(item => {
        return item.countryId === newValue;
      });
    }
  }
);
watch(pageInfo, () => {
  freshList();
});
onMounted(() => {
  // 请求
  freshList();
  fetchCountry().then(countryRes => {
    countryOptions.value = countryRes.data?.list || [];
  });
  fetchCity().then(cityRes => {
    cityOptions.value = cityRes.data?.list || [];
  });
  // console.log('答案', formModel);
});
</script>
<script></script>

<template>
  <n-card title="校区管理" :bordered="false" class="rounded-16px shadow-sm hfull">
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
      <template #searchPart>
        <n-space class="pb-12px" justify="space-between">
          <n-form ref="formRef" :model="searchModel" label-placement="left">
            <n-grid :cols="24" :x-gap="18">
              <n-form-item-grid-item :span="6" label="校区中文名">
                <n-input v-model:value="searchModel.chineseName" placeholder="请输入" />
              </n-form-item-grid-item>
              <n-form-item-grid-item :span="6" label="校区原名">
                <n-input v-model:value="searchModel.originalName" placeholder="请输入" />
              </n-form-item-grid-item>
              <n-form-item-grid-item :span="6">
                <n-button type="primary" @click="handleSearch"> 搜索 </n-button>
                <n-button class="ml-6" @click="handleResetSearch"> 重置 </n-button>
              </n-form-item-grid-item>
            </n-grid>
          </n-form>
        </n-space>
      </template>

      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="12" label="原名称" path="originName">
          <n-input v-model:value="formModel.originalName" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="中文名称" path="chineseName">
          <n-input v-model:value="formModel.chineseName" />
        </n-form-item-grid-item>
      </n-grid>
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="24" label="国家与城市" path="">
          <n-select
            v-model:value="formModel.countryId"
            label-field="chineseName"
            value-field="id"
            filterable
            placeholder="选择国家"
            :options="countryOptions"
          />
          <n-select
            v-model:value="formModel.cityId"
            style="margin-left: 10px"
            label-field="chineseName"
            value-field="id"
            filterable
            placeholder="选择城市"
            :options="filteredCityOptions"
          />
        </n-form-item-grid-item>
      </n-grid>
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="12" label="经度" path="gisInfo.longitude">
          <n-input v-model:value="formModel.gisInfo.longitude" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="维度" path="gisInfo.latitude">
          <n-input v-model:value="formModel.gisInfo.latitude" />
        </n-form-item-grid-item>
      </n-grid>
    </CommonTable>
  </n-card>
</template>
