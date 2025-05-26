<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { reactive, ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { useForm } from '@/hooks/web/useForm'
import { ElMessage, FormRules } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
import { BaseButton } from '@/components/Button'
import { useLogin } from './hooks'
import { smsBind } from '@/api/login'

const { formRegister, formMethods } = useForm()
const { getElFormExpose, getFormData } = formMethods

const { t } = useI18n()

const { required, lengthRange, phone } = useValidator()

const props = defineProps<{
  phoneNumber: string
}>()

const schema = reactive<FormSchema[]>([
  {
    field: 'title',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return <h2 class="text-2xl font-bold text-center w-[100%]">绑定信息</h2>
        }
      }
    }
  },

  {
    field: 'phone',
    label: t('login.phone'),
    value: props.phoneNumber,
    component: 'Input',
    componentProps: {
      disabled: true
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'username',
    label: t('login.username'),
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('login.usernamePlaceholder')
    }
  },
  {
    field: 'password',
    label: t('login.password'),
    value: '',
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    componentProps: {
      style: {
        width: '100%'
      },
      strength: true,
      placeholder: t('login.passwordPlaceholder')
    }
  },
  {
    field: 'check_password',
    label: t('login.checkPassword'),
    value: '',
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    componentProps: {
      style: {
        width: '100%'
      },
      strength: true,
      placeholder: t('login.passwordPlaceholder')
    }
  },
  {
    field: 'register',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="w-[100%]">
                <BaseButton
                  type="primary"
                  class="w-[100%]"
                  loading={loading.value}
                  onClick={loginRegister}
                >
                  确认绑定
                </BaseButton>
              </div>
            </>
          )
        }
      }
    }
  }
])

const validatecheckPwd = async (_rule: any, value: any, callback: any) => {
  const formData = await getFormData()
  if (value !== formData.password) {
    callback(new Error('两次输入的密码不一致!'))
  } else {
    callback()
  }
}
const rules: FormRules = {
  phone: [required(), phone()],
  password: [required(), lengthRange({ min: 6, max: 16 })],
  check_password: [required(), { asyncValidator: validatecheckPwd, trigger: 'blur' }]
}

const loading = ref(false)

const { successLogin } = useLogin()

const loginRegister = async () => {
  const formRef = await getElFormExpose()
  formRef?.validate(async (valid) => {
    if (valid) {
      try {
        const formData = await getFormData()
        const res = await smsBind(formData)
        const { userinfo, access_token } = res
        if (access_token) {
          //  说明登录成功  设定token 路由跳转
          successLogin(userinfo, access_token)
        } else {
          ElMessage.error('绑定失败')
        }
      } catch (error) {
        console.error('xzz2021: onBeforeRouteUpdate -> error', error)
      }
    }
  })
}
</script>

<template>
  <Form
    :schema="schema"
    :rules="rules"
    label-position="top"
    hide-required-asterisk
    size="large"
    class="dark:(border-1 border-[var(--el-border-color)] border-solid)"
    @register="formRegister"
  />
</template>
