<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Dialog } from '@/components/Dialog'
import { useI18n } from '@/hooks/web/useI18n'
import { useTable } from '@/hooks/web/useTable'
import { ref, unref, reactive } from 'vue'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { BaseButton } from '@/components/Button'

import { FormSchema } from '@/components/Form'
import { ElMessage, ElTag } from 'element-plus'
import { Table, TableColumn } from '@/components/Table'
import { useBomStore } from '@/store/modules/bom'
import { useDictionaryStore } from '@/store/modules/dictionary'
import { storeToRefs } from 'pinia'
const ids = ref<string[]>([])
const { updateBomList, upsertBom, deleteBom } = useBomStore()
const dictionaryStore = useDictionaryStore()
const { dictionaryMap } = storeToRefs(dictionaryStore)
const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    // const { currentPage, pageSize } = tableState
    const params = {
      // pageIndex: unref(currentPage),
      // pageSize: unref(pageSize),
      ...unref(searchParams)
    }
    return await updateBomList(params)
  },
  fetchDelApi: async () => {
    // const res = await deleteDepartmentApi(unref(ids))
    const res = await deleteBom(unref(ids).map((v: any) => Number(v)))
    // const res = await delDepartmentApi(['123'])
    return !!res
  }
})
const { loading, dataList, total } = tableState
const { getList, getElTableExpose, delList } = tableMethods

const searchParams = ref({})
const setSearchParams = (params: any) => {
  loading.value = true
  searchParams.value = params
  getList()
}

const { t } = useI18n()

const dialogVisible = ref(false)
const dialogTitle = ref('')

const currentRow = ref<any | null>(null)
const actionType = ref('')

const AddAction = () => {
  dialogTitle.value = t('exampleDemo.add')
  currentRow.value = null
  dialogVisible.value = true
  actionType.value = ''
}

const delLoading = ref(false)

const delData = async (row: any | null) => {
  if (row?.children && row?.children?.length > 0)
    return ElMessage.error('当前部门下有子部门, 不能删除')
  const elTableExpose = await getElTableExpose()
  ids.value = row ? [row.id] : elTableExpose?.getSelectionRows().map((v: any) => v.id) || []
  delLoading.value = true
  await delList(unref(ids).length).finally(() => {
    delLoading.value = false
  })
}

const action = (row: any, type: string) => {
  dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
  actionType.value = type
  currentRow.value = row
  dialogVisible.value = true
}

const writeRef = ref<ComponentRef<typeof Write>>()

const saveLoading = ref(false)

/*
  code String @db.VarChar(50)
  name String @db.VarChar(50)
  color String? @db.VarChar(50)
  sort Int @default(0)
  unit String @db.VarChar(50)
  category BOMCategory @default(MATERIAL)
  count Int @default(0)
  unit_price Float @default(0.00)
  total_price Float @default(0.00)
  description String? @db.VarChar(255)
  */
const tableColumns = reactive<TableColumn[]>([
  {
    field: 'selection',
    type: 'selection'
  },
  {
    field: 'index',
    label: t('tableDemo.index'),
    type: 'index'
  },
  {
    field: 'code',
    label: '编码'
  },
  {
    field: 'name',
    label: '名称'
  },
  {
    field: 'unit',
    label: '单位',
    slots: {
      default: (data: any) => {
        return <>{dictionaryMap.value['UNIT'].find((v: any) => v.value === data.row.unit)?.label}</>
      }
    }
  },
  // {
  //   field: 'count',
  //   label: '数量'
  // },
  // {
  //   field: 'unit_price',
  //   label: '单价'
  // },
  // {
  //   field: 'total_price',
  //   label: '总价'
  // },
  {
    field: 'category',
    label: '类型',
    optionApi: () => {
      return dictionaryMap.value['BOM_CATEGORY']
    }
  },
  {
    field: 'status',
    label: t('userDemo.status'),
    slots: {
      default: (data: any) => {
        const status = data.row.status
        return (
          <>
            <ElTag type={status ? 'success' : 'danger'}>
              {status ? t('userDemo.enable') : t('userDemo.disable')}
            </ElTag>
          </>
        )
      }
    }
  },
  // {
  //   field: 'createdAt',
  //   label: t('tableDemo.displayTime'),
  //   width: '165px',
  //   slots: {
  //     default: (data: any) => {
  //       return <>{formatToDateTime(data.row.createdAt)}</>
  //     }
  //   }
  // },
  {
    field: 'description',
    label: t('userDemo.remark')
  },
  {
    field: 'action',
    width: '260px',
    label: t('tableDemo.action'),
    slots: {
      default: (data: any) => {
        return (
          <>
            <BaseButton type="primary" onClick={() => action(data.row, 'edit')}>
              {t('exampleDemo.edit')}
            </BaseButton>
            <BaseButton type="success" onClick={() => action(data.row, 'detail')}>
              {t('exampleDemo.detail')}
            </BaseButton>
            <BaseButton type="danger" onClick={() => delData(data.row)}>
              {t('exampleDemo.del')}
            </BaseButton>
          </>
        )
      }
    }
  }
])

const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()
  const isEdit = actionType.value === 'edit' //  判断时修改还是新增
  if (formData) {
    try {
      // formData.title = formData.meta.title.trim() //  去除首尾空格
      delete formData.children
      //  提交 新增 或者 修改
      saveLoading.value = true
      const res = await upsertBom(formData)
      if (res) {
        dialogVisible.value = false
        ElMessage.success(isEdit ? '更新成功!' : '新增成功!')
        getList()
      }
    } catch (error) {
      console.log('🚀 ~ xzz: save -> error', error)
    } finally {
      saveLoading.value = false
    }
  }
}

const searchSchema = reactive<FormSchema[]>([
  {
    field: 'name',
    label: t('userDemo.departmentName'),
    component: 'Input'
  },
  {
    field: 'status',
    label: t('userDemo.status'),
    component: 'Select',
    componentProps: {
      options: [
        { label: t('userDemo.enable'), value: true },
        { label: t('userDemo.disable'), value: false }
      ]
    }
  }
])
</script>

<template>
  <ContentWrap>
    <Search :schema="searchSchema" @search="setSearchParams" @reset="setSearchParams" />

    <div class="mb-10px">
      <BaseButton type="primary" @click="AddAction">{{ t('exampleDemo.add') }}</BaseButton>
      <BaseButton :loading="delLoading" type="danger" @click="delData(null)">
        {{ t('exampleDemo.del') }}
      </BaseButton>
    </div>

    <Table
      :columns="tableColumns"
      :data="dataList"
      :loading="loading"
      :pagination="{
        total: total,
        layout: 'total'
      }"
      :defaultExpandAll="true"
      @register="tableRegister"
      showAction
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
</template>
