<script setup lang="tsx">
import { onMounted, ref } from 'vue';
import { fetchRentHouseApplyDetails } from '@/service/api';
interface PropsType {
  applyId: string;
}
const detailData = ref<Customer.HouseApply>();
const loading = ref<boolean>(true);
const props = defineProps<PropsType>();
// let aroundFacilities: Array<any> | undefined = [];
// let tags: Array<any> | undefined = [];

onMounted(async () => {
  loading.value = true;
  // const aroundFacilitiesRes = await getAroundFacilityList();
  // aroundFacilities = aroundFacilitiesRes.data?.list;
  // const tagResp = await getTagList();
  // tags = tagResp.data?.list;
  const res = await fetchRentHouseApplyDetails(props.applyId);

  detailData.value = res.data as Customer.HouseApply;
  detailData.value.status = (res.data?.status as Customer.Status).name;
  loading.value = true;
});
// const filterdAroundFacilities = computed(() => {
//   return detailData.value?.aroundFacilities.map(item => {
//     const match = aroundFacilities?.find(j => {
//       return j.id === item;
//     });
//     return match;
//   });
// });
// const filterTag = computed(() => {
//   return detailData.value?.tags
//     .map(item => {
//       // console.log(item);
//       const match = tags?.find(j => {
//         // console.log(j);
//         return j.id === item;
//       });
//       return match;
//     })
//     .filter(item => {
//       return item !== null && item !== undefined;
//     });
// });
</script>

<template>
  <n-card :loading="loading" :bordered="false" class="rounded-16px shadow-sm hfull">
    <n-form label-placement="left">
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="24" label="公寓名称：">{{ detailData?.apartmentName }}</n-form-item-grid-item>
      </n-grid>
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="8" label="中文名：">{{ detailData?.chineseName }}</n-form-item-grid-item>
        <n-form-item-grid-item :span="8" label="性别：">{{ detailData?.gender }}</n-form-item-grid-item>
        <n-form-item-grid-item :span="8" label="生日：">{{ detailData?.birthday }}</n-form-item-grid-item>
      </n-grid>
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="12" label="护照-名：">{{ detailData?.passportFirstName }}</n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="护照-姓：">{{ detailData?.passportLastName }}</n-form-item-grid-item>
      </n-grid>
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="12" label="手机号：">{{ detailData?.phoneNumber }}</n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="邮箱：">{{ detailData?.email }}</n-form-item-grid-item>
      </n-grid>
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="12" label="状态：">{{ detailData?.status }}</n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="处理人：">{{ detailData?.handlePersonName }}</n-form-item-grid-item>
      </n-grid>
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="24" label="处理结果备注：">
          <p>{{ detailData?.handleResultRemark }}</p>
        </n-form-item-grid-item>
      </n-grid>
    </n-form>
  </n-card>
</template>
