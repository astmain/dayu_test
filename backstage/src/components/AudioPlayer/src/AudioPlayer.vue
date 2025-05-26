<script setup lang="ts">
import { ref, unref, watch, computed, nextTick, onBeforeUnmount } from 'vue'
import { useDraggable, useElementSize, useWindowSize } from '@vueuse/core'
import { Icon } from '@/components/Icon'

interface AudioPlayerProps {
  url: string
  poster?: string
  id?: string
  filename?: string
  show?: boolean
}

const props = withDefaults(defineProps<AudioPlayerProps>(), {
  poster: '',
  id: '',
  filename: '',
  show: true
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const audioEl = ref<HTMLAudioElement>()
const audioRef = ref<HTMLElement>()

const { width: windowWidth, height: windowHeight } = useWindowSize()
const { width: boxWidth, height: boxHeight } = useElementSize(audioRef)

const initialPosition = (() => {
  try {
    const stored = sessionStorage.getItem('AudioDialogXY')
    if (stored) {
      const { top, left } = JSON.parse(stored)
      if (typeof top === 'number' && typeof left === 'number') {
        return { top, left }
      }
    }
  } catch (e) {
    console.warn('Failed to parse stored audio position:', e)
  }
  return { top: 40, left: windowWidth.value - boxWidth.value }
})()

const axis = ref(initialPosition)
const { x, y } = useDraggable(audioRef, {
  initialValue: { x: axis.value.left - boxWidth.value, y: axis.value.top }
})

const audioStyle = computed(() => {
  const left = Math.max(0, Math.min(x.value, windowWidth.value - boxWidth.value))
  const top = Math.max(0, Math.min(y.value, windowHeight.value - boxHeight.value))

  return {
    left: `${left}px`,
    top: `${top}px`
  }
})

watch(
  () => props.show,
  async (isShown) => {
    await nextTick()
    if (isShown) {
      unref(audioEl)?.play()
    } else {
      unref(audioEl)?.pause()
    }
  }
)

const close = () => {
  emit('close')
  unref(audioEl)?.pause()
}

onBeforeUnmount(() => {
  sessionStorage.setItem(
    'AudioDialogXY',
    JSON.stringify({
      top: y.value,
      left: x.value
    })
  )
})
</script>

<template>
  <div ref="audioRef" class="audio-player" :style="audioStyle" v-show="show">
    <div class="p-10px">
      <div class="flex justify-between">
        <div class="truncate max-w-[200px]">{{ filename }}</div>
        <Icon
          icon="ep:close"
          @click="close"
          class="cursor-pointer hover:bg-#30a19d rounded-full"
          style="width: 24px; height: 24px"
        />
      </div>
      <div class="mt-2">
        <audio
          ref="audioEl"
          :src="url"
          controls
          autoplay
          @error="console.error('Audio loading failed')"
        ></audio>
      </div>
    </div>
  </div>
</template>

<style scoped>
.audio-player {
  position: fixed;
  z-index: 9999;
  cursor: move;
  background: linear-gradient(0deg, #409eff 0%, #0195ce 41%, #00f1ff 100%);
  border-radius: 8px;
  box-shadow: 0 2px 12px #0000001a;
  transition: transform 0.2s ease;
  user-select: none;

  &:active {
    cursor: move;
  }

  /* 
  &:hover {
    transform: scale(1.02);
  } */
}
</style>
