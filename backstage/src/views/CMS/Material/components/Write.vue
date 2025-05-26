<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { useDictionaryStore } from '@/store/modules/dictionary'
import Upload from './Upload.vue'
import { ElInputNumber, ElInput } from 'element-plus'
import { storeToRefs } from 'pinia'
const { t } = useI18n()

const { required } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  }
})

const dictionaryStore = useDictionaryStore()
const { dictionaryMap } = storeToRefs(dictionaryStore)

const getFormItemProps = (field: string, suffix: string, type: string = 'number') => {
  return {
    slots: {
      default: (row: any) => {
        return type === 'number' ? (
          <ElInputNumber
            style={{ width: '100%' }}
            v-model={row[field]}
            v-slots={{ suffix: () => <span>{suffix}</span> }}
            min={0}
            precision={2}
            // 限制输入为数字
            onInput={(e: any) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, '')
            }}
          />
        ) : (
          <ElInput
            style={{ width: '100%' }}
            v-model={row[field]}
            clearable
            v-slots={{ suffix: () => <span>{suffix}</span> }}
          />
        )
      }
    }
  }
}

const formSchema = ref<FormSchema[]>([
  {
    field: 'code',
    label: '型号',
    component: 'Input'
  },
  {
    field: 'name',
    label: '名称',
    component: 'Input'
  },
  {
    field: 'property',
    label: '特性',
    component: 'Input'
  },
  {
    field: 'color',
    label: '颜色',
    component: 'Input'
  },
  {
    field: 'type',
    label: '材料分类',
    component: 'Select',
    optionApi: () => {
      return dictionaryMap.value['MATERIAL_TYPE']
    }
  },

  {
    field: 'process',
    label: '成型工艺',
    component: 'Select',
    optionApi: () => {
      return dictionaryMap.value['MATERIAL_PROCESS']
    }
  },
  {
    field: 'temperature_resistance',
    label: '变形温度',
    formItemProps: getFormItemProps('temperature_resistance', '℃', 'input')
  },

  {
    field: 'disadvantages',
    label: '材料缺点',
    component: 'Input'
  },

  {
    field: 'advantages',
    label: '材料优点',
    component: 'Input'
  },
  {
    field: 'shrinkage_rate',
    label: '材料缩水率',
    // component: 'InputNumber',
    formItemProps: getFormItemProps('shrinkage_rate', '‰')
  },
  {
    field: 'structural_strength',
    label: '结构强度',
    formItemProps: getFormItemProps('structural_strength', 'MPa')
  },
  {
    field: 'density',
    label: '材料密度',
    formItemProps: getFormItemProps('density', 'g/cm³')
  },
  {
    field: 'price',
    label: '材料单价',
    formItemProps: getFormItemProps('price', '元')
  },
  {
    field: 'start_price',
    label: '起步价',
    // component: 'InputNumber',
    formItemProps: getFormItemProps('start_price', '元')
  },
  // {
  //   field: 'grinding_price',
  //   label: '打磨单价',
  //   formItemProps: getFormItemProps('grinding_price', '元')
  // },
  // {
  //   field: 'grinding_start_price',
  //   label: '打磨起步价',
  //   formItemProps: getFormItemProps('grinding_start_price', '元')
  // },
  // {
  //   field: 'paint_price',
  //   label: '喷漆单价',
  //   formItemProps: getFormItemProps('paint_price', '元')
  // },
  // {
  //   field: 'paint_start_price',
  //   label: '喷漆起步价',
  //   formItemProps: getFormItemProps('paint_start_price', '元')
  // },
  {
    field: 'is_default',
    label: '是否默认',
    component: 'Switch'
  },
  {
    field: 'img_url',
    label: '图片',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return <Upload material_id={props.currentRow?.id} fileList={props.currentRow?.img_url} />
        }
      }
    },
    hidden: !props.currentRow?.id
  },
  // {
  //   field: 'status',
  //   label: t('menu.status'),
  //   component: 'Select',
  //   componentProps: {
  //     options: [
  //       {
  //         label: t('userDemo.disable'),
  //         value: false
  //       },
  //       {
  //         label: t('userDemo.enable'),
  //         value: true
  //       }
  //     ]
  //   }
  // },
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
  code: [required()],
  type: [required()],
  color: [required()],
  process: [required()],
  structural_strength: [required()],
  advantages: [required()],
  disadvantages: [required()],
  density: [required()],
  shrinkage_rate: [required()],
  price: [required()],
  start_price: [required()],
  temperature_resistance: [required()]
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
