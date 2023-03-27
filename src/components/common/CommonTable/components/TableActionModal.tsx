import { defineComponent, ref } from 'vue';
import { NModal, NForm, NSpace, NButton } from 'naive-ui';

// const formData: any = {};

// function useGenerateContent(params: any[]) {
//   return params.map(item => {
//     return matchingComponent(item);
//   });
// }

// function matchingComponent(param: any) {
//   switch (param.paramType) {
//     case 'string':
//       return (
//         <NFormItem label={param.title} path={formData[param.key]}>
//           <NInput
//             value={formData[param.key]}
//             onInput={(e: any) => {
//               formData[param.key] = e.target.value;
//             }}
//             placeholder=""
//           />
//         </NFormItem>
//       );
//     default:
//       return '';
//   }
// }

// 动态模态框
export default defineComponent({
  /**
   * 1. 传入字段数组
   * 2. 整理字段
   * 3. 生成DOM，增加数据校验
   * 4. 组合DOM渲染
   *
   */
  props: {
    modalShow: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ''
    }
  },
  emits: ['close', 'commit'],
  setup(_, { emit }) {
    const form = ref();
    const handleClose = () => {
      emit('close');
    };
    const handleCommit = () => {
      // 校验
      emit('commit');
    };
    return {
      handleCommit,
      handleClose,
      form
    };
  },
  render() {
    const { handleClose, modalShow, title, handleCommit, form } = this;
    const { default: defaultSlot } = this.$slots;

    return (
      <NModal show={modalShow} preset="card" class="w-900px" mask-closable={false} on-close={handleClose} title={title}>
        <NForm ref={form} label-width={80}>
          {defaultSlot && defaultSlot()}
          <NSpace class="w-full pt-16px" size={24} justify="end">
            <NButton class="w-72px" onClick={handleClose}>
              取消
            </NButton>
            <NButton class="w-72px" type="primary" onClick={handleCommit}>
              确定
            </NButton>
          </NSpace>
        </NForm>
      </NModal>
    );
  }
});
