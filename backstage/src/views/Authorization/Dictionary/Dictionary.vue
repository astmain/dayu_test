<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'
import { ref, unref } from 'vue'
import { useTable } from '@/hooks/web/useTable'
import { Search } from '@/components/Search'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { Dialog } from '@/components/Dialog'
import { BaseButton } from '@/components/Button'

import type { FormSchema } from '@/components/Form'
import { formatToDateTime } from '@/utils/dateUtil'
import { ElMessage } from 'element-plus'
import TypeWrite from './components/TypeWrite.vue'
import { TableColumn } from '@/components/Table'
import { delDicEntryApi } from '@/api/dictionary'
const { t } = useI18n()
import { useDictionaryStore } from '@/store/modules/dictionary'
import { DictionaryEntry } from '@/api/dictionary/types'
const dictionaryStore = useDictionaryStore()
const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    // const params = {
    //   ...unref(searchParams)
    // }
    const dictionaryId = unref(currentNodeKey)
    // 触发更新字典   然后根据id索引到当前list
    const dicList = await dictionaryStore.getAllDictionaryList
    const currentDic = dicList.find((v) => v.id === dictionaryId)
    // 获取当前字典的key
    currentDicKey.value = currentDic?.code || ''
    const currentDicEntry = currentDic?.entries || []
    // 如果params 有值 则进行筛选
    return {
      list: currentDicEntry,
      total: currentDicEntry.length
    }
  },
  fetchDelApi: async () => {
    const res = await dictionaryStore.deleteDictEntry(unref(ids).map((v) => Number(v)))
    return !!res
  }
})

const { loading, dataList, pageSize, currentPage } = tableState
const { getList, getElTableExpose, delList } = tableMethods

// const searchParams = ref<{ name?: string; code?: string }>({})
const setSearchParams = (params: any) => {
  // currentPage.value = 1
  // searchParams.value = params
  // 筛选dataList
  if (Object.keys(params).length > 0) {
    const currentData = dataList.value.filter(
      (v) => v.name.includes(params.name) || v.code.includes(params.code)
    )
    dataList.value = currentData
  } else {
    getList()
  }
}

const currentDicKey = ref<string>('')
const tableColumns = ref<TableColumn[]>([
  {
    field: 'selection',
    type: 'selection'
  },

  {
    label: '名称',
    field: 'name'
  },
  {
    label: '编码',
    field: 'code'
  },
  {
    label: '描述',
    field: 'description'
  },
  {
    label: '创建时间',
    field: 'createdAt',
    slots: {
      default: (data: any) => {
        return <>{formatToDateTime(data.row.createdAt)}</>
      }
    }
  },
  {
    label: '操作',
    field: 'action',
    width: 240,
    slots: {
      default: (data: any) => {
        const row = data.row as { id: number; name: string }
        return (
          <>
            <BaseButton type="primary" onClick={() => action(row, 'edit')}>
              {t('exampleDemo.edit')}
            </BaseButton>
            <BaseButton type="success" onClick={() => action(row, 'detail')}>
              {t('exampleDemo.detail')}
            </BaseButton>
            <BaseButton type="danger" onClick={() => delData(row)}>
              {t('exampleDemo.del')}
            </BaseButton>
          </>
        )
      }
    }
  }
])

const dialogVisible = ref(false)
const dialogTitle = ref('')

const currentRow = ref<{ id?: number; name: string; dictionaryId?: number }>()
const actionType = ref('')

const AddAction = () => {
  dialogTitle.value = t('exampleDemo.add')
  currentRow.value = {
    name: '',
    dictionaryId: currentNodeKey.value
  }
  dialogVisible.value = true
  actionType.value = ''
}

const currentNodeKey = ref<number>(1)
const currentChange = (id: number) => {
  currentNodeKey.value = Number(id)
  getList()
}

const delLoading = ref(false)
const ids = ref<string[]>([])

const delData = async (row?: { id: number; name: string }) => {
  const elTableExpose = await getElTableExpose()
  ids.value = row
    ? [row.id]
    : elTableExpose?.getSelectionRows().map((v: { id: number; name: string }) => v.id) || []
  if (ids.value.length === 0) {
    ElMessage.error('请先选择要删除的数据')
    return
  }
  delLoading.value = true
  await delList(unref(ids).length).finally(() => {
    delLoading.value = false
    getList()
  })
  // const res = await dictionaryStore.delDicEntry(unref(ids))
  // if (res) {
  //   ElMessage.success('删除成功')
  //   getList()
  // } else {
  //   ElMessage.error('删除失败')
  // }
}

const action = async (row: { id: number; name: string }, type: string) => {
  currentRow.value = row
  const isEdit = type === 'edit'
  dialogTitle.value = t(isEdit ? 'exampleDemo.edit' : 'exampleDemo.detail')
  isEdit && (currentRow.value.dictionaryId = currentNodeKey.value)
  actionType.value = type
  dialogVisible.value = true
}

const writeRef = ref<ComponentRef<typeof Write>>()

const saveLoading = ref(false)

const searchSchema = ref<FormSchema[]>([
  {
    field: 'name',
    label: '名称',
    component: 'Input'
  },
  {
    field: 'code',
    label: '编码',
    component: 'Input'
  }
])

const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()
  // const isEdit = actionType.value === 'edit' //  判断是修改还是新增
  if (formData) {
    try {
      //  提交 新增 或者 修改
      saveLoading.value = true
      const res = await dictionaryStore.upsertDicEntry(formData as DictionaryEntry)
      if (res) {
        dialogVisible.value = false
        ElMessage.success('更新成功!')
        currentPage.value = 1
        getList()
      } else {
        ElMessage.error('更新失败!')
      }
    } catch (error) {
      console.log('🚀 ~ xzz: save -> error', error)
    } finally {
      saveLoading.value = false
    }
  }
}
</script>

<template>
  <div class="flex w-100% h-100%">
    <TypeWrite @currentChange="currentChange" />
    <ContentWrap class="flex-[3] ml-20px">
      <Search @reset="getList" @search="setSearchParams" :schema="searchSchema" />
      <div class="mb-10px">
        <BaseButton type="primary" @click="AddAction">{{ t('exampleDemo.add') }}</BaseButton>
        <BaseButton :loading="delLoading" type="danger" @click="delData()">
          {{ t('exampleDemo.del') }}
        </BaseButton>
        <span class="ml-10px">{{ currentDicKey }}</span>
      </div>
      <Table
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :columns="tableColumns"
        :data="dataList"
        :loading="loading"
        @register="tableRegister"
      />
    </ContentWrap>

    <Dialog v-model="dialogVisible" :title="dialogTitle">
      <Write v-if="actionType !== 'detail'" ref="writeRef" :current-row="currentRow" />
      <Detail v-if="actionType === 'detail'" :current-row="currentRow" />
      <template #footer>
        <BaseButton
          v-if="actionType !== 'detail'"
          type="primary"
          :loading="saveLoading"
          @click="save"
        >
          {{ t('exampleDemo.save') }}
        </BaseButton>
        <BaseButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</BaseButton>
      </template>
    </Dialog>
  </div>
</template>
