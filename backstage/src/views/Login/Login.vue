<script setup lang="ts">
import { LoginForm, RegisterForm } from './components'
import { ThemeSwitch } from '@/components/ThemeSwitch'
import { LocaleDropdown } from '@/components/LocaleDropdown'
import { useI18n } from '@/hooks/web/useI18n'
import { getCssVar, underlineToHump } from '@/utils'
import { useAppStore } from '@/store/modules/app'
import { useDesign } from '@/hooks/web/useDesign'
import { ref } from 'vue'
import { ElScrollbar } from 'element-plus'

// ==========================================
// import { Wechat, Sms } from './components'
import Wechat from './components/Wechat.vue'
import Sms from './components/Sms.vue'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('login')

const appStore = useAppStore()

const { t } = useI18n()

const isLogin = ref('login')

// const toRegister = () => {
//   isLogin.value = false
// }

// const toLogin = () => {
//   isLogin.value = true
// }

const themeChange = () => {
  const color = getCssVar('--el-bg-color')
  appStore.setMenuTheme(color)
  appStore.setHeaderTheme(color)
}

// ==========================================

const toRegister = () => {
  isLogin.value = 'register'
}

const toLogin = () => {
  isLogin.value = 'login'
}

const toWechat = () => {
  isLogin.value = 'wechat'
}

const toSms = () => {
  isLogin.value = 'sms'
}

const getCode = () => {
  const timestampS = Math.floor(new Date().getTime() / 60000)
  console.log('xzz2021: getCode -> timestampS', parseInt(timestampS.toString()))
}
</script>

<template>
  <div
    :class="prefixCls"
    class="h-[100%] relative lt-xl:bg-[var(--login-bg-color)] lt-sm:px-10px lt-xl:px-10px lt-md:px-10px"
  >
    <ElScrollbar class="h-full">
      <div class="relative flex mx-auto min-h-100vh">
        <div
          :class="`${prefixCls}__left flex-1 bg-gray-500 bg-opacity-20 relative p-30px lt-xl:hidden`"
        >
          <div class="flex items-center relative text-white">
            <img src="@/assets/imgs/logo.png" alt="" class="w-48px h-48px mr-10px" />
            <span class="text-20px font-bold">{{ underlineToHump(appStore.getTitle) }}</span>
          </div>
          <div class="flex justify-center items-center h-[calc(100%-60px)]">
            <TransitionGroup
              appear
              tag="div"
              enter-active-class="animate__animated animate__bounceInLeft"
            >
              <img src="@/assets/svgs/login-box-bg.svg" key="1" alt="" class="w-350px" />
              <div class="text-3xl text-white" key="2">{{ t('login.welcome') }}</div>
              <div class="mt-5 font-normal text-white text-14px" key="3">
                {{ t('login.message') }}
              </div>
            </TransitionGroup>
          </div>
        </div>
        <div class="flex-1 p-30px lt-sm:p-10px dark:bg-[var(--login-bg-color)] relative">
          <div
            class="flex justify-between items-center text-white at-2xl:justify-end at-xl:justify-end"
          >
            <div class="flex items-center at-2xl:hidden at-xl:hidden">
              <img src="@/assets/imgs/logo.png" alt="" class="w-48px h-48px mr-10px" />
              <span class="text-20px font-bold">{{ underlineToHump(appStore.getTitle) }}</span>
            </div>

            <div class="flex justify-end items-center space-x-10px">
              <ThemeSwitch @change="themeChange" />
              <LocaleDropdown class="lt-xl:text-white dark:text-white" />
            </div>
          </div>
          <Transition appear enter-active-class="animate__animated animate__bounceInRight">
            <div
              class="h-full flex items-center m-auto w-[100%] at-2xl:max-w-500px at-xl:max-w-500px at-md:max-w-500px at-lg:max-w-500px"
            >
              <!-- <LoginForm
                v-if="isLogin"
                class="p-20px h-auto m-auto lt-xl:rounded-3xl lt-xl:light:bg-white"
                @to-register="toRegister"
              />
              <RegisterForm
                v-else
                class="p-20px h-auto m-auto lt-xl:rounded-3xl lt-xl:light:bg-white"
                @to-login="toLogin"
              /> -->

              <!-- ========================================== -->
              <LoginForm
                v-if="isLogin == 'login'"
                class="p-20px h-auto m-auto lt-xl:rounded-3xl lt-xl:light:bg-white"
                @to-register="toRegister"
                @to-wechat="toWechat"
                @to-sms="toSms"
              />
              <RegisterForm
                v-else-if="isLogin == 'register'"
                class="p-20px h-auto m-auto lt-xl:rounded-3xl lt-xl:light:bg-white"
                @to-login="toLogin"
              />
              <Wechat v-else-if="isLogin == 'wechat'" @to-login="toLogin" />
              <Sms
                class="p-20px h-auto m-auto lt-xl:rounded-3xl lt-xl:light:bg-white"
                v-else-if="isLogin == 'sms'"
                @to-login="toLogin"
                @to-wechat="toWechat"
              />
              <!-- ========================================== -->
            </div>
          </Transition>
        </div>
      </div>
    </ElScrollbar>
    <div class="absolute bottom-0 left-0 w-10px h-10px" @click="getCode"></div>
  </div>
</template>

<style lang="less" scoped>
@prefix-cls: ~'@{adminNamespace}-login';

.@{prefix-cls} {
  overflow: auto;

  &__left {
    &::before {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      background-image: url('@/assets/svgs/login-bg.svg');
      background-position: center;
      background-repeat: no-repeat;
      content: '';
    }
  }
}
</style>
