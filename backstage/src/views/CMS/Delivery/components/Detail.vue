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
    field: 'duration',
    label: '加急天数'
  },
  {
    field: 'price',
    label: '费用'
  },
  {
    field: 'description',
    label: '备注',
    span: 24
  }
])
</script>

<template>
  <Descriptions :schema="detailSchema" :data="currentRow || {}" />
</template>
