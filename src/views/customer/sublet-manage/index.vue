<script setup lang="tsx">
import { onMounted, ref, reactive, watch } from 'vue';
import { NSpace, NButton, NCard } from 'naive-ui';
import type { DataTableColumns, UploadFileInfo } from 'naive-ui';
import CommonTable from '~/src/components/common/CommonTable/index.vue';
import { getInstanceName } from '~/src/utils/common';
import { fetchSubletHouseApplyList, modifyPicture, aggreeApply, rejectApply } from '~/src/service/api';
import { useBoolean, useForm } from '~/src/hooks';
import SubletApplyingDetail from './components/SubletApplyingDetail.vue';

const table = ref<typeof CommonTable | null>(null);
const data = ref<Apartment.Campus[] | undefined>([]);
const { bool: showDetailModal, setTrue: openDetialModal, setFalse: closeDetailModal } = useBoolean();
const { bool: showEditModal, setTrue: openEditModal, setFalse: closeEditModal } = useBoolean();
const { bool: showMarkModal, setTrue: openMarkModal, setFalse: closeMarkModal } = useBoolean();

const statusOptions = [
  { label: '驳回', value: 'REJECT', color: 'error' },
  { label: '审核通过', value: 'AGREE', color: 'success' },
  { label: '待处理', value: 'APPLYING', color: 'warning' }
];

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
    title: '手机号',
    key: 'phoneNumber'
  },
  {
    title: '转租状态',
    key: 'status',
    render(row: Customer.SubletHouseApply) {
      const slectedStatus = statusOptions.filter(item => {
        return item.value === row.status;
      })[0];

      return <n-tag type={slectedStatus.color}>{slectedStatus.label}</n-tag>;
    }
  },
  {
    title: '处理人名称',
    key: 'handlePersonName'
  }
];
const applyId = ref();
const createColumns = (): DataTableColumns<Customer.SubletHouseApply> => {
  return [
    ...params,
    {
      title: '操作',
      key: 'actions',
      align: 'center',
      width: 250,
      render(row) {
        const editBtn = (
          <NButton
            type="info"
            size={'small'}
            onClick={() => {
              formModel.value.id = row.id;
              previewFileList.value = [];
              row.pictureUrls?.forEach((pic, index) => {
                previewFileList.value.push({
                  id: `${index}`,
                  name: 'picture',
                  status: 'finished',
                  url: pic
                });
              });
              if (row.pictureUrls) formModel.value.pictureUrls.push(...row.pictureUrls);
              openEditModal();
            }}
          >
            编辑
          </NButton>
        );
        const passBtn = (
          <NButton
            type="primary"
            size={'small'}
            onClick={async () => {
              if (row.id) await aggreeApply(row.id);
              freshList();
            }}
          >
            审核通过
          </NButton>
        );
        const notPassedBtn = (
          <NButton
            type="error"
            size={'small'}
            onClick={() => {
              markFormModel.value.id = row.id;
              openMarkModal();
            }}
          >
            驳回
          </NButton>
        );
        const btns = [];
        switch (row.status) {
          case 'REJECT':
            btns.push(editBtn);
            break;
          case 'AGREE':
            btns.push(editBtn);
            break;
          case 'APPLYING':
            btns.push(editBtn, passBtn, notPassedBtn);
            break;
          default:
        }
        return (
          <NSpace justify={'center'}>
            {btns}
            <NButton
              size={'small'}
              onClick={() => {
                applyId.value = row.id;
                openDetialModal();
              }}
            >
              详情
            </NButton>
          </NSpace>
        );
      }
    }
  ];
};
const { formModel, clearFormModel } = useForm({ id: '', pictureUrls: [] });
const { formModel: markFormModel, clearFormModel: clearMarkFormModel } = useForm({ id: '', handleRemark: '' });

const columns = createColumns();
const totalCount = ref(0);
const freshList = async () => {
  loading.value = true;
  const res = await fetchSubletHouseApplyList(pageInfo);
  data.value = res.data?.list;
  totalCount.value = res.data?.total as number;
  loading.value = false;
};

const showPictureModal = ref(false);
const previewImageUrl = ref('');
const previewFileList = ref<UploadFileInfo[]>([]);

function handlePicturePreview(file: UploadFileInfo) {
  const { url } = file;
  previewImageUrl.value = url as string;
  showPictureModal.value = true;
}

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

const name = getInstanceName('转租申请管理');
const loading = ref(false);

const handlePageSizeUpdate = (pageSize: number) => {
  pageInfo.pageSize = pageSize;
  // console.log(pageSize);
};
const handlePageUpdate = (page: number) => {
  pageInfo.pageNumber = page;
};
const handleEditCancel = () => {
  closeEditModal();
  clearFormModel();
};

const handleSubmit = async () => {
  await modifyPicture(formModel.value);
  closeEditModal();
  freshList();
  clearFormModel();
};
const handleMarkCancel = () => {
  closeMarkModal();
  clearMarkFormModel();
};

const handleMarkSubmit = async () => {
  await rejectApply({ id: markFormModel.value.id, handleRemark: markFormModel.value.handleRemark });
  await freshList();
  clearMarkFormModel();
  closeMarkModal();
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
  <n-card title="转租申请" :bordered="false" class="rounded-16px shadow-sm hfull">
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
      v-model:show="showEditModal"
      preset="card"
      title="修改图片"
      style="width: 750px"
      :mask-closable="false"
      :closable="true"
      :on-close="handleEditCancel"
    >
      <n-form>
        <n-form-item :span="24" label="公寓图片" path="pictureUrls">
          <n-upload
            action="http://124.221.252.113:19008/yousu-admin/api/file/upload?fileType=IMAGE"
            :default-file-list="previewFileList"
            list-type="image-card"
            @preview="handlePicturePreview"
            @remove="handlePictureRemove"
            @finish="handlePictureFinish"
            @before-upload="beforePictureUpload"
          />
        </n-form-item>
      </n-form>
      <n-space justify="end">
        <n-button type="primary" @click="handleSubmit">确定</n-button>
        <n-button @click="handleEditCancel">取消</n-button>
      </n-space>
    </n-modal>
    <n-modal
      v-model:show="showDetailModal"
      preset="card"
      title="详情"
      style="width: 750px"
      :mask-closable="false"
      :closable="true"
      :on-close="closeDetailModal"
    >
      <SubletApplyingDetail :apply-id="applyId" />
    </n-modal>
    <n-modal
      v-model:show="showMarkModal"
      preset="card"
      title="驳回备注"
      style="width: 750px"
      :mask-closable="false"
      :closable="true"
      :on-close="handleMarkCancel"
    >
      <n-form>
        <n-form-item :span="24" label="备注" path="pictureUrls">
          <n-input v-model:value="markFormModel.handleRemark" type="textarea" />
        </n-form-item>
      </n-form>
      <n-space justify="end">
        <n-button type="primary" @click="handleMarkSubmit">确定</n-button>
        <n-button @click="handleMarkCancel">取消</n-button>
      </n-space>
    </n-modal>
  </n-card>
</template>
