<script setup lang="tsx">
import { onMounted, ref, reactive, watch } from 'vue';
import { NSpace, NButton, NCard } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import dayjs from 'dayjs';
import CommonTable from '~/src/components/common/CommonTable/index.vue';
import { getInstanceName } from '~/src/utils/common';
import { fetchHouseApplyList, dispatchHanldePerson, unSignHandle, signHandle, fetchUserList } from '~/src/service/api';
import { useBoolean } from '~/src/hooks';
import HouseApplyDetail from './components/HouseApplyDetail.vue';

const table = ref<typeof CommonTable | null>(null);
const data = ref<Apartment.Campus[] | undefined>([]);
const userList = ref<Auth.UserInfo[]>([]);
const pageInfo = reactive<PageParams>({
  pageNumber: 1,
  pageSize: 10
});
const { bool: showDispatchModal, setFalse: closeDispatchModal, setTrue: openDispatchModal } = useBoolean(false);
const { bool: showSignModal, setFalse: closeSignModal, setTrue: openSignModal } = useBoolean(false);
const { bool: showUnsignModal, setFalse: closeUnsignModal, setTrue: openUnsignModal } = useBoolean(false);
const { bool: showDetailModal, setTrue: openDetialModal, setFalse: closeDetailModal } = useBoolean();

