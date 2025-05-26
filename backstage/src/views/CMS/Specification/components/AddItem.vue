<script setup lang="ts">
import { FormSchema, Form } from '@/components/Form'
import { ElDrawer, ElMessage } from 'element-plus'
import { reactive, watch } from 'vue'
import { useForm } from '@/hooks/web/useForm'
import { useValidator } from '@/hooks/web/useValidator'
import { useEventBus } from '@/hooks/event/useEventBus'
import { useCmsStore } from '@/store/modules/cms'
const props = defineProps<{
  currentSpec: any
  title: string
}>()
const modelValue = defineModel<boolean>()

const { required } = useValidator()

const formSchema = reactive<FormSchema[]>([
  {
    field: 'name',
    label: '规格',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'price',
    label: '价格系数',
    component: 'InputNumber',
    colProps: {
      span: 24
    }
  },
  {
    field: 'start_price',
    label: '起步价',
    component: 'InputNumber',
    colProps: {
      span: 24
    }
  },
  {
    field: 'is_default',
    label: '是否默认',
    component: 'Switch'
  }
])

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods
const cmsStore = useCmsStore()

const rules = reactive({
  spec: [required()],
  price: [required()],
  is_default: [required()]
})

const { emit } = useEventBus()
const confirm = async () => {
  const elFormExpose = await getElFormExpose()
  if (!elFormExpose) return
  const valid = await elFormExpose?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    const formData = await getFormData()
    // formData.name = formData.spec
    try {
      const res = await cmsStore.updateSpecificationItemList(formData)
      if (res) {
        ElMessage.success('操作成功')
        modelValue.value = false
        emit('refresh', formData?.specificationId)
      } else {
        ElMessage.error('操作失败')
      }
    } catch (error) {
      console.log(error)
    }
  }
}

watch(
  () => props.currentSpec,
  (currentSpec) => {
    if (!currentSpec) return
    setValues(currentSpec)
  },
  {
    deep: true,
    immediate: true
  }
)
</script>

<template>
  <ElDrawer v-model="modelValue" :title="title" :append-to-body="true" destroy-on-close>
    <template #default>
      <Form :rules="rules" @register="formRegister" :schema="formSchema" />
    </template>
    <template #footer>
      <div>
        <BaseButton @click="modelValue = false">取消</BaseButton>
        <BaseButton type="primary" @click="confirm">确认</BaseButton>
      </div>
    </template>
  </ElDrawer>
</template>
