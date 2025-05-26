<script setup lang="ts">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, onMounted } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { DepartmentItem } from '@/api/department/types'
import { useDepartmentStore } from '@/store/modules/department'
import { useDictionaryStore } from '@/store/modules/dictionary'
import { storeToRefs } from 'pinia'
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
  code: [required()],
  unit: [required()],
  status: [required()]
})
const dictionaryStore = useDictionaryStore()
const { dictionaryMap } = storeToRefs(dictionaryStore)
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
    field: 'category',
    label: '类型',
    component: 'Select',
    optionApi: () => {
      return dictionaryMap.value['BOM_CATEGORY']
    }
  },
  {
    field: 'name',
    label: '名称',
    component: 'Input'
  },
  {
    field: 'code',
    label: '编码',
    component: 'Input',
    componentProps: {
      placeholder: '为了同类数据直观,编码前缀请使用统一格式'
    }
  },
  {
    field: 'color',
    label: '颜色',
    component: 'Input'
  },
  {
    field: 'unit',
    label: '单位',
    component: 'Select',
    optionApi: () => {
      return dictionaryMap.value['UNIT']
    }
  },
  {
    field: 'count',
    label: '数量',
    component: 'InputNumber'
  },
  {
    field: 'unit_price',
    label: '单价',
    component: 'InputNumber'
  },
  {
    field: 'total_price',
    label: '总价',
    component: 'InputNumber',
    componentProps: {
      step: 1
    }
  },
  {
    field: 'sort',
    label: '排序',
    component: 'InputNumber'
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
    field: 'description',
    label: '描述',
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
