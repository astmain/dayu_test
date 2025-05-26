<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from 'vue-i18n'
import { ElInput, ElButton } from 'element-plus'
import { ref } from 'vue'
// import { usePermissionStore } from '@/store/modules/permission'

const { required } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object as PropType<Nullable<{ id: number; name: string; parentId?: number }>>,
    default: () => null
  }
})

const rules = reactive({
  name: [required()],
  code: [required()],
  status: [required()],
  dicCategoryId: [required()]
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
    delete formData.children
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

const textareaValue = ref('')
const handleImport = async () => {
  const formData = await getFormData()
  console.log(textareaValue.value)
}
const formSchema = reactive<FormSchema[]>([
  // {
  //   field: 'parentId',
  //   label: '父级字典',
  //   component: 'Select',
  //   value: props.currentRow?.parentId,
  //   componentProps: {
  //     options: usePermissionStore().getDictionaryOptionList
  //   }
  // },
  {
    field: 'name',
    label: '字典名称',
    component: 'Input'
  },
  {
    field: 'code',
    label: '字典编码',
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
  // {
  //   field: 'entries',
  //   label: '所有字典项',
  //   formItemProps: {
  //     slots: {
  //       default: (data: any) => {
  //         if (data?.entries?.length == 0) return <ElTag type="danger">暂无</ElTag>
  //         return (
  //           <>
  //             {data?.entries?.map((item: any) => {
  //               return (
  //                 <ElTag type="success" class="mr-2 ">
  //                   {item?.name}
  //                 </ElTag>
  //               )
  //             })}
  //           </>
  //         )
  //       }
  //     }
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
  // {
  //   field: 'aaaa',
  //   label: '批量导入',
  //   componentProps: {
  //     slots: {
  //       default: () => {
  //         return (
  //           <>
  //             <ElInput rows={5} type="textarea" v-model={textareaValue} />
  //             <ElButton type="primary" onClick={handleImport}>
  //               批量导入
  //             </ElButton>
  //           </>
  //         )
  //       }
  //     }
  //   }
  // }
])
</script>

<template>
  <Form :rules="rules" @register="formRegister" :schema="formSchema" />
</template>
