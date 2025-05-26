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
import { ElMessage, ElTag } from 'element-plus'
import { delDeliveryTimeApi } from '@/api/material'
import { useCmsStore } from '@/store/modules/cms'
// import { storeToRefs } from 'pinia'

const { t } = useI18n()
const ids = ref<string[]>([])
const cmsStore = useCmsStore()
// const { getDeliveryTimeList } = storeToRefs(cmsStore)
const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    // const { currentPage, pageSize } = tableState
    // const params = {
    //   pageIndex: unref(currentPage),
    //   pageSize: unref(pageSize),
    //   ...unref(searchParams)
    // }
    const res = await cmsStore.updateDeliveryTimeList()
    return res
  },
  fetchDelApi: async () => {
    const res = await delDeliveryTimeApi(unref(ids))
    return !!res
  }
})

const { dataList, loading, total } = tableState
const { getList, delList, getElTableExpose } = tableMethods
const tableColumns = reactive<TableColumn[]>([
  {
    field: 'selection',
    type: 'selection'
  },
  {
    field: 'index',
    label: t('userDemo.index'),
    type: 'index'
  },
  {
    field: 'name',
    label: '加急方式'
  },
  {
    field: 'duration',
    label: '预计天数'
  },
  {
    field: 'price',
    label: '费用',
    formatter: (row: any) => {
      return row.price.toFixed(2)
    }
  },
  {
    field: 'active',
    label: '是否启用',
    formatter: (row: any) => {
      return <ElTag type={row.active ? 'success' : 'danger'}>{row.active ? '启用' : '禁用'}</ElTag>
    }
  },
  {
    field: 'description',
    label: '备注'
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
            <BaseButton type="danger" onClick={() => delAction(row)}>
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
  currentRow.value = { days: 1, price: 0 }
  // currentRow.value = { status: true }

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
      const res = await cmsStore.upsertDeliveryTime(formData)
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

const delAction = async (row: any | null) => {
  const elTableExpose = await getElTableExpose()
  ids.value = row ? [row.id] : elTableExpose?.getSelectionRows().map((v: any) => v.id) || []
  // delLoading.value = true
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
      <BaseButton type="danger" @click="delAction(null)">
        {{ t('exampleDemo.del') }}
      </BaseButton>
    </div>
    <Table
      :columns="tableColumns"
      default-expand-all
      node-key="id"
      :data="dataList"
      :loading="loading"
      :pagination="{
        total
      }"
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
