<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { reactive, ref, unref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { useForm } from '@/hooks/web/useForm'
import { ElInput, FormRules } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
import { BaseButton } from '@/components/Button'
// import { IAgree } from '@/components/IAgree'

// ==========================================
import { getSmsCode, registerApi } from '@/api/login'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['to-login'])

const { formRegister, formMethods } = useForm()
const { getElFormExpose, getFormData } = formMethods

const { t } = useI18n()

const { required, lengthRange, phone, numberLength } = useValidator()

const getCodeTime = ref(60)
const getCodeLoading = ref(false)
// const getCode = () => {
//   getCodeLoading.value = true
//   const timer = setInterval(() => {
//     getCodeTime.value--
//     if (getCodeTime.value <= 0) {
//       clearInterval(timer)
//       getCodeTime.value = 60
//       getCodeLoading.value = false
//     }
//   }, 1000)
// }

const schema = reactive<FormSchema[]>([
  {
    field: 'title',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return <h2 class="text-2xl font-bold text-center w-[100%]">{t('login.register')}</h2>
        }
      }
    }
  },
  {
    field: 'username',
    label: t('login.username'),
    value: '',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('login.usernamePlaceholder')
    }
  },
  {
    field: 'phone',
    label: t('login.phone'),
    value: '',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('login.phonePlaceholder')
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
    field: 'code',
    label: t('login.code'),
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: (formData) => {
          return (
            <div class="w-[100%] flex">
              <ElInput v-model={formData.code} placeholder={t('login.codePlaceholder')} />
              <BaseButton
                type="primary"
                disabled={unref(getCodeLoading)}
                class="ml-10px"
                onClick={getCode}
              >
                {t('login.getCode')}
                {unref(getCodeLoading) ? `(${unref(getCodeTime)})` : ''}
              </BaseButton>
            </div>
          )
        }
      }
    }
  },

  // {
  //   field: 'iAgree',
  //   colProps: {
  //     span: 24
  //   },
  //   formItemProps: {
  //     slots: {
  //       default: (formData: any) => {
  //         return (
  //           <>
  //             <IAgree
  //               v-model={formData.iAgree}
  //               text="我同意《用户协议》"
  //               link={[
  //                 {
  //                   text: '《用户协议》',
  //                   url: 'https://element-plus.org/'
  //                 }
  //               ]}
  //             />
  //           </>
  //         )
  //       }
  //     }
  //   }
  // },
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
                  {t('login.register')}
                </BaseButton>
              </div>
              <div class="w-[100%] mt-15px">
                <BaseButton class="w-[100%]" onClick={toLogin}>
                  {t('login.hasUser')}
                </BaseButton>
              </div>
            </>
          )
        }
      }
    }
  }
])

// const rules: FormRules = {
//   username: [required()],
//   password: [required()],
//   check_password: [required()],
//   code: [required()],
//   iAgree: [required(), check()]
// }

const toLogin = () => {
  emit('to-login')
}

const loading = ref(false)

// ==========================================
const getCode = async () => {
  const formRef = await getElFormExpose()
  const isPhone = await formRef?.validateField('phone')
  if (!isPhone) {
    return ElMessage.error('请输入手机号')
  }
  getCodeLoading.value = true
  const timer = setInterval(() => {
    getCodeTime.value--
    if (getCodeTime.value <= 0) {
      clearInterval(timer)
      getCodeTime.value = 60
      getCodeLoading.value = false
    }
  }, 1000)
  // 向后端请求发送验证码
  const formData = await getFormData()
  const { phone } = formData
  const res = await getSmsCode({ phone, type: 'register' })
  console.log('xzz2021: getCode -> res', res)
  if (res.code == 200) {
    ElMessage.success('验证码发送成功')
  } else {
    ElMessage.error('验证码发送失败')
  }
}

const validatecheckPwd = async (_rule: any, value: any, callback: any) => {
  const formData = await getFormData()
  if (value !== formData.password) {
    callback(new Error('两次输入的密码不一致!'))
  } else {
    callback()
  }
}
const rules: FormRules = {
  username: [required(), lengthRange({ min: 2, max: 16 })],
  phone: [required(), phone()],
  password: [required(), lengthRange({ min: 6, max: 16 })],
  check_password: [required(), { asyncValidator: validatecheckPwd, trigger: 'blur' }],
  code: [required(), numberLength(6)]
}

const loginRegister = async () => {
  const formRef = await getElFormExpose()
  formRef?.validate(async (valid) => {
    if (valid) {
      try {
        const formData = await getFormData()
        console.log('xzz2021: loginRegister -> formData', formData)
        loading.value = true
        const { password, phone, username, code } = formData
        const res = await registerApi({ password, phone, username, code })
        const id = res?.data?.phone
        if (id) {
          ElMessage.success('注册成功, 欢迎登陆!')
          toLogin()
        } else {
          ElMessage.error('注册失败, 请重试!')
        }
      } finally {
        loading.value = false
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
