import { getDepartmentListApi } from '@/api/department'
import { DepartmentItem2 } from '@/api/department/types'
import { formatToTree } from '@/utils/tree2'
import { defineStore } from 'pinia'
import { ref } from 'vue'

interface DepartmentOptionItem {
  id: number
  parentId: number | null
  sort: number | null
  name: string
  value: number
  children?: DepartmentOptionItem[]
}

export const useDepartmentStore = defineStore('department', () => {
  const departmentList = ref<DepartmentItem2[]>([])
  const departmentOptionList = ref<DepartmentOptionItem[]>([])

  const getDepartmentList = async (params: any) => {
    const res = await getDepartmentListApi(params)
    const { list = [], total = 0 } = res
    const treeList = formatToTree(list)
    departmentList.value = treeList
    const optionList = list.map((item) => ({
      id: item.id,
      parentId: item.parentId,
      sort: item?.sort || 0,
      name: item.name,
      value: item.id
    }))
    departmentOptionList.value = formatToTree(optionList)
    return { list: treeList, total }
  }

  const getDepartmentOptionList = async () => {
    if (departmentOptionList.value.length == 0) {
      await getDepartmentList({})
    }
    return departmentOptionList.value
  }

  return {
    departmentList,
    departmentOptionList,
    getDepartmentList,
    getDepartmentOptionList
  }
})
