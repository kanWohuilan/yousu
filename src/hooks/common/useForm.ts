import { ref } from 'vue';
import { cloneDeep } from 'lodash-es';

export default function useForm<T>(initValue: T) {
  let formModel: any;
  if (initValue) {
    formModel = ref<T>(cloneDeep(initValue));
  } else {
    formModel = ref({});
  }

  const clearFormModel = () => {
    // console.log(initValue);
    formModel.value = cloneDeep(initValue) || {};
  };

  return {
    formModel,
    clearFormModel
  };
}
