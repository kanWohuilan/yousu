<script setup lang="ts">
import { onMounted, ref, reactive, watch } from 'vue';
import { NCard } from 'naive-ui';
import CommonTable from '~/src/components/common/CommonTable/index.vue';
import { getInstanceName } from '~/src/utils/common';
import { fetchCustomerList } from '~/src/service/api';

const table = ref<typeof CommonTable | null>(null);
const data = ref<Apartment.Campus[] | undefined>([]);
const loading = ref(false);
const name = getInstanceName('客户管理');
const pageInfo = reactive<PageParams>({
  pageNumber: 1,
  pageSize: 10
});
const params = [
  // {
  //   title: 'ID',
  //   key: 'id'
  // },
  {
    title: '微信ID',
    key: 'weChatId'
  },
  {
    title: '手机号',
    key: 'phoneNumber'
  }
];

// const message = useMessage();
const columns = params;

const totalCount = ref(0);
const freshList = async () => {
  loading.value = true;
  const res = await fetchCustomerList(pageInfo);
  data.value = res.data?.list;
  totalCount.value = res.data?.total as number;

  loading.value = false;
};
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
  <n-card title="客户管理" :bordered="false" class="rounded-16px shadow-sm hfull">
    <CommonTable
      ref="table"
      :columns="columns"
      :table-data="data"
      :total-count="totalCount"
      :loading="loading"
      :modal-loading="false"
      :name="name"
      :add-btn-display="false"
      @page-size-change="handlePageSizeUpdate"
      @page-change="handlePageUpdate"
    >
    </CommonTable>
  </n-card>
</template>
