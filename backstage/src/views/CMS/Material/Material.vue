<script setup lang="tsx">
import { reactive, ref, unref } from 'vue'
import { useTable } from '@/hooks/web/useTable'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { Search } from '@/components/Search'
import { FormSchema } from '@/components/Form'
import { ContentWrap } from '@/components/ContentWrap'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { Dialog } from '@/components/Dialog'
import { BaseButton } from '@/components/Button'
import { formatToDateTime } from '@/utils/dateUtil'
import { ElMessage } from 'element-plus'
import { addMaterialApi, editMaterialApi } from '@/api/material'
import { useMaterialStore } from '@/store/modules/material'

const { t } = useI18n()
const ids = ref<string[]>([])

// const { getUnitSelectListApi, getMaterialListApi } = useCmsStore()
const materialStore = useMaterialStore()
const { updateMaterialList, delMaterial } = materialStore
const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    const params = {
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize),
      ...unref(searchParams)
    }
    const res = await updateMaterialList(params)
    return res
  },
  fetchDelApi: async () => {
    const res = await delMaterial(unref(ids))
    return !!res
  }
})

const { dataList, loading, total } = tableState
const { getList, delList } = tableMethods

// const unitList = ref<any[]>([])
// onMounted(async () => {
//   unitList.value = await getUnitSelectListApi()
// })

// const findUnitName = (id: number) => {
//   return unitList.value.find((item: any) => item.value === id)?.label
// }

const tableColumns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('userDemo.index'),
    type: 'index'
  },
  {
    field: 'code',
    label: '型号'
  },
  {
    field: 'name',
    label: '名称'
  },
  {
    field: 'color',
    label: '颜色'
  },
  {
    field: 'property',
    label: '材料特性'
  },
  // {
  //   field: 'uom_id',
  //   label: '单位',
  //   slots: {
  //     default: (data: any) => {
  //       return <>{findUnitName(data.row.uom_id)}</>
  //     }
  //   }
  // },

  // {
  //   field: 'status',
  //   label: t('menu.status'),
  //   width: 100,
  //   slots: {
  //     default: (data: any) => {
  //       return (
  //         <>
  //           <ElTag type={!data.row.status ? 'danger' : 'success'}>
  //             {data.row.status ? t('userDemo.enable') : t('userDemo.disable')}
  //           </ElTag>
  //         </>
  //       )
  //     }
  //   }
  // },
  {
    field: 'createdAt',
    label: t('tableDemo.displayTime'),
    slots: {
      default: (data: any) => {
        return <>{formatToDateTime(data.row.createdAt)}</>
      }
    }
  },
  {
    field: 'description',
    label: t('userDemo.remark')
  },
  {
    field: 'action',
    label: t('userDemo.action'),
    width: 240,
    fixed: 'right',
    slots: {
      default: (data: any) => {
        const row = data.row
        return (
          <>
            <BaseButton type="primary" onClick={() => action(row, 'edit')}>
              {t('exampleDemo.edit')}
            </BaseButton>
            <BaseButton type="success" onClick={() => action(row, 'detail')}>
              {t('exampleDemo.detail')}
            </BaseButton>
            <BaseButton type="danger" onClick={() => delAction(row.id)}>
              {t('exampleDemo.del')}
            </BaseButton>
          </>
        )
      }
    }
  }
])

const searchSchema = reactive<FormSchema[]>([
  {
    field: 'name',
    label: '名称',
    component: 'Input'
  },
  {
    field: 'code',
    label: '型号',
    component: 'Input'
  },
  {
    field: 'color ',
    label: '颜色',
    component: 'Input'
  },
  {
    field: 'spec',
    label: '材料特性',
    component: 'Input'
  }

  // {
  //   field: 'status',
  //   label: t('userDemo.status'),
  //   component: 'Select',
  //   componentProps: {
  //     options: [
  //       { label: t('userDemo.enable'), value: true },
  //       { label: t('userDemo.disable'), value: false }
  //     ]
  //   }
  // }
])

const searchParams = ref({})
const setSearchParams = (data: any) => {
  searchParams.value = data
  getList()
}

const dialogVisible = ref(false)

const dialogTitle = ref('')

const currentRow = ref()

const actionType = ref('')

const writeRef = ref<ComponentRef<typeof Write>>()

const saveLoading = ref(false)

const action = (row: any, type: string) => {
  dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
  actionType.value = type
  currentRow.value = row
  dialogVisible.value = true
}

const AddAction = () => {
  dialogTitle.value = t('exampleDemo.add')
  currentRow.value = undefined
  dialogVisible.value = true
  actionType.value = ''
}

const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit() //  获取提交的数据
  const isEdit = actionType.value === 'edit' //  判断时修改还是新增
  if (formData) {
    try {
      //  提交 新增 或者 修改
      saveLoading.value = true
      const res = isEdit ? await editMaterialApi(formData) : await addMaterialApi(formData)
      if (res?.code === 200) {
        dialogVisible.value = false
        ElMessage.success('更新成功!')
        getList()
        // 清空权限勾选项
        // writeRef.value?.
      }
    } catch (error) {
      console.log('🚀 ~ xzz: save -> error', error)
    } finally {
      saveLoading.value = false
    }
  }
}

// const delLoading = ref(false)

const delAction = async (idx: number) => {
  // if (!idx) return ElMessage.error('请选择要删除的角色')
  ids.value = [idx.toString()]
  await delList(unref(ids).length).finally(() => {
    // delLoading.value = false
  })
}
</script>

<template>
  <ContentWrap>
    <Search :schema="searchSchema" @reset="setSearchParams" @search="setSearchParams" />
    <div class="mb-10px">
      <BaseButton type="primary" @click="AddAction">{{ t('exampleDemo.add') }}</BaseButton>
    </div>
    <Table
      :columns="tableColumns"
      default-expand-all
      node-key="id"
      :data="dataList"
      :loading="loading"
      :pagination="{ total }"
      @register="tableRegister"
    />
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <Write v-if="actionType !== 'detail'" ref="writeRef" :current-row="currentRow" />
    <Detail v-else :current-row="currentRow" />
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
