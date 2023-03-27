<script setup lang="tsx">
import { onMounted, ref } from 'vue';
import { fetchSubletHouseDetails } from '@/service/api';
interface PropsType {
  applyId: string;
}
const detailData = ref<Apartment.SubletHouse>();
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
  const res = await fetchSubletHouseDetails(props.applyId);

  detailData.value = res.data as Apartment.SubletHouse;
  // detailData.value.status = (res.data?.status as Apartment.SubletHouse).name;

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
        <n-form-item-grid-item :span="8" label="原价：">{{ detailData?.originalPrice }}</n-form-item-grid-item>
        <n-form-item-grid-item :span="8" label="转租价：">{{ detailData?.subletPrice }}</n-form-item-grid-item>
        <n-form-item-grid-item :span="8" label="状态：">{{ detailData?.status.name }}</n-form-item-grid-item>
      </n-grid>
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="24" label="转租原因：">
          <p>{{ detailData?.reason }}</p>
        </n-form-item-grid-item>
      </n-grid>
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="24" label="图片：">
          <n-space>
            <div v-if="!detailData?.pictureUrls || detailData?.pictureUrls.length === 0">暂无图片</div>
            <n-space v-else>
              <n-image v-for="pic in detailData?.pictureUrls" :key="pic" :src="pic"></n-image>
            </n-space>
          </n-space>
        </n-form-item-grid-item>
      </n-grid>
    </n-form>
  </n-card>
</template>
