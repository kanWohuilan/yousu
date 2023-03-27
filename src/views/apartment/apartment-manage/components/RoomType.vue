<script setup lang="tsx">
import { onMounted, ref, reactive, watch } from 'vue';
import { NSpace, NPopconfirm, NButton, NCard } from 'naive-ui';
import type { DataTableColumns, UploadFileInfo } from 'naive-ui';
import { cloneDeep } from 'lodash';
import CommonTable from '~/src/components/common/CommonTable/index.vue';
import { getInstanceName } from '~/src/utils/common';
import {
  addApartmentHouse,
  fetchApartmentHouseDetails,
  fetchApartmentHouseList,
  getCurrency,
  getHouseTypeList,
  getIndoorFacilityList,
  modifyApartmentHouse,
  removeApartmentHouse
} from '~/src/service/api';
import { useForm } from '~/src/hooks';
import { EnumMModalType } from '~/src/enum';

interface PropsType {
  apartmentId: string;
}

const name = getInstanceName('房型管理');
const props = defineProps<PropsType>();

const loading = ref(false);
const pageInfo = reactive<PageParams>({
  pageNumber: 1,
  pageSize: 10
});
const previewFileList = ref<UploadFileInfo[]>([]);
const showPictureModal = ref(false);
const previewImageUrl = ref('');

function handlePicturePreview(file: UploadFileInfo) {
  const { url } = file;
  previewImageUrl.value = url as string;
  showPictureModal.value = true;
}

const { formModel, clearFormModel } = useForm<Apartment.ApartmentHouse>({
  apartmentId: props.apartmentId,
  houseTypeId: '',
  pictureUrls: [],
  currency: { code: '' },
  indoorFacilities: []
});

function handlePictureRemove(options: { file: UploadFileInfo; fileList: Array<UploadFileInfo> }) {
  if (options.file) {
    const { url } = options.file;
    const index = formModel.value.pictureUrls.indexOf(url as string);
    if (index > -1) {
      formModel.value.pictureUrls.splice(index, 1);
    }
  }
}

function handlePictureFinish(options: { file: UploadFileInfo; event?: ProgressEvent }) {
  if (options.event) {
    const response = (options.event.target as XMLHttpRequest).response;
    formModel.value.pictureUrls.push(JSON.parse(response).url);
  }
}

function beforePictureUpload(options: { file: UploadFileInfo; fileList: UploadFileInfo[] }) {
  const fileType = options.file?.type;
  if (fileType !== 'image/png' && fileType !== 'image/jpeg' && fileType !== 'image/bmp' && fileType !== 'image/gif') {
    window.$message?.error('只能上传png、jpg、bmp、gif格式的图片文件，请重新上传');
    return false;
  }
  return true;
}

const data = ref<Apartment.ApartmentHouse[] | undefined>([]);
const totalCount = ref(0);
const currencyOptions = ref<Apartment.Currency[]>([]);
const indoorFacilitiesOptions = ref<Apartment.IndoorFacility[]>([]);
const houseTypeOptions = ref<Apartment.HouseType[]>([]);

const freshList = async () => {
  loading.value = true;
  const res = await fetchApartmentHouseList(props.apartmentId, pageInfo);
  data.value = res.data?.list;
  totalCount.value = res.data?.total as number;

  loading.value = false;
};

async function getCurrencies() {
  const res = await getCurrency();
  if (res.data) currencyOptions.value = res.data;
}

function handleCurrencyUpdateValue(value: string, option: Apartment.Currency[]) {
  console.log(`value: ${JSON.stringify(value)}`);
  console.log(`option: ${JSON.stringify(option)}`);
}

function handleFacilitiesUpdateValue(value: string, option: Apartment.IndoorFacility[]) {
  console.log(`value: ${JSON.stringify(value)}`);
  console.log(`option: ${JSON.stringify(option)}`);
}

const table = ref<typeof CommonTable | null>(null);

async function getIndoorFacilityOptions() {
  const res = await getIndoorFacilityList();
  if (res.data) {
    indoorFacilitiesOptions.value = res.data.list;
  }
}

async function getHouseTypeOptions() {
  const res = await getHouseTypeList();
  if (res.data) {
    houseTypeOptions.value = res.data.list;
  }
}

