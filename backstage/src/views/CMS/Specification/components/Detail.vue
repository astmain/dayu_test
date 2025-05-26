<script setup lang="tsx">
import { PropType, ref } from 'vue'
import { Descriptions, DescriptionsSchema } from '@/components/Descriptions'

defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => undefined
  }
})

const detailSchema = ref<DescriptionsSchema[]>([
  {
    field: 'name',
    label: '名称'
  },
  {
    field: 'is_tag',
    label: '是否标签'
  }
  // {
  //   field: 'list',
  //   label: '规格'
  // }
  // {
  //   field: 'note',
  //   label: '备注',
  //   span: 24
  // }
])
</script>

<template>
  <Descriptions :schema="detailSchema" :data="currentRow || {}" />
</template>
