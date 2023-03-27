<script setup lang="tsx">
import { onMounted, ref } from 'vue';
import { fetchSubletHouseApplyDetails } from '@/service/api';
interface PropsType {
  applyId: string;
}
const detailData = ref<Customer.SubletHouseApply>();
const loading = ref<boolean>(true);
const props = defineProps<PropsType>();
const statusOptions = [
  { label: '驳回', value: 'REJECT', color: 'error' },
  { label: '审核通过', value: 'AGREE', color: 'success' },
  { label: '待处理', value: 'APPLYING', color: 'warning' }
];
onMounted(async () => {
  loading.value = true;

  const res = await fetchSubletHouseApplyDetails(props.applyId);

  detailData.value = res.data as Customer.SubletHouseApply;
  loading.value = true;
});
</script>

<template>
  <n-card :loading="loading" :bordered="false" class="rounded-16px shadow-sm hfull">
    <n-form label-placement="left">
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="12" label="公寓名称：">{{ detailData?.apartmentName }}</n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="公寓房型名称：">{{
          detailData?.apartmentHouseName
        }}</n-form-item-grid-item>
      </n-grid>
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="6" label="楼栋：">{{ detailData?.building }}</n-form-item-grid-item>
        <n-form-item-grid-item :span="6" label="楼层：">{{ detailData?.floor }}</n-form-item-grid-item>
        <n-form-item-grid-item :span="6" label="flat：">{{ detailData?.flat }}</n-form-item-grid-item>
        <n-form-item-grid-item :span="6" label="房间号：">{{ detailData?.roomNo }}</n-form-item-grid-item>
      </n-grid>
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="8" label="转租开始时间：">{{ detailData?.beginTime }}</n-form-item-grid-item>
        <n-form-item-grid-item :span="8" label="转租结束时间：">{{ detailData?.endTime }}</n-form-item-grid-item>
        <n-form-item-grid-item :span="8" label="手机号：">{{ detailData?.phoneNumber }}</n-form-item-grid-item>
      </n-grid>

      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="12" label="状态：">{{
          statusOptions.find(item => {
            return item.value === detailData?.status;
          })?.label
        }}</n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="处理人：">{{ detailData?.handlePersonName }}</n-form-item-grid-item>
      </n-grid>
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="24" label="转租原因：">
          <p>{{ detailData?.reason }}</p>
        </n-form-item-grid-item>
      </n-grid>
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="24" label="处理结果备注：">
          <p>{{ detailData?.handleRemark }}</p>
        </n-form-item-grid-item>
      </n-grid>
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="24" label="图片：">
          <n-space>
            <n-image v-for="pic in detailData?.pictureUrls" :key="pic" width="80" :src="pic"></n-image>
          </n-space>
        </n-form-item-grid-item>
      </n-grid>
    </n-form>
  </n-card>
</template>
