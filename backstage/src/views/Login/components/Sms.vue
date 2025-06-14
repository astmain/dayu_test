<script setup lang="tsx">
import { reactive, ref, onMounted, unref, onUnmounted } from 'vue'
import { Form, FormSchema } from '@/components/Form'
import { useI18n } from '@/hooks/web/useI18n'
import { ElInput, ElMessage } from 'element-plus'
import { useForm } from '@/hooks/web/useForm'
import { getSmsCode, smsLoginApi } from '@/api/login'
import { UserType2 } from '@/api/login/types'
import { useValidator } from '@/hooks/web/useValidator'
import { Icon } from '@/components/Icon'
import { useUserStore } from '@/store/modules/user'
import { BaseButton } from '@/components/Button'
import { useLogin } from './hooks'
import SmsBindForm from './SmsBindForm.vue'
const { required, phone } = useValidator()

const emit = defineEmits(['to-register', 'to-wechat', 'to-login'])

const userStore = useUserStore()

const { t } = useI18n()

const rules = {
  phone: [required(), phone()],
  code: [required()]
}

const schema = reactive<FormSchema[]>([
  {
    field: 'title',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return <h2 class="text-2xl font-bold text-center w-[100%]">验证码登录</h2>
        }
      }
    }
  },
  {
    field: 'phone',
    label: t('login.phone'),
    // value: 'admin',
    component: 'Input',
    colProps: {
      span: 24
    }
    // componentProps: {
    //   // placeholder: 'admin or test'
    //   defaultValue: 13077908822
    // }
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
  {
    field: 'login',
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
                  loading={loading.value}
                  type="primary"
                  class="w-[100%]"
                  onClick={signIn}
                >
                  {t('login.login')}
                </BaseButton>
              </div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'other',
    component: 'Divider',
    label: t('login.otherLogin'),
    componentProps: {
      contentPosition: 'center'
    }
  },
  {
    field: 'otherIcon',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="flex justify-between w-[100%]">
                <div onClick={toLogin}>
                  <Icon
                    icon="vi-ant-design:lock-outlined"
                    size={iconSize}
                    class="cursor-pointer ant-icon"
                    color={iconColor}
                    hoverColor={hoverColor}
                  />
                </div>
                <div onClick={toWechat}>
                  <Icon
                    icon="vi-ant-design:wechat-filled"
                    size={iconSize}
                    class="cursor-pointer ant-icon"
                    color={iconColor}
                    hoverColor={hoverColor}
                  />
                </div>
                <Icon
                  icon="vi-ant-design:alipay-circle-filled"
                  size={iconSize}
                  color={iconColor}
                  hoverColor={hoverColor}
                  class="cursor-pointer ant-icon"
                />
                <Icon
                  icon="vi-ant-design:weibo-circle-filled"
                  size={iconSize}
                  color={iconColor}
                  hoverColor={hoverColor}
                  class="cursor-pointer ant-icon"
                />
              </div>
            </>
          )
        }
      }
    }
  }
])

const iconSize = 30

const initLoginInfo = () => {
  const loginInfo = userStore.getLoginInfo
  if (loginInfo) {
    const { phone } = loginInfo
    setValues({ phone })
  }
}

const getCodeTime = ref(60)
const getCodeLoading = ref(false)
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
  const res = await getSmsCode({ phone, type: 'login' })
  if (res?.code === 200) {
    ElMessage.success('验证码发送成功')
  } else {
    ElMessage.error('验证码发送失败')
  }
}

const toWechat = () => {
  emit('to-wechat')
}

const toLogin = () => {
  emit('to-login')
}

onMounted(() => {
  initLoginInfo()
})

const { formRegister, formMethods } = useForm()
const { getFormData, getElFormExpose, setValues } = formMethods

const loading = ref(false)

const iconColor = '#999'
const phoneNumber = ref('')
const hoverColor = 'var(--el-color-primary)'
const { successLogin } = useLogin()
const toBindPage = ref(false)
// 登录
const signIn = async () => {
  const formRef = await getElFormExpose()
  await formRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      const formData = await getFormData<{ phone: string; code: string }>()
      try {
        const res = await smsLoginApi(formData)
        const { access_token, userinfo } = res
        if (access_token) {
          //  说明已有绑定
          successLogin(userinfo as UserType2, access_token as string)
        } else if (userinfo) {
          //  说明未绑定  跳转绑定信息
          phoneNumber.value = formData.phone
          toBindPage.value = true
        } else {
          ElMessage.error('登录失败')
        }
      } finally {
        loading.value = false
      }
    }
  })
}
onUnmounted(() => {
  toBindPage.value = false
})
</script>

<template>
  <Form
    v-if="!toBindPage"
    :schema="schema"
    :rules="rules"
    label-position="top"
    hide-required-asterisk
    size="large"
    class="dark:(border-1 border-[var(--el-border-color)] border-solid)"
    @register="formRegister"
  />
  <SmsBindForm v-else :phoneNumber="phoneNumber" />
</template>
