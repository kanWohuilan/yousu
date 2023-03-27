<script setup lang="tsx">
import { onMounted, ref, reactive, watch } from "vue";
import { NSpace, NPopconfirm, NButton, NCard, NUpload } from "naive-ui";
import { cloneDeep } from "lodash";
import type { DataTableColumns, UploadFileInfo } from 'naive-ui';
import CommonTable from "~/src/components/common/CommonTable/index.vue";
import { getInstanceName } from "~/src/utils/common";
import {
  fetchCountry,
  addCountry,
  modifyCountry,
  removeCountry,
} from "~/src/service/api";
import { useBoolean, useForm } from "~/src/hooks";
import { EnumMModalType } from "~/src/enum";
import CityManage from "./components/CityManage.vue";

const table = ref<typeof CommonTable | null>(null);
const currentSelectCountry = ref<CountryAndCity>({});
const data = ref<CountryAndCity[] | undefined>([]);
const {
  bool: showCityModal,
  setFalse: closeCityModal,
  setTrue: openCityShow,
} = useBoolean(false);

const pageInfo = reactive<PageParams>({
  pageNumber: 1,
  pageSize: 10,
});

const params = [
  {
    title: "原名",
    key: "originalName",
  },
  {
    title: "中文名",
    key: "chineseName",
  },
];
const createColumns = ({
  update,
  remove,
  updateCity,
}: {
  update: (row: CountryAndCity) => void;
  remove: (row: CountryAndCity) => void;
  updateCity: (row: CountryAndCity) => void;
}): DataTableColumns<CountryAndCity> => {
  return [
    ...params,
    {
      title: "操作",
      key: "actions",
      width: 240,
      render(row) {
        return (
          <NSpace justify={"center"}>
            <NButton type="info" size={"small"} onClick={() => update(row)}>
              编辑
            </NButton>
            <NButton type="info" size={"small"} onClick={() => updateCity(row)}>
              编辑城市
            </NButton>
            <NPopconfirm onPositiveClick={() => remove(row)}>
              {{
                default: () => "确认删除",
                trigger: () => (
                  <NButton type="error" size={"small"}>
                    删除
                  </NButton>
                ),
              }}
            </NPopconfirm>
          </NSpace>
        );
      },
    },
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
  async remove(row: CountryAndCity) {
    await removeCountry(row.id as string);
    // message.success('删除成功');
    const restCount = (totalCount.value - 1) % pageInfo.pageSize;
    let tempPageNum = (totalCount.value - 1 - restCount) / pageInfo.pageSize;
    if (restCount > 0) tempPageNum += 1;
    if (pageInfo.pageNumber > 1 && tempPageNum < pageInfo.pageNumber) {
      pageInfo.pageNumber = tempPageNum;
    } else {
      await freshList();
    }
  },
  async updateCity(row) {
    currentSelectCountry.value = row;
    openCityShow();
  },
});
const totalCount = ref(0);
const freshList = async () => {
  loading.value = true;
  const res = await fetchCountry(pageInfo);
  data.value = res.data?.list;
  totalCount.value = res.data?.total as number;

  loading.value = false;
};
const { formModel, clearFormModel } = useForm<CountryAndCity>({});
const handleClearForm = () => {
  clearFormModel();
};
const name = getInstanceName("国家管理");
const loading = ref(false);
const showPictureModal = ref(false);
const previewImageUrl = ref('');
const handleCommit = async (modalType: number) => {
  if (modalType === EnumMModalType.add) {
    await addCountry(formModel.value);
    // message.success('新增成功');
  } else {
    await modifyCountry(formModel.value);
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
const previewFileList = ref<UploadFileInfo[]>([]);
  function handlePicturePreview(file: UploadFileInfo) {
  // console.log('ddd', file);
  showPictureModal.value = true;
}

function handlePictureRemove(options: { file: UploadFileInfo; fileList: Array<UploadFileInfo> }) {
  if (options.file) {
    formModel.value.pictureUrl = '';
  }
}

function handlePictureFinish(options: { file: UploadFileInfo; event?: ProgressEvent }) {
  if (options.event) {
    const response = (options.event.target as XMLHttpRequest).response;
    formModel.value.pictureUrl = JSON.parse(response).url;
    previewImageUrl.value = JSON.parse(response).url;
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
// const searchModel = ref({
//   salesStaff: ''
// });
// const searchParam = ref();

// const handleSearch = () => {
//   searchParam.value = {
//     ...searchModel.value
//   };
//   freshList();
// };
// const handleResetSearch = () => {
//   searchModel.value = {
//     salesStaff: ''
//   };
//   searchParam.value = {
//     ...searchModel.value
//   };
//   freshList();
// };
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
  <n-card title="国家与城市管理" :bordered="false" class="rounded-16px shadow-sm hfull">
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
        <n-form-item-grid-item :span="12" label="原名" path>
          <n-input v-model:value="formModel.originalName" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="中文名" path>
          <n-input v-model:value="formModel.chineseName" />
        </n-form-item-grid-item>
      </n-grid>
    </CommonTable>
    <n-modal
      v-model:show="showCityModal"
      preset="card"
      :title="currentSelectCountry?.chineseName + '城市'"
      style="width: 70%"
      :mask-closable="false"
      :closable="true"
      :on-close="
        () => {
          closeCityModal();
        }
      "
    >
      <CityManage :country-id="currentSelectCountry?.id || ''"></CityManage>
    </n-modal>
  </n-card>
</template>
