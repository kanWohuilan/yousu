<script setup lang="tsx">
import { onMounted, ref, computed } from 'vue';
import { getApartmentDetails, getAroundFacilityList, getTagList } from '@/service/api/apartment';
import { fetchCity, fetchCountry } from '~/src/service';
interface PropsType {
  apartmentId: string;
}
const detailData = ref<Apartment.ApartmentDetailVo>();
const loading = ref<boolean>(true);
const props = defineProps<PropsType>();
let aroundFacilities: Array<any> | undefined = [];
let tags: Array<any> | undefined = [];
const countryOptions = ref<CountryAndCity[]>([]);
const cityOptions = ref<CountryAndCity[]>([]);

onMounted(async () => {
  loading.value = true;
  const aroundFacilitiesRes = await getAroundFacilityList();
  aroundFacilities = aroundFacilitiesRes.data?.list;
  const tagResp = await getTagList();
  tags = tagResp.data?.list;
  const res = await getApartmentDetails(props.apartmentId);
  fetchCountry().then(countryRes => {
    countryOptions.value = countryRes.data?.list || [];
  });
  fetchCity().then(cityRes => {
    cityOptions.value = cityRes.data?.list || [];
  });

  detailData.value = res.data as Apartment.ApartmentDetailVo;
  loading.value = true;
});
const filterdAroundFacilities = computed(() => {
  return detailData.value?.aroundFacilities.map(item => {
    const match = aroundFacilities?.find(j => {
      return j.id === item;
    });
    return match;
  });
});
const filterTag = computed(() => {
  return detailData.value?.tags
    .map(item => {
      // console.log(item);
      const match = tags?.find(j => {
        // console.log(j);
        return j.id === item;
      });
      return match;
    })
    .filter(item => {
      return item !== null && item !== undefined;
    });
});
</script>

<template>
  <n-card :loading="loading" :bordered="false" class="rounded-16px shadow-sm hfull">
    <n-form label-placement="left">
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="12" label="公寓名称：">{{ detailData?.name }}</n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="公寓地点：">{{ detailData?.site }}</n-form-item-grid-item>
      </n-grid>
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="12" label="邮编：">{{ detailData?.zipCode }}</n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="总床位数：">{{ detailData?.beds }}</n-form-item-grid-item>
      </n-grid>
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="24" label="公寓介绍：">
          <p>{{ detailData?.introduce }}</p>
        </n-form-item-grid-item>
      </n-grid>
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="12" label="经度：">{{ detailData?.gisInfo.longitude }}</n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="纬度：">{{ detailData?.gisInfo.latitude }}</n-form-item-grid-item>
      </n-grid>
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="12" label="国家：">{{
          countryOptions.filter(item => {
            return item.id === detailData?.countryId;
          })[0]?.chineseName || '暂无'
        }}</n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="城市：">{{
          cityOptions.filter(item => {
            return item.id === detailData?.cityId;
          })[0]?.chineseName || '暂无'
        }}</n-form-item-grid-item>
      </n-grid>
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="24" label="公寓位置介绍：">
          <p>{{ detailData?.siteIntroduce }}</p>
        </n-form-item-grid-item>
      </n-grid>
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="12" label="建成年份：">{{ detailData?.buildYear }}</n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="最高楼层：">{{ detailData?.maxFloor }}</n-form-item-grid-item>
      </n-grid>
      <n-grid :cols="24">
        <n-form-item-grid-item :span="24" label="公寓图片：">
          <!-- <div class="flex flex-wrap w-full"> -->
          <n-space>
            <n-image
              v-for="item in detailData?.pictureUrls"
              :key="item"
              width="100"
              class="ml-12"
              :src="item"
              style="width: 100%"
            />
          </n-space>

          <!-- </div> -->
        </n-form-item-grid-item>
      </n-grid>
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="12" label="户型图：">
          <n-space>
            <n-image
              v-for="item in detailData?.floorPlanUrls"
              :key="item"
              width="100"
              class="ml-12"
              :src="item"
              style="width: 100%"
            />
          </n-space>
        </n-form-item-grid-item>
      </n-grid>
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="12" label="最低租金：">{{ detailData?.weeklyPrice }}</n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="币种：">{{ detailData?.currency.name }}</n-form-item-grid-item>
      </n-grid>
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="24" label="周边设施：">
          <div v-if="filterdAroundFacilities?.length === 0">暂无</div>
          <div v-else class="flex">
            <n-tag v-for="item in filterdAroundFacilities" :key="item" class="ml-2"> {{ item.name }} </n-tag>
          </div>
        </n-form-item-grid-item>
      </n-grid>
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="24" label="标签：">
          <div v-if="filterTag?.length === 0">暂无</div>
          <div v-else class="flex">
            <n-tag v-for="item in filterTag" :key="item" class="ml-2"> {{ item.tagName }} </n-tag>
          </div>
        </n-form-item-grid-item>
      </n-grid>
    </n-form>
  </n-card>
</template>
