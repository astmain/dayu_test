<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { uploadFile } from '@/utils/file'
import { getAllUserApi } from '@/api/user'
import { useAppStore } from '@/store/modules/app'
type InsertImageFnType = (url: string, alt: string, href: string) => void
type InsertVideoFnType = (url: string, poster: string) => void
type VideoElement = {
  src: string
  poster?: string
  width?: number
}
const { t } = useI18n()

const { required } = useValidator()
const appStore = useAppStore()
const notificationType = appStore.getDictionaryMap['notification_type']

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  }
})

const formSchema = ref<FormSchema[]>([
  {
    field: 'title',
    label: t('exampleDemo.title'),
    component: 'Input'
  },
  {
    field: 'type',
    label: '类型',
    component: 'Select',
    componentProps: {
      options: notificationType?.list || []
    }
  },
  {
    // 这里提交的数据为id数组
    field: 'recipients',
    label: '通知范围',
    component: 'TreeSelect',
    componentProps: {
      nodeKey: 'id',
      props: {
        label: 'username',
        value: 'id'
      },
      defaultExpandAll: true,
      highlightCurrent: true,
      checkOnClickNode: true,
      expandOnClickNode: false,
      // checkStrictly: true,
      clearable: true,
      multiple: true,
      showCheckbox: true,
      collapseTags: true,
      maxCollapseTags: 1
      // on: {
      //   currentChange: (nodeData) => {
      //     console.log('xzz2021: nodeData', nodeData)
      //     // console.log('xzz2021: node', node)
      //     // setValues({ departmentId: val })
      //   },
      //   nodeCheck: (nodeData) => {
      //     console.log('xzz2021: nodeData', nodeData)
      //   },
      //   // change: (val: string) => {
      //   //   console.log('xzz2021: val', val)
      //   // },
      //   checkChange: (nodeData) => {
      //     console.log('xzz2021: nodeData', nodeData)
      //   }
      // }
    },
    optionApi: async () => {
      const res = await getAllUserApi()
      return [{ username: '所有人', id: 'all', children: res?.list || [] }]
    }
  },
  {
    field: 'isPublished',
    label: '是否发布',
    component: 'Switch',
    value: false,
    colProps: {
      span: 4
    },
    componentProps: {
      activeValue: true,
      inactiveValue: false
    }
  },
  {
    field: 'content',
    // label: '内容',
    component: 'Editor',
    colProps: {
      span: 24
    },
    // 获取配置
    componentProps: {
      editorConfig: {
        MENU_CONF: {
          uploadImage: {
            // 自定义上传
            async customUpload(file: File, insertFn: InsertImageFnType) {
              const { url, alt = '', href = '' } = await uploadFile(file)
              insertFn(url, alt, href)
            }
          },
          uploadVideo: {
            async customUpload(file: File, insertFn: InsertVideoFnType) {
              const { url, poster = '' } = await uploadFile(file)
              // const url = 'http://127.0.0.1:5000/static/test/旧梦一场-阿悠悠.mp4'
              insertFn(url, poster)
            }
          },
          insertVideo: {
            onInsertedVideo: (videoNode: VideoElement | null) => {
              if (videoNode) {
                videoNode.width = 500
              }
            }
          }
        }
        // 图片上传后还需要做记录最后提交时进行对比, 移除未使用的项
      }
    }
  }
])

const rules = reactive({
  title: [required()],
  type: [required()],
  recipientIds: [required()],
  content: [required()]
})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods

watch(
  () => props.currentRow,
  async (currentRow) => {
    // if (!currentRow) return
    if (!currentRow) {
      const ElForm = await getElFormExpose()
      ElForm?.resetFields()
      return
    }
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

//  ================富文本==========================
</script>

<template>
  <Form :rules="rules" @register="formRegister" :schema="formSchema" />
</template>
