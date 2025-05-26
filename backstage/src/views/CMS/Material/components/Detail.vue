<script setup lang="tsx">
import { PropType, ref } from 'vue'
import { Descriptions, DescriptionsSchema } from '@/components/Descriptions'
import { useDictionaryStore } from '@/store/modules/dictionary'
import { storeToRefs } from 'pinia'

defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => undefined
  }
})

// const renderTag = (enable?: boolean) => {
//   return <ElTag type={!enable ? 'danger' : 'success'}>{enable ? '启用' : '禁用'}</ElTag>
// }
const dictionaryStore = useDictionaryStore()
const { dictionaryMap } = storeToRefs(dictionaryStore)

const detailSchema = ref<DescriptionsSchema[]>([
  {
    field: 'name',
    label: '名称'
  },
  {
    field: 'code',
    label: '型号'
  },
  {
    field: 'property',
    label: '特性'
  },
  {
    field: 'color',
    label: '颜色'
  },
  {
    field: 'type',
    label: '材料分类',
    slots: {
      default: (data: any) => {
        return (
          <span>
            {dictionaryMap.value['MATERIAL_TYPE'].find((item) => item.value === data.type)?.label}
          </span>
        )
      }
    }
  },
  {
    field: 'process',
    label: '成型工艺',
    slots: {
      default: (data: any) => {
        return (
          <span>
            {
              dictionaryMap.value['MATERIAL_PROCESS'].find((item) => item.value === data.process)
                ?.label
            }
          </span>
        )
      }
    }
  },
  // {
  //   field: 'status',
  //   label: '状态',
  //   slots: {
  //     default: (data: any) => {
  //       return renderTag(data.status)
  //     }
  //   }
  // },
  {
    field: 'note',
    label: '备注',
    span: 24
  }
])
</script>

<template>
  <Descriptions :schema="detailSchema" :data="currentRow || {}" />
</template>
