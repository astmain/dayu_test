<script setup lang="ts">
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElMessage } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { useDesign } from '@/hooks/web/useDesign'
import LockDialog from './components/LockDialog.vue'
import { ref, computed } from 'vue'
import LockPage from './components/LockPage.vue'
import { useLockStore } from '@/store/modules/lock'
import { useUserStore } from '@/store/modules/user'
import { useRouter } from 'vue-router'
import useWebSocket from '@/hooks/websocket/index'
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import defaultAvatar from '@/assets/imgs/avatar.jpg'
const { registerHandler } = useWebSocket()

onMounted(() => {
  // 订阅 chat 类型的消息
  registerHandler('logout', (msg) => {
    console.log('收到强制退出命令:', msg)
    // 可在这里更新组件状态
    ElMessage.error({ message: '收到强制退出命令, 即将退出登录...', duration: 3000 })
    setTimeout(() => {
      userStore.cmdLogout()
    }, 3000)
  })
})

const { push } = useRouter()

const userStore = useUserStore()

const { userInfo } = storeToRefs(userStore)

const lockStore = useLockStore()

const getIsLock = computed(() => lockStore.getLockInfo?.isLock ?? false)

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('user-info')

const { t } = useI18n()

const loginOut = () => {
  userStore.logoutConfirm()
}

const dialogVisible = ref<boolean>(false)

// 锁定屏幕
const lockScreen = () => {
  dialogVisible.value = true
}

const toPage = (path: string) => {
  push(path)
}
</script>

<template>
  <ElDropdown class="custom-hover" :class="prefixCls" trigger="click">
    <div class="flex items-center">
      <img
        :src="userInfo?.avatar || defaultAvatar"
        alt=""
        class="w-[calc(var(--logo-height)-25px)] rounded-[50%]"
      />
      <span class="<lg:hidden text-14px pl-[5px] text-[var(--top-header-text-color)]">{{
        userInfo?.username
      }}</span>
    </div>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem @click="toPage('/personal/personal-center')">
          <div>
            {{ t('router.personalCenter') }}
          </div>
        </ElDropdownItem>
        <ElDropdownItem divided @click="lockScreen">
          <div>{{ t('lock.lockScreen') }}</div>
        </ElDropdownItem>
        <ElDropdownItem @click="loginOut">
          <div>{{ t('common.loginOut') }}</div>
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>

  <LockDialog v-if="dialogVisible" v-model="dialogVisible" />
  <teleport to="body">
    <transition name="fade-bottom" mode="out-in">
      <LockPage v-if="getIsLock" />
    </transition>
  </teleport>
</template>

<style scoped lang="less">
.fade-bottom-enter-active,
.fade-bottom-leave-active {
  transition:
    opacity 0.25s,
    transform 0.3s;
}

.fade-bottom-enter-from {
  opacity: 0;
  transform: translateY(-10%);
}

.fade-bottom-leave-to {
  opacity: 0;
  transform: translateY(10%);
}
</style>
