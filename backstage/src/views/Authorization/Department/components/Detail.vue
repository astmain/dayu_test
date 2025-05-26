<script setup lang="tsx">
import { PropType } from 'vue'
import { DepartmentItem } from '@/api/department/types'
import { Descriptions, DescriptionsSchema } from '@/components/Descriptions'

// ==========================================
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElTag } from 'element-plus'
import { formatToDateTime } from '@/utils/dateUtil'

defineProps({
  currentRow: {
    type: Object as PropType<Nullable<DepartmentItem>>,
    default: () => null
  }
})

// ==========================================
const { t } = useI18n()

const detailSchema = reactive<DescriptionsSchema[]>([
  {
    field: 'name',
    label: t('userDemo.departmentName')
  },
  {
    field: 'status',
    label: t('userDemo.status'),
    slots: {
      default: (data: any) => {
        const status = data?.status
        return <ElTag type={status ? 'success' : 'danger'}>{status ? '启用' : '禁用'}</ElTag>
      }
    }
  },
  {
    field: 'createdAt',
    label: t('tableDemo.displayTime'),
    // width: '400px',
    slots: {
      default: (data: any) => {
        return <>{formatToDateTime(data.createdAt)}</>
      }
    }
  },
  {
    field: 'remark',
    label: t('userDemo.remark')
  }
])
</script>

<template>
  <Descriptions :schema="detailSchema" :data="currentRow || {}" />
</template>
