<template>
  <div class="w-full h-[100px] flex justify-center items-center gap-1 px-1">
    <!-- <img v-if="isImage(extension)" :src="url" alt="" class="w-full h-full object-cover" /> -->
    <!-- <img v-else :src="getFileIcon(item.extension)" alt="" /> -->
    <!-- <div class="flex items-center"> </div> -->
    <RenderPreview class="cursor-pointer" />
    <div class="cursor-pointer leading-none" @click="copyUrl(url)">
      <Icon icon="vi-ep:document-copy" class="" />
    </div>
  </div>
</template>
<script setup lang="tsx">
import { getFileType } from '@/utils/file'
import { Icon } from '@/components/Icon'
import { useClipboard } from '@vueuse/core'
import { createVideoViewer } from '@/components/VideoPlayer'
import { ElImage, ElMessage } from 'element-plus'
import { defineComponent } from 'vue'
import { createAudioViewer } from '@/components/AudioPlayer'
import ScrollText from './ScrollText.vue'
interface PropsItem {
  extension: string
  url: string
  filename: string
}
const props = defineProps<PropsItem>()
const { copy } = useClipboard()
const copyUrl = (url: string) => {
  copy(url)
  ElMessage.success('文件链接复制成功')
}
const RenderPreview = defineComponent({
  render() {
    const type = getFileType(props.extension)
    const url = props.url
    const filename = props.filename
    switch (type) {
      case 'image':
        return (
          <ElImage
            src={url}
            fit="cover"
            class="w-[100%]"
            lazy
            preview-src-list={[url]}
            preview-teleported
          />
        )
      case 'audio':
        return (
          <div
            onClick={() => createAudioViewer({ url, filename })}
            class="w-full flex items-center"
          >
            <Icon icon="vi-tdesign:music" style={{ color: '#0dc70b' }} />
            <ScrollText text={filename} />
          </div>
        )
      case 'video':
        return (
          <div
            onClick={() => {
              createVideoViewer({
                url
              })
            }}
            class="w-full flex items-center"
          >
            <Icon icon="vi-tdesign:video-camera-music" style={{ color: '#ff6b12' }} />
            <ScrollText text={filename} />
          </div>
        )
      case 'doc':
        return (
          <div class="w-full flex items-center">
            <Icon icon="vi-ep:document" style={{ color: '#0070ff' }} />
            <ScrollText text={filename} />
          </div>
        )
      case 'other':
        return <div>{filename}</div>
      default:
        return null
    }
  }
})
</script>

<style scoped>
.scrolling-text {
  position: relative;
  display: inline-block;
  overflow: hidden; /* 隐藏超出容器的部分 */
  white-space: nowrap; /* 保证文字在一行 */
  animation: scroll 10s linear infinite; /* 10s 循环滚动 */
}

@keyframes scroll {
  0% {
    transform: translateX(100%); /* 从右侧开始 */
  }

  100% {
    transform: translateX(-100%); /* 滚动到左侧 */
  }
}
</style>