const params: DataTableColumns<Apartment.ApartmentHouse> = [
  {
    key: 'houseTypeId',
    title: '房型',
    align: 'center',
    render: row => {
      let typeName = '';
      houseTypeOptions.value.forEach(item => {
        if (item.id === row.houseTypeId) {
          typeName = item.typeName;
        }
      });
      return typeName;
    }
  },
  {
    title: '最低周租金',
    key: 'weeklyPrice'
  },
  {
    key: 'currency',
    title: '币种',
    align: 'center',
    render: row => {
      return (row.currency as Apartment.Currency)?.name;
    }
  },
  {
    key: 'indoorFacilities',
    title: '室内设施',
    align: 'center',
    render: row => {
      const indoorFacilities: string[] = row.indoorFacilities;
      const indoorFacilitiesName: string[] = [];
      indoorFacilities?.forEach(indoorId => {
        return indoorFacilitiesOptions.value.forEach(item => {
          if (item.id === indoorId) {
            return indoorFacilitiesName.push(item.name);
          }
          return undefined;
        });
      });
      return indoorFacilitiesName.map(item => {
        return <n-tag> {item} </n-tag>;
      });
    }
  },
  {
    title: '所在楼层',
    key: 'floors'
  }
];
const createColumns = ({
  update,
  remove
}: {
  update: (row: Apartment.ApartmentHouse) => void;
  remove: (row: Apartment.ApartmentHouse) => void;
}): DataTableColumns<Apartment.ApartmentHouse> => {
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
  async update(row: Apartment.ApartmentHouse) {
    clearFormModel();
    table.value?.handleModalShow(`修改${name}`, EnumMModalType.modify);
    modalLoading.value = true;
    const res = await fetchApartmentHouseDetails(row.id as string);
    const uploadFiles: UploadFileInfo[] = [];
    if (res.data) {
      res.data.pictureUrls?.every((pictureUrl: string) => {
        return uploadFiles.push({
          url: pictureUrl,
          status: 'finished'
        } as UploadFileInfo);
      });
    }
    formModel.value = cloneDeep(res.data);
    previewFileList.value = uploadFiles;
    modalLoading.value = false;
  },
  async remove(row: Apartment.ApartmentHouse) {
    await removeApartmentHouse(row.id as string);
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

const handleClearForm = () => {
  clearFormModel();
};
const handleCommit = async (modalType: number) => {
  if (modalType === EnumMModalType.add) {
    await addApartmentHouse(formModel.value);
    // message.success('新增成功');
  } else {
    await modifyApartmentHouse(formModel.value);
    // message.success('更新成功');
  }
  table.value?.handleModalClose();
  await freshList();
};
const handlePageSizeUpdate = (pageSize: number) => {
  pageInfo.pageSize = pageSize;
};
const handlePageUpdate = (page: number) => {
  pageInfo.pageNumber = page;
};
watch(pageInfo, () => {
  freshList();
});
onMounted(() => {
  // 请求
  getIndoorFacilityOptions();
  getHouseTypeOptions();
  getCurrencies();
  freshList();
});
</script>

<template>
  <n-card :bordered="false" class="rounded-16px shadow-sm hfull">
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
        <n-form-item-grid-item :span="24" label="房型" path="indoorFacilities">
          <n-select
            v-model:value="formModel.houseTypeId"
            label-field="typeName"
            value-field="id"
            :options="houseTypeOptions"
          />
        </n-form-item-grid-item>
      </n-grid>
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="24" label="公寓图片" path="pictureUrls">
          <n-upload
						action="http://124.221.252.113:19008/yousu-admin/api/file/upload?fileType=IMAGE"
            :default-file-list="previewFileList"
            list-type="image-card"
            @preview="handlePicturePreview"
            @remove="handlePictureRemove"
            @finish="handlePictureFinish"
            @before-upload="beforePictureUpload"
          />
          <n-modal v-model:show="showPictureModal" preset="card" style="width: 600px" title="预览">
            <img :src="previewImageUrl" style="width: 100%" />
          </n-modal>
        </n-form-item-grid-item>
      </n-grid>
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="12" label="最低周租金" path="weeklyPrice">
          <n-input-number v-model:value="formModel.weeklyPrice" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="币种" path="currency">
          <n-select
            v-model:value="formModel.currency.code"
            label-field="name"
            value-field="code"
            :options="currencyOptions"
            @update:value="handleCurrencyUpdateValue"
          />
        </n-form-item-grid-item>
      </n-grid>
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="24" label="室内设施" path="indoorFacilities">
          <n-select
            v-model:value="formModel.indoorFacilities"
            label-field="name"
            value-field="id"
            multiple
            :options="indoorFacilitiesOptions"
            @update:value="handleFacilitiesUpdateValue"
          />
        </n-form-item-grid-item>
      </n-grid>
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="24" label="所在楼层" path="indoorFacilities">
          <n-input v-model:value="formModel.floors" />
        </n-form-item-grid-item>
      </n-grid>
    </CommonTable>
  </n-card>
</template>
