<template>
  <n-modal v-model:show="modalVisible" preset="card" :title="title" class="w-900px">
    <n-form ref="formRef" label-placement="left" :label-width="100" :model="formModel">
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="12" label="公寓名称" path="name">
          <n-input v-model:value="formModel.name" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="公寓地点" path="site">
          <n-input v-model:value="formModel.site" />
        </n-form-item-grid-item>
      </n-grid>
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="12" label="邮编" path="zipCode">
          <n-input v-model:value="formModel.zipCode" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="总床位数" path="beds">
          <n-input-number v-model:value="formModel.beds" />
        </n-form-item-grid-item>
      </n-grid>
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="24" label="公寓介绍" path="introduce">
          <n-input v-model:value="formModel.introduce" type="textarea" />
        </n-form-item-grid-item>
      </n-grid>
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="12" label="经度" path="longitude">
          <n-input v-model:value="formModel.gisInfo.longitude" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="纬度" path="latitude">
          <n-input v-model:value="formModel.gisInfo.latitude" />
        </n-form-item-grid-item>
      </n-grid>
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="24" label="国家与城市" path="">
          <n-select
            v-model:value="formModel.countryId"
            label-field="chineseName"
            value-field="id"
            filterable
            placeholder="选择国家"
            :options="countryOptions"
          />
          <n-select
            v-model:value="formModel.cityId"
            style="margin-left: 10px"
            label-field="chineseName"
            value-field="id"
            filterable
            placeholder="选择城市"
            :options="filteredCityOptions"
          />
        </n-form-item-grid-item>
      </n-grid>
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="24" label="公寓位置介绍" path="siteIntroduce">
          <n-input v-model:value="formModel.siteIntroduce" type="textarea" />
        </n-form-item-grid-item>
      </n-grid>
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="12" label="建成年份" path="buildYear">
          <n-date-picker v-model:value="formModel.buildYear" type="year" clearable />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="最高楼层" path="maxFloor">
          <n-input-number v-model:value="formModel.maxFloor" />
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
        <n-form-item-grid-item :span="24" label="户型图" path="floorPlanUrls">
          <n-upload
            action="http://124.221.252.113:19008/yousu-admin/api/file/upload?fileType=IMAGE"
            :default-file-list="floorPlanpreviewFileList"
            list-type="image-card"
            @preview="handlefloorPlanPicturePreview"
            @remove="handlefloorPlanPictureRemove"
            @finish="handlefloorPlanPictureFinish"
            @before-upload="beforefloorPlanPictureUpload"
          />
          <n-modal v-model:show="showfloorPlanPictureModal" preset="card" style="width: 600px" title="预览">
            <img :src="floorPlanPreviewImageUrl" style="width: 100%" />
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
        <n-form-item-grid-item :span="24" label="周边设施" path="aroundFacilities">
          <n-select
            v-model:value="formModel.aroundFacilities"
            label-field="name"
            value-field="id"
            multiple
            :options="aroundFacilitiesOptions"
            @update:value="handleFacilitiesUpdateValue"
          />
        </n-form-item-grid-item>
      </n-grid>
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="24" label="标签" path="tags">
          <n-select
            v-model:value="formModel.tags"
            label-field="tagName"
            value-field="id"
            multiple
            :options="tagOptions"
            @update:value="handleTagUpdateValue"
          />
        </n-form-item-grid-item>
      </n-grid>
      <n-space class="w-full pt-16px" :size="24" justify="end">
        <n-button class="w-72px" @click="closeModal">取消</n-button>
        <n-button class="w-72px" type="primary" @click="handleSubmit">确定</n-button>
      </n-space>
    </n-form>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue';
import type { FormInst, UploadFileInfo } from 'naive-ui';
import type { SelectMixedOption } from 'naive-ui/es/select/src/interface';
import { addApartment, editApartment, getCurrency } from '@/service/api/apartment';
import { fetchCity, fetchCountry } from '~/src/service';
import Currency = Apartment.Currency;
import AroundFacility = Apartment.AroundFacility;
import Tag = Apartment.Tag;
export type ModalType = NonNullable<'add' | 'edit'>;
// 初始化
init();
const countryOptions = ref<CountryAndCity[]>([]);
const cityOptions = ref<CountryAndCity[]>([]);
const filteredCityOptions = ref<CountryAndCity[]>([]);

function init() {
  fetchCountry().then(countryRes => {
    countryOptions.value = countryRes.data?.list || [];
  });
  fetchCity().then(cityRes => {
    cityOptions.value = cityRes.data?.list || [];
  });

  // console.log('答案', countryRes.data);
  getCurrencies();
}

