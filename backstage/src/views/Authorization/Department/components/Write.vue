<script setup lang="ts">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, onMounted } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { DepartmentItem } from '@/api/department/types'
import { useDepartmentStore } from '@/store/modules/department'

import { useI18n } from 'vue-i18n'

const { required } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object as PropType<Nullable<DepartmentItem>>,
    default: () => null
  }
})

const rules = reactive({
  name: [required()],
  status: [required()]
})

const { departmentOptionList } = useDepartmentStore()
console.log('🚀 ~ departmentOptionList:', departmentOptionList)
onMounted(async () => {
  await useDepartmentStore().getDepartmentOptionList()
})
const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods

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

defineExpose({
  submit
})

const { t } = useI18n()

const formSchema = reactive<FormSchema[]>([
  {
    field: 'parentId',
    label: t('userDemo.superiorDepartment'),
    component: 'TreeSelect',
    componentProps: {
      nodeKey: 'id',
      props: {
        label: 'name'
      },
      defaultExpandAll: true,
      highlightCurrent: true,
      expandOnClickNode: false,
      checkStrictly: true,
      checkOnClickNode: true,
      clearable: true
    },
    optionApi: () => {
      return departmentOptionList
    }
  },
  {
    field: 'name',
    label: t('userDemo.departmentName'),
    component: 'Input'
  },
  {
    field: 'status',
    label: t('userDemo.status'),
    component: 'Select',
    value: true,
    componentProps: {
      options: [
        {
          value: false,
          label: t('userDemo.disable')
        },
        {
          value: true,
          label: t('userDemo.enable')
        }
      ]
    }
  },
  {
    field: 'remark',
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
</script>

<template>
  <Form :rules="rules" @register="formRegister" :schema="formSchema" />
</template>