// const message = useMessage();
const params = [
  {
    title: '公寓名称',
    key: 'apartmentName'
  },
  {
    title: '中文名',
    key: 'chineseName'
  },
  {
    title: '护照-名',
    key: 'passportFirstName'
  },
  {
    title: '护照-姓',
    key: 'passportLastName'
  },
  {
    title: '出生日期',
    key: 'birthday'
  },
  {
    title: '性别',
    key: 'gender'
  },
  {
    title: '手机号码',
    key: 'phoneNumber'
  },
  {
    title: '邮箱',
    key: 'email'
  },
  {
    title: '申请状态',
    key: 'status.name'
  },
  {
    title: '处理人',
    key: 'handlePersonName'
  }
];
const applyId = ref();
const createColumns = (): DataTableColumns<Customer.HouseApply> => {
  return [
    ...params,
    {
      title: '操作',
      key: 'actions',
      width: 150,
      render(row) {
        const signBtn = (
          <NButton
            type="info"
            size={'small'}
            onClick={() => {
              signFormModel.value.id = row.id;
              signFormModel.value.customerPhoneNumber = row.phoneNumber;

              openSignModal();
            }}
          >
            签约
          </NButton>
        );
        const unSignBtn = (
          <NButton
            type="error"
            size={'small'}
            onClick={() => {
              unsignFormModel.value.id = row.id;
              openUnsignModal();
            }}
          >
            未签约
          </NButton>
        );
        const dispatchBtn = (
          <NButton
            size={'small'}
            onClick={() => {
              dispatchFormModel.value.id = row.id;
              openDispatchModal();
            }}
          >
            分配处理人
          </NButton>
        );
        const btns = [];
        switch ((row.status as Customer.Status).code) {
          case 'UN_HANDLE':
            btns.push(dispatchBtn);
            break;
          case 'HANDLING':
            btns.push(signBtn, unSignBtn);
            break;
          case 'SIGN_UP':
            break;
          case 'UN_SIGN_UP':
            break;
          case 'UNDONE':
            break;
          default:
        }
        return (
          <NSpace justify={'center'}>
            {btns}
            <NButton
              size={'small'}
              onClick={() => {
                openDetialModal();
                applyId.value = row.id;
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
const clearForm = () => {
  dispatchFormModel.value = { handlePersonId: '', id: '' };
};
const columns = createColumns();
const totalCount = ref(0);
const freshList = async () => {
  loading.value = true;
  const res = await fetchHouseApplyList(pageInfo, searchParam.value);
  data.value = res.data?.list;
  totalCount.value = res.data?.total as number;
  loading.value = false;
};
const dispatchFormModel = ref({ handlePersonId: '', id: '' });
const unsignFormModel = ref({ handleResultRemark: '', id: '' });
const signFormModel = ref({
  beginTime: null,
  id: '',
  endTime: null,
  weeklyPrice: 0,
  signDate: '',
  customerPhoneNumber: '',
  remark: ''
});

const name = getInstanceName('租房申请管理');
const loading = ref(false);
const searchParam = ref();
const searchModel = ref({
  chineseName: '',
  gender: '',
  status: ''
});

const statusOptions = [
  { label: '待处理', value: 'UN_HANDLE' },
  { label: '处理中', value: 'HANDLING' },
  { label: '已签约', value: 'SIGN_UP' },
  { label: '未签约', value: 'UN_SIGN_UP' },
  { label: '已撤销', value: 'UNDONE' }
];
const handleSearch = () => {
  searchParam.value = {
    ...searchModel.value
  };
  freshList();
};
const handleResetSearch = () => {
  searchModel.value = {
    chineseName: '',
    gender: '',
    status: ''
  };
  searchParam.value = {
    ...searchModel.value
  };
  freshList();
};
const handlePageSizeUpdate = (pageSize: number) => {
  pageInfo.pageSize = pageSize;
  // console.log(pageSize);
};
const handlePageUpdate = (page: number) => {
  pageInfo.pageNumber = page;
};
const handleDispatchSubmit = async () => {
  await dispatchHanldePerson(dispatchFormModel.value.id, dispatchFormModel.value.handlePersonId);
  // message.success('分配处理人成功');
  closeDispatchModal();
  clearForm();
  freshList();
};
const handleUnSignSubmit = async () => {
  await unSignHandle(unsignFormModel.value.id, unsignFormModel.value.handleResultRemark);
  // message.success('未签约处理成功');
  closeUnsignModal();
  clearForm();
  freshList();
};
const handleSignSubmit = async () => {
  signFormModel.value.signDate = dayjs().format('YYYY-MM-DD');
  await signHandle(signFormModel.value);
  // message.success('签约成功');
  clearForm();
  closeSignModal();
  // console.log(signFormModel.value);
  freshList();
};
watch(pageInfo, () => {
  freshList();
});
onMounted(() => {
  // 请求
  freshList();
  fetchUserList().then(res => {
    userList.value = res.data?.list as Auth.UserInfo[];
  });
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
      <template #searchPart>
        <n-space class="pb-12px" justify="space-between">
          <n-form ref="formRef" :model="searchModel" label-placement="left">
            <n-grid :cols="24" :x-gap="18">
              <n-form-item-grid-item :span="6" label="中文名">
                <n-input v-model:value="searchModel.chineseName" placeholder="请输入" />
              </n-form-item-grid-item>
              <n-form-item-grid-item :span="6" label="性别">
                <n-select
                  v-model:value="searchModel.gender"
                  :options="[
                    {
                      label: '男',
                      value: '男'
                    },
                    {
                      label: '女',
                      value: '女'
                    }
                  ]"
                  clearable
                />
              </n-form-item-grid-item>
              <n-form-item-grid-item :span="6" label="状态">
                <n-select v-model:value="searchModel.status" :options="statusOptions" clearable />
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
    <n-modal
      v-model:show="showSignModal"
      preset="card"
      style="width: 750px"
      title="签约"
      :mask-closable="false"
      :closable="true"
      :on-close="
        () => {
          closeSignModal();
          clearForm();
          freshList();
        }
      "
    >
      <n-form label-placement="left" :label-width="100" :model="signFormModel">
        <n-form-item label="开始日期" path="datetimeValue" format="yyyy-MM-dd">
          <n-date-picker v-model:value="signFormModel.beginTime" type="date" />
        </n-form-item>
        <n-form-item label="结束日期" path="datetimeValue" format="yyyy-MM-dd">
          <n-date-picker v-model:value="signFormModel.endTime" type="date" />
        </n-form-item>

        <n-form-item label="周租金" path="weeklyPrice">
          <n-input-number v-model:value="signFormModel.weeklyPrice" />
        </n-form-item>
        <n-form-item label="备注" path="handlePersonId">
          <n-input v-model:value="signFormModel.remark" type="textarea" />
        </n-form-item>
        <n-space class="w-full pt-16px" :size="24" justify="end">
          <n-button
            class="w-72px"
            @click="
              () => {
                closeSignModal();
                clearForm();
                freshList();
              }
            "
            >取消</n-button
          >
          <n-button class="w-72px" type="primary" @click="handleSignSubmit">确定</n-button>
        </n-space>
      </n-form>
    </n-modal>
    <n-modal
      v-model:show="showUnsignModal"
      preset="card"
      title="未签约"
      style="width: 750px"
      :mask-closable="false"
      :closable="true"
      :on-close="
        () => {
          closeUnsignModal();
          clearForm();
          freshList();
        }
      "
    >
      <n-form label-placement="left" :label-width="100" :model="unsignFormModel">
        <n-form-item label="处理结果备注" path="handlePersonId">
          <n-input v-model:value="unsignFormModel.handleResultRemark" type="textarea" />
        </n-form-item>
        <n-space class="w-full pt-16px" :size="24" justify="end">
          <n-button
            class="w-72px"
            @click="
              () => {
                closeUnsignModal();
                clearForm();
              }
            "
            >取消</n-button
          >
          <n-button class="w-72px" type="primary" @click="handleUnSignSubmit">确定</n-button>
        </n-space>
      </n-form>
    </n-modal>
    <n-modal
      v-model:show="showDispatchModal"
      preset="card"
      title="分配处理人"
      style="width: 750px"
      :mask-closable="false"
      :closable="true"
      :on-close="
        () => {
          closeDispatchModal();
          clearForm();
          freshList();
        }
      "
    >
      <n-form label-placement="left" :label-width="100" :model="dispatchFormModel">
        <n-form-item label="处理人" path="handlePersonId">
          <!-- <n-input v-model:value="dispatchFormModel.handlePersonId" /> -->
          <n-select
            v-model:value="dispatchFormModel.handlePersonId"
            label-field="nickname"
            value-field="id"
            :options="userList"
            clearable
          />
        </n-form-item>
        <n-space class="w-full pt-16px" :size="24" justify="end">
          <n-button
            class="w-72px"
            @click="
              () => {
                closeDispatchModal();
                clearForm();
              }
            "
            >取消</n-button
          >
          <n-button class="w-72px" type="primary" @click="handleDispatchSubmit">确定</n-button>
        </n-space>
      </n-form>
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
      <HouseApplyDetail :apply-id="applyId" />
    </n-modal>
  </n-card>
</template>