interface Props {
  /** 弹窗可见性 */
  visible: boolean;
  /**
   * 弹窗类型
   * add: 新增
   * edit: 编辑
   */
  type?: 'add' | 'edit';
  /** 编辑的表格行数据 */
  editData?: Apartment.ApartmentDetailVo | null;
  // aroundFacilitiesOptions?: Apartment.AroundFacility[] | null;
  aroundFacilitiesOptions?: SelectMixedOption[] | undefined;

  tagOptions?: SelectMixedOption[] | undefined;
}

const formModel = reactive<FormModel>(createDefaultFormModel());

const showPictureModal = ref(false);
const showfloorPlanPictureModal = ref(false);

const previewImageUrl = ref('');
const floorPlanPreviewImageUrl = ref('');

const previewFileList = ref<UploadFileInfo[]>([]);
const floorPlanpreviewFileList = ref<UploadFileInfo[]>([]);

function handlePicturePreview(file: UploadFileInfo) {
  const { url } = file;
  previewImageUrl.value = url as string;
  showPictureModal.value = true;
}

function handlePictureRemove(options: { file: UploadFileInfo; fileList: Array<UploadFileInfo> }) {
  if (options.file) {
    const { url } = options.file;
    const index = formModel.pictureUrls.indexOf(url as string);
    if (index > -1) {
      formModel.pictureUrls.splice(index, 1);
    }
  }
}

