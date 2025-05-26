<script setup lang="ts">
import { Icon } from '@/components/Icon'
import { useRouter } from 'vue-router'
import { ElBadge } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import useWebSocket from '@/hooks/websocket/index'
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useDictionaryStore } from '@/store/modules/dictionary'
const userStore = useUserStore()
const { getUnReadCount } = storeToRefs(userStore)
const { push } = useRouter()
const { registerHandler } = useWebSocket()

onMounted(() => {
  useDictionaryStore().updateDictionaryList()
  userStore.setUnReadCount()
  // 订阅 chat 类型的消息

  registerHandler('newNotice', (msg: number[]) => {
    console.log('收到新通知:', msg)
    // 可在这里更新组件状态
    if (msg.includes(userStore?.getUserInfo?.id as number)) {
      userStore.setUnReadCount()
    }
  })
})
</script>
<!-- @click="push('/system/notices')" -->
<template>
  <div
    class="custom-hover"
    color="var(--top-header-text-color)"
    @click="push('/personal/notification')"
  >
    <ElBadge :value="getUnReadCount" class="item" :show-zero="false" style="height: 18px">
      <Icon :size="18" icon="mingcute:notification-line" class="cursor-pointer !p-0" />
    </ElBadge>
  </div>
</template>
