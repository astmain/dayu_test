<script setup lang="tsx">
import { PropType, reactive } from 'vue'
import { DepartmentItem } from '@/api/department/types'
import { Descriptions, DescriptionsSchema } from '@/components/Descriptions'
import { ElText } from 'element-plus'
import { formatToDateTime } from '@/utils/dateUtil'

defineProps({
  currentRow: {
    type: Object as PropType<Nullable<DepartmentItem>>,
    default: () => null
  }
})

const detailSchema = reactive<DescriptionsSchema[]>([
  {
    field: 'username',
    label: '操作人'
  },
  {
    field: 'resCode',
    label: '响应状态',
    slots: {
      default: (data: any) => {
        const resCode = data?.resCode
        return (
          <ElText type={resCode == 200 ? 'success' : 'danger'}>
            {resCode == 200 ? '成功' : '失败'}
          </ElText>
        )
      }
    }
  },
  {
    field: 'duration',
    label: '响应时长'
  },
  {
    field: 'timestamp',
    label: '操作时间',
    slots: {
      default: (data: any) => {
        return <>{formatToDateTime(data.timestamp)}</>
      }
    }
  }
])
</script>

<template>
  <Descriptions :schema="detailSchema" :data="currentRow || {}" />
</template>
