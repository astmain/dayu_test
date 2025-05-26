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
import { upsertSpecificationApi, delSpecificationApi } from '@/api/material'
import { useEventBus } from '@/hooks/event/useEventBus'
import { useCmsStore } from '@/store/modules/cms'
import { storeToRefs } from 'pinia'
import { findNode } from '@/utils/tree2'
const { t } = useI18n()
const ids = ref<string[]>([])
const cmsStore = useCmsStore()
const { getSpecificationList } = storeToRefs(cmsStore)
const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    // const { currentPage, pageSize } = tableState
    // const params = {
    //   pageIndex: unref(currentPage),
    //   pageSize: unref(pageSize),
    //   ...unref(searchParams)
    // }

    const res = await cmsStore.updateSpecificationList()
    console.log('🚀 ~ fetchDataApi: ~ res:', res)
    return res
  },
  fetchDelApi: async () => {
    const res = await delSpecificationApi(unref(ids))
    return !!res
  }
})

const { dataList, loading, total } = tableState
const { getList, delList, getElTableExpose } = tableMethods

const tableColumns = reactive<TableColumn[]>([
  // {
  //   field: 'selection',
  //   type: 'selection',
  //   align: 'center'
  // },
  {
    field: 'index',
    label: t('userDemo.index'),
    type: 'index'
  },
  {
    field: 'name',
    label: '名称'
  },
  {
    field: 'is_tag',
    label: '是否标签',
    slots: {
      default: (data: any) => {
        const status = data.row.is_tag
        return (
          <>
            <ElTag type={status ? 'success' : 'danger'}>{status ? '是' : '否'}</ElTag>
          </>
        )
      }
    }
  },
  // {
  //   field: 'active',
  //   label: '启用',
  //   slots: {
  //     default: (data: any) => {
  //       const row = data.row
  //       return (
  //         <ElSwitch
  //           v-model={row.active}
  //           class="ml-2"
  //           style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
  //           onChange={() => toggleActive(row)}
  //         />
  //       )
  //     }
  //   }
  // },
  // {
  //   field: 'note',
  //   label: t('userDemo.remark')
  // },
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
            {/* <BaseButton type="success" onClick={() => action(row, 'detail')}>
              {t('exampleDemo.detail')}
            </BaseButton> */}
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
  currentRow.value = {}
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
      const res = await upsertSpecificationApi(formData)
      if (res?.code === 200) {
        dialogVisible.value = false
        ElMessage.success('更新成功!')
        getList()
      } else {
        ElMessage.error(isEdit ? '更新失败!' : '新增失败!')
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

useEventBus({
  name: 'refresh',
  callback: async (id: number) => {
    //  这里数据是嵌套的 导致无法查到对应id  需要递归查询   或者 ??? 干脆  更新当前列表(但需要2次网络请求)
    await getList()
    currentRow.value = findNode(getSpecificationList.value, id)
  }
})
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
      node-key="id"
      :data="dataList"
      :loading="loading"
      default-expand-all
      :pagination="{
        total,
        layout: 'total'
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
