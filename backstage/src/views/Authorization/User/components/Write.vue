<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch } from 'vue'
import { DepartmentUserItem2 } from '@/api/department/types'
import { useValidator } from '@/hooks/web/useValidator'

// ==========================================
import { useI18n } from 'vue-i18n'
import { usePermissionStore } from '@/store/modules/permission'
import { ElInput, ElMessage } from 'element-plus'
import { BaseButton } from '@/components/Button'
import { resetPasswordApi } from '@/api/user'
import { onMounted, ref, unref } from 'vue'
import { useDepartmentStore } from '@/store/modules/department'
const { required, phone } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object as PropType<DepartmentUserItem2>,
    default: () => undefined
  }
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
    delete formData?.department
    delete formData?.roleArr
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
    // deep: true,
    immediate: true
  }
)

defineExpose({
  submit
})

const { getRoleSelectList } = usePermissionStore()
const { getDepartmentOptionList } = useDepartmentStore()
const selectList = ref<any[]>([])
const departmentOption = ref<any[]>([])
onMounted(async () => {
  selectList.value = await getRoleSelectList()
  console.log('🚀 ~ onMounted ~ selectList.value:', selectList.value)
  departmentOption.value = await getDepartmentOptionList()
  console.log('🚀 ~ onMounted ~ departmentOption.value:', departmentOption.value)
})
const { t } = useI18n()

const rules = reactive({
  username: [required(), { min: 2, max: 16, message: '用户名称长度需要2-16位' }],
  phone: [required(), phone()]
})

const getResetTime = ref(99)
const resetPwding = ref(false)
const newPwd = ref('')
const resetPwd = async () => {
  resetPwding.value = true
  const timer = setInterval(() => {
    getResetTime.value--
    if (getResetTime.value <= 0) {
      clearInterval(timer)
      getResetTime.value = 60
      resetPwding.value = false
    }
  }, 1000)
  //  发起后端请求
  try {
    if (props.currentRow) {
      const { id } = props.currentRow
      const res = await resetPasswordApi({ id, password: newPwd.value.trim() || '123456' })
      const idx = res?.id
      if (idx) {
        return ElMessage.success('重置成功!')
      }
    }
    return ElMessage.error('重置失败!')
  } catch (error) {
    console.log('🚀 ~ xzz: resetPwd -> error', error)
  }
}
const formSchema = ref<FormSchema[]>([
  {
    field: 'username',
    label: t('userDemo.username'),
    component: 'Input'
  },
  {
    field: 'phone',
    label: '手机号',
    component: 'Input'
  },
  {
    field: 'department.id',
    label: t('userDemo.department'),
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
      clearable: true,
      on: {
        change: (val: string) => {
          setValues({ departmentId: val })
        }
      }
    },
    optionApi: async () => {
      return departmentOption
    }
  },
  {
    field: 'roles',
    label: t('userDemo.role'),
    component: 'Select',
    // value: (data: any) => {
    //   console.log('🚀 ~ xzz: data', data)
    //   return data?.roles.map((v) => v.id)
    // },
    componentProps: {
      multiple: true,
      collapseTags: true,
      maxCollapseTags: 1
    },
    optionApi: () => {
      // 此处不可以使用store数据，因为store数据是响应式的，会导致表单数据不更新, 循环卡死
      return selectList
    }
  },
  {
    field: 'status',
    label: t('userDemo.status'),
    component: 'Select',
    value: true,
    componentProps: {
      // span: 24,
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
    field: 'resetPwd',
    // label: '重置密码',
    colProps: {
      span: 16
    },
    formItemProps: {
      slots: {
        default: (_data) => {
          // if (!data?.id) return null
          return (
            <div class="w-[100%] flex mt-50">
              <ElInput v-model={newPwd.value} placeholder="请输入重置密码,默认为123456" />
              <BaseButton
                type="primary"
                disabled={unref(resetPwding)}
                class="ml-10px"
                onClick={resetPwd}
              >
                重置密码
                {unref(resetPwding) ? `(${unref(getResetTime)})` : ''}
              </BaseButton>
            </div>
          )
        }
      }
    }
  }
])
</script>

<template>
  <Form :rules="rules" @register="formRegister" :schema="formSchema" />
</template>
