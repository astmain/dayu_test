<script setup lang="tsx">
import { NoticeItem } from '@/api/notice/types'
import { PropType } from 'vue'
import { formatToDateTime } from '@/utils/dateUtil'
import { ContentWrap } from '@/components/ContentWrap'
// import { ElTag } from 'element-plus'
defineProps({
  currentRow: {
    type: Object as PropType<Nullable<NoticeItem>>,
    default: () => null
  }
})
</script>

<template>
  <div class="flex flex-col gap-2 items-center justify-center mb-4">
    <h1>{{ currentRow?.title }} </h1>
    <div class="flex gap-4 items-center">
      <!-- <div>
        <span>发布状态: </span>
        <ElTag type="success" v-if="currentRow?.isPublished">已发布</ElTag>
        <ElTag type="danger" v-else>未发布</ElTag>
      </div> -->
      <div>
        <span>发布人: </span>
        <span>{{ currentRow?.creator?.username }}</span>
      </div>
      <div>
        <span>发布时间: </span>
        <span class="text-sm">{{ formatToDateTime(currentRow?.createdAt) }}</span>
      </div>
    </div>
  </div>
  <ContentWrap>
    <div v-html="currentRow?.content"></div>
  </ContentWrap>
</template>
