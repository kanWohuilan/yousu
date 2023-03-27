<script setup lang="tsx">
import { onMounted, ref, reactive, watch } from 'vue';
import { NSpace, NPopconfirm, NButton, NCard, NImage } from 'naive-ui';
import type { DataTableColumns, UploadFileInfo } from 'naive-ui';
import { cloneDeep } from 'lodash';
import CommonTable from '~/src/components/common/CommonTable/index.vue';
import { getInstanceName } from '~/src/utils/common';
import { addIndexImage, fetchIndexImage, removeIndexImage, modifyIndexImage } from '~/src/service/api';
import { useForm } from '~/src/hooks';
import { EnumMModalType } from '~/src/enum';

const table = ref<typeof CommonTable | null>(null);
const data = ref<IndexImg[] | undefined>([]);
const pageInfo = reactive<PageParams>({
  pageNumber: 1,
  pageSize: 10
});

const params = [
  {
    title: '顺序',
    key: 'orderIndex'
  },
  {
    title: '图片',
    key: 'pictureUrl',
    render(row: IndexImg) {
      return <NImage width="100" src={row.pictureUrl} />;
    }
  },
  {
    title: '链接',
    key: 'url'
  }
];
const createColumns = ({
  update,
  remove
}: {
  update: (row: IndexImg) => void;
  remove: (row: IndexImg) => void;
}): DataTableColumns<IndexImg> => {
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
  async update(row: IndexImg) {
    clearFormModel();
    table.value?.handleModalShow(`修改${name}`, EnumMModalType.modify);
    modalLoading.value = true;
    formModel.value = cloneDeep(row);
    previewFileList.value = [
      {
        id: '1',
        name: 'picture',
        status: 'finished',
        url: formModel.value.pictureUrl
      }
    ];
    modalLoading.value = false;
  },
  async remove(row: IndexImg) {
    await removeIndexImage(row.id as string);
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
  const res = await fetchIndexImage(pageInfo);
  // console.log(res);
  data.value = res.data?.list;
  totalCount.value = res.data?.total as number;

  loading.value = false;
};
const { formModel, clearFormModel } = useForm<IndexImg>({ pictureUrl: '', orderIndex: '0', url: '' });
const handleClearForm = () => {
  previewFileList.value = [];
  clearFormModel();
};
const name = getInstanceName('首页轮播图管理');
const loading = ref(false);
const handleCommit = async (modalType: number) => {
  if (modalType === EnumMModalType.add) {
    await addIndexImage(formModel.value);
    // message.success('新增成功');
  } else {
    await modifyIndexImage(formModel.value);
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
  freshList();
});

const showPictureModal = ref(false);
const previewImageUrl = ref('');
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
</script>
<script lang="ts"></script>

<template>
  <n-card :title="name + '管理'" :bordered="false" class="rounded-16px shadow-sm hfull">
    <CommonTable
      ref="table"
      :columns="columns"
      :table-data="data"
      :total-count="totalCount"
      :loading="loading"
      :modal-loading="modalLoading"
      :name="name"
      :add-btn-display="true"
      @page-size-change="handlePageSizeUpdate"
      @page-change="handlePageUpdate"
      @clearform="handleClearForm"
      @commit="handleCommit"
    >
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="24" label="公寓图片" path="pictureUrls">
          <n-upload
            action="http://124.221.252.113:19008/yousu-admin/api/file/upload?fileType=IMAGE"
            :default-file-list="previewFileList"
            list-type="image-card"
            :max="1"
            @preview="handlePicturePreview"
            @remove="handlePictureRemove"
            @finish="handlePictureFinish"
            @before-upload="beforePictureUpload"
          />
        </n-form-item-grid-item>
      </n-grid>
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="12" label="链接" path="order">
          <n-input v-model:value="formModel.url" />
        </n-form-item-grid-item>
      </n-grid>
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="12" label="顺序" path="order">
          <n-input-number v-model:value="formModel.orderIndex" :min="0" />
        </n-form-item-grid-item>
      </n-grid>
      <div class="notice">注意:数字越小排位越前</div>
    </CommonTable>
    <n-modal v-model:show="showPictureModal" preset="card" style="width: 600px" title="预览">
      <img :src="previewImageUrl" style="width: 100%" />
    </n-modal>
  </n-card>
</template>

<style scoped>
.notice {
  font-size: 12px;
  position: relative;
  top: -20px;
  color: coral;
}
</style>
