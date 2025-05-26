<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { ElTable, ElTableColumn, ElButton, ElPopconfirm, ElMessage, ElTag } from 'element-plus'
import { BaseButton } from '@/components/Button'
import AddItem from './AddItem.vue'
import { useCmsStore } from '@/store/modules/cms'
import { useEventBus } from '@/hooks/event/useEventBus'
const { t } = useI18n()

const { required } = useValidator()
const cmsStore = useCmsStore()
const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  },
  refresh: {
    type: Function as PropType<() => void>,
    default: () => {}
  }
})

const SpecsListDom = (data: any) => {
  if (!data?.id) return null
  if (data?.is_tag) return null
  return (
    <>
      <div>
        <BaseButton type="primary" size="small" onClick={() => action(null)}>
          添加规格明细
        </BaseButton>
      </div>
      <ElTable data={data?.list || []}>
        <ElTableColumn type="index" prop="id" label="序号" width="80" />
        <ElTableColumn
          prop="name"
          label="规格名称"
          v-slots={{
            default: ({ row }: any) => <span>{row.name}</span>
          }}
        />
        <ElTableColumn
          prop="price"
          label="价格系数"
          v-slots={{
            default: ({ row }: any) => <span>{row.price}</span>
          }}
        />
        <ElTableColumn
          prop="start_price"
          label="起步价"
          v-slots={{
            default: ({ row }: any) => <span>{row.start_price}</span>
          }}
        />
        <ElTableColumn
          prop="is_default"
          label="是否默认"
          align="center"
          v-slots={{
            default: ({ row }: any) => (
              <ElTag type={row?.is_default ? 'success' : 'danger'}>
                {row?.is_default ? '是' : '否'}
              </ElTag>
            )
          }}
        />
        <ElTableColumn
          label="操作"
          width="160"
          align="center"
          v-slots={{
            default: ({ row }: any) => (
              <>
                <ElButton size="small" type="primary" onClick={() => action(row)}>
                  编辑
                </ElButton>
                <ElPopconfirm title="确定删除?" onConfirm={() => handleDelete(row?.id)}>
                  {{
                    reference: () => (
                      <ElButton size="small" type="danger">
                        删除
                      </ElButton>
                    )
                  }}
                </ElPopconfirm>
              </>
            )
          }}
        />
      </ElTable>
    </>
  )
}
const formSchema = ref<FormSchema[]>([
  {
    field: 'parentId',
    label: '父级菜单',
    component: 'TreeSelect',
    componentProps: {
      nodeKey: 'id',
      props: {
        // label: 'title',
        label: (item: any) => {
          return t(item?.name)
        },
        value: 'id',
        children: 'children'
      },
      highlightCurrent: true,
      expandOnClickNode: false,
      autoExpandParent: true,
      checkStrictly: true,
      checkOnClickNode: true,
      clearable: true,
      on: {
        change: async (val: number) => {
          console.log('🚀 ~ val:', val)
        }
      }
    },
    optionApi: async () => {
      // const res = await getMenuListApi()
      // return res.data.list || []
      const res = useCmsStore().getSpecificationList
      return res || []
    }
  },
  {
    field: 'name',
    label: '名称',
    component: 'Input'
  },
  {
    field: 'is_tag',
    label: '是否标签',
    component: 'Switch',
    componentProps: {
      defaultValue: true
    }
  },
  {
    field: 'list',
    label: '规格',
    colProps: {
      span: 24
    },
    hidden: props.currentRow?.is_tag,
    formItemProps: {
      slots: {
        default: (data: any) => {
          return SpecsListDom(data)
        }
      }
    }
  }

  // {
  //   field: 'note',
  //   label: t('userDemo.remark'),
  //   component: 'Input',
  //   componentProps: {
  //     type: 'textarea',
  //     rows: 5
  //   },
  //   colProps: {
  //     span: 24
  //   }
  // }
])

const rules = reactive({
  name: [required()]
  // status: [required()]
})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods

const { emit } = useEventBus()
const handleDelete = async (id: number) => {
  if (!id) return ElMessage.error('删除失败,缺少id, 请刷新页面再试!')
  try {
    const res = await cmsStore.deleteSpecListItme([id])
    if (res) {
      ElMessage.success('删除成功')
      emit('refresh', props.currentRow?.id)
    } else {
      ElMessage.error('删除失败')
    }
  } catch (error) {
    console.log(error)
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

const currentSpec = ref<any>(null)
const dialogTitle = ref('')
const action = (row: any) => {
  dialogTitle.value = t(row ? 'exampleDemo.edit' : 'exampleDemo.add')
  currentSpec.value = { price: 1, is_default: false, ...row, specificationId: props.currentRow?.id }
  // currentSpec.value.specificationId = props.currentRow?.id
  showDrawer.value = true
}
const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    const formData = await getFormData()
    console.log('🚀 ~ submit ~ formData:', formData)
    delete formData.list
    delete formData.children
    if (formData.id && formData.id === formData.parentId) {
      delete formData.parentId
      ElMessage.error('父级规格不能选择自己')
      return
    }
    // formData.parent_id = formData?.parent_id || null
    return formData
  }
}
// const emit = defineEmits(['refresh'])

const showDrawer = ref(false)

defineExpose({
  submit
})
</script>

<template>
  <Form :rules="rules" @register="formRegister" :schema="formSchema" />
  <AddItem v-model="showDrawer" :currentSpec="currentSpec" :title="dialogTitle" />
</template>
