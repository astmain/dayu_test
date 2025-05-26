<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { ElInputNumber } from 'element-plus'
const { t } = useI18n()

const { required } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  }
})

// {'name':加急方式,'days':加急天数,price:加急费,'note':备注}

const formSchema = ref<FormSchema[]>([
  {
    field: 'name',
    label: '名称',
    component: 'Input'
  },
  {
    field: 'duration',
    label: '预计天数',
    component: 'InputNumber',
    componentProps: {
      min: 1,
      stepStrictly: true,
      defaultValue: 1,
      max: 20
    }
  },
  {
    field: 'price',
    label: '费用',
    formItemProps: {
      slots: {
        default: (row: any) => {
          return (
            <ElInputNumber
              style={{ width: '100%' }}
              v-model={row['price']}
              v-slots={{ suffix: () => <span>元</span> }}
              min={0}
              precision={2}
            />
          )
        }
      }
    }
  },
  {
    field: 'active',
    label: '是否启用',
    component: 'Switch',
    componentProps: {
      defaultValue: true
    }
  },
  {
    field: 'description',
    label: t('userDemo.remark'),
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 5
    },
    colProps: {
      span: 24
    }
  }
])

const rules = reactive({
  name: [required()],
  days: [required()],
  price: [required()]
})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods

watch(
  () => props.currentRow,
  (currentRow) => {
    if (!currentRow) return
    setValues(currentRow)
  },
  {
    deep: true,
    immediate: true
  }
)

const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    const formData = await getFormData()
    return formData
  }
}
defineExpose({
  submit
})
</script>

<template>
  <Form :rules="rules" @register="formRegister" :schema="formSchema" />
</template>
