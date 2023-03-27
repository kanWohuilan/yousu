<template>
	<n-modal v-model:show="modalVisible" preset="card" :title="title" class="w-700px">
		<n-form ref="formRef" label-placement="left" :label-width="80" :model="formModel" :rules="rules">
			<n-grid :cols="24" :x-gap="18">
				<n-form-item-grid-item :span="12" label="房型" path="typeName">
					<n-input v-model:value="formModel.typeName"/>
				</n-form-item-grid-item>
			</n-grid>
			<n-grid :cols="24" :x-gap="18">
				<n-form-item-grid-item :span="24" label="房型介绍" path="typeIntroduce">
					<n-input type="textarea" v-model:value="formModel.typeIntroduce"/>
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
import {ref, computed, reactive, watch} from 'vue';
import type {FormInst, FormItemRule} from 'naive-ui';
import {createRequiredFormRule} from '@/utils';
import {addHouseType, editHouseType} from "@/service/api/apartment";

export interface Props {
	/** 弹窗可见性 */
	visible: boolean;
	/**
	 * 弹窗类型
	 * add: 新增
	 * edit: 编辑
	 */
	type?: 'add' | 'edit';
	/** 编辑的表格行数据 */
	editData?: Apartment.HouseType | null;
}

export type ModalType = NonNullable<Props['type']>;

defineOptions({name: 'TableActionModal'});

const props = withDefaults(defineProps<Props>(), {
	type: 'add',
	editData: null
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
		add: '添加房型',
		edit: '编辑房型'
	};
	return titles[props.type];
});

const formRef = ref<HTMLElement & FormInst>();

type FormModel = Pick<Apartment.HouseType, 'typeName' | 'typeIntroduce'>;

const formModel = reactive<FormModel>(createDefaultFormModel());

const rules: Record<keyof FormModel, FormItemRule | FormItemRule[]> = {
	typeName: createRequiredFormRule('请输入房型'),
	typeIntroduce: createRequiredFormRule('请输入房型介绍'),
};

function createDefaultFormModel(): FormModel {
	return {
		typeName: '',
		typeIntroduce: '',
	};
}

function handleUpdateFormModel(model: Partial<FormModel>) {
	Object.assign(formModel, model);
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

async function handleSubmit() {
	await formRef.value?.validate();
	const handlers: Record<ModalType, () => void> = {
		add: async () => {
			const data = {
				typeName: formModel.typeName,
				typeIntroduce: formModel.typeIntroduce,
			} as Apartment.HouseType
			await addHouseType(data);
			emit('handleOver')
			window.$message?.success('新增成功!');
		},
		edit: async () => {
			if (props.editData) {
				console.log(props.editData)
				const data = {
					id: props.editData.id,
					typeName: formModel.typeName,
					typeIntroduce: formModel.typeIntroduce,
				} as Apartment.HouseType
				await editHouseType(data);
				emit('handleOver')
				window.$message?.success('编辑成功!');
			}
		}
	};

	handlers[props.type]();
	closeModal();
}

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