function handlePictureFinish(options: { file: UploadFileInfo; event?: ProgressEvent }) {
  if (options.event) {
    const response = (options.event.target as XMLHttpRequest).response;
    formModel.pictureUrls.push(JSON.parse(response).url);
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

function handlefloorPlanPicturePreview(file: UploadFileInfo) {
  const { url } = file;
  floorPlanPreviewImageUrl.value = url as string;
  showfloorPlanPictureModal.value = true;
}

function handlefloorPlanPictureRemove(options: { file: UploadFileInfo; fileList: Array<UploadFileInfo> }) {
  if (options.file) {
    const { url } = options.file;
    const index = formModel.pictureUrls.indexOf(url as string);
    if (index > -1) {
      formModel.floorPlanUrls.splice(index, 1);
    }
  }
}

function handlefloorPlanPictureFinish(options: { file: UploadFileInfo; event?: ProgressEvent }) {
  if (options.event) {
    const response = (options.event.target as XMLHttpRequest).response;
    console.log('这里是空的：', formModel);
    formModel.floorPlanUrls.push(JSON.parse(response).url);
  }
}

function beforefloorPlanPictureUpload(options: { file: UploadFileInfo; fileList: UploadFileInfo[] }) {
  const fileType = options.file?.type;
  if (fileType !== 'image/png' && fileType !== 'image/jpeg' && fileType !== 'image/bmp' && fileType !== 'image/gif') {
    window.$message?.error('只能上传png、jpg、bmp、gif格式的图片文件，请重新上传');
    return false;
  }
  return true;
}

defineOptions({ name: 'TableActionModal' });

const props = withDefaults(defineProps<Props>(), {
  type: 'add',
  editData: null,
  aroundFacilitiesOptions: undefined,
  tagOptions: undefined
});

interface Emits {
  (e: 'update:visible', visible: boolean): void;

  (e: 'handleOver'): void;
}

const emit = defineEmits<Emits>();

const modalVisible = computed({
  get() {
    return props.visible;
  },
  set(visible) {
    emit('update:visible', visible);
  }
});
const closeModal = () => {
  modalVisible.value = false;
};

const title = computed(() => {
  const titles: Record<ModalType, string> = {
    add: '添加标签',
    edit: '编辑标签'
  };
  return titles[props.type];
});

const formRef = ref<HTMLElement & FormInst>();

type FormModel = Pick<
  Apartment.ApartmentDetailVo,
  | 'name'
  | 'site'
  | 'zipCode'
  | 'gisInfo'
  | 'siteIntroduce'
  | 'introduce'
  | 'beds'
  | 'buildYear'
  | 'maxFloor'
  | 'pictureUrls'
  | 'weeklyPrice'
  | 'currency'
  | 'aroundFacilities'
  | 'tags'
  | 'floorPlanUrls'
  | 'countryId'
  | 'cityId'
>;

function createDefaultFormModel(): FormModel {
  return {
    aroundFacilities: [],
    beds: 0,
    buildYear: 0,
    currency: { code: 'GBP', name: '英镑', symbol: '￡' },
    maxFloor: 0,
    pictureUrls: [],
    tags: [],
    weeklyPrice: 0,
    name: '',
    site: '',
    zipCode: '',
    gisInfo: { longitude: '', latitude: '' },
    siteIntroduce: '',
    introduce: '',
    floorPlanUrls: [],
    countryId: '',
    cityId: ''
  };
}

function handleUpdateFormModel(model: Partial<FormModel>) {
  const uploadFiles: UploadFileInfo[] = [];
  const uploadFloorPlanFiles: UploadFileInfo[] = [];

  model.pictureUrls?.every((pictureUrl: string) => {
    return uploadFiles.push({
      url: pictureUrl,
      status: 'finished'
    } as UploadFileInfo);
  });
  if (model.floorPlanUrls === null) {
    model.floorPlanUrls = [];
  }
  model.floorPlanUrls?.every((pictureUrl: string) => {
    return uploadFloorPlanFiles.push({
      url: pictureUrl,
      status: 'finished'
    } as UploadFileInfo);
  });
  previewFileList.value = uploadFiles;
  floorPlanpreviewFileList.value = uploadFloorPlanFiles;
  Object.assign(formModel, model);
}

function handleCurrencyUpdateValue(value: string, option: Currency[]) {
  console.log(`value: ${JSON.stringify(value)}`);
  console.log(`option: ${JSON.stringify(option)}`);
}

function handleFacilitiesUpdateValue(value: string, option: AroundFacility[]) {
  console.log(`value: ${JSON.stringify(value)}`);
  console.log(`option: ${JSON.stringify(option)}`);
}

function handleTagUpdateValue(value: string, option: Tag[]) {
  console.log(`value: ${JSON.stringify(value)}`);
  console.log(`option: ${JSON.stringify(option)}`);
}

function handleUpdateFormModelByModalType() {
  const handlers: Record<ModalType, () => void> = {
    add: () => {
      const defaultFormModel = createDefaultFormModel();
      handleUpdateFormModel(defaultFormModel);
    },
    edit: () => {
      if (props.editData) {
        handleUpdateFormModel(props.editData);
      }
    }
  };

  handlers[props.type]();
}

const currencyOptions = ref<Apartment.Currency[]>([]);

async function getCurrencies() {
  const { data } = await getCurrency();
  if (data) {
    currencyOptions.value = data;
  }
}

async function handleSubmit() {
  await formRef.value?.validate();
  console.log(formModel);
  console.log(new Date(formModel.buildYear).getFullYear());
  const handlers: Record<ModalType, () => void> = {
    add: async () => {
      const data = {
        aroundFacilities: formModel.aroundFacilities,
        beds: formModel.beds,
        buildYear: new Date(formModel.buildYear).getFullYear(),
        currency: formModel.currency.code,
        gisInfo: formModel.gisInfo,
        introduce: formModel.introduce,
        maxFloor: formModel.maxFloor,
        name: formModel.name,
        pictureUrls: formModel.pictureUrls,
        site: formModel.site,
        siteIntroduce: formModel.siteIntroduce,
        tags: formModel.tags,
        weeklyPrice: formModel.weeklyPrice,
        zipCode: formModel.zipCode,
        floorPlanUrls: formModel.floorPlanUrls,
        countryId: formModel.countryId,
        cityId: formModel.cityId
      } as Apartment.ApartmentAdd;
      // console.log(data);
      await addApartment(data);
      emit('handleOver');
      window.$message?.success('新增成功!');
    },
    edit: async () => {
      if (props.editData) {
        const data = {
          id: props.editData.id,
          aroundFacilities: formModel.aroundFacilities,
          beds: formModel.beds,
          buildYear: new Date(formModel.buildYear).getFullYear(),
          currency: formModel.currency.code,
          gisInfo: formModel.gisInfo,
          introduce: formModel.introduce,
          maxFloor: formModel.maxFloor,
          name: formModel.name,
          pictureUrls: formModel.pictureUrls,
          site: formModel.site,
          siteIntroduce: formModel.siteIntroduce,
          tags: formModel.tags,
          weeklyPrice: formModel.weeklyPrice,
          zipCode: formModel.zipCode,
          floorPlanUrls: formModel.floorPlanUrls,
          countryId: formModel.countryId,
          cityId: formModel.cityId
        } as Apartment.ApartmentEdit;
        await editApartment(data);
        emit('handleOver');
        window.$message?.success('编辑成功!');
      }
    }
  };

  handlers[props.type]();
  closeModal();
}
watch(
  () => formModel.countryId,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      formModel.cityId = null;
      filteredCityOptions.value = cityOptions.value.filter(item => {
        return item.countryId === newValue;
      });
    }
  }
);
watch(
  () => props.visible,
  newValue => {
    if (newValue) {
      handleUpdateFormModelByModalType();
    }
  }
);
</script>

<style scoped></style>
