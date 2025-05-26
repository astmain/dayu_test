<script setup lang="tsx">
import { reactive, ref, unref } from 'vue'
import { useTable } from '@/hooks/web/useTable'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { ElTag } from 'element-plus'
import { Search } from '@/components/Search'
import { FormSchema } from '@/components/Form'
import { ContentWrap } from '@/components/ContentWrap'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { Dialog } from '@/components/Dialog'
import { BaseButton } from '@/components/Button'

// ==========================================
import { formatToDateTime } from '@/utils/dateUtil'

import { ElMessage } from 'element-plus'
import {
  deleteNoticeByIdsApi,
  getNoticeListApi,
  addNoticeApi,
  editNoticeApi
} from '@/api/notice/index'
import { NoticeItem } from '@/api/notice/types'
import { useAppStore } from '@/store/modules/app'

const { t } = useI18n()
const ids = ref<string[]>([])
const appStore = useAppStore()
const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    const params = {
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize),
      ...unref(searchParams)
    }
    const res = await getNoticeListApi(params)
    return {
      list: res?.list || [],
      total: res?.total || 0
    }
  },
  fetchDelApi: async () => {
    // const res = await delDepartmentApi(unref(ids))
    const res = await deleteNoticeByIdsApi(unref(ids))
    return !!res
  }
})

const { loading, dataList, total } = tableState
const { getList, getElTableExpose, delList } = tableMethods

const notificationType = appStore.getDictionaryMap['notification_type']
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
    field: 'title',
    label: '标题',
    align: 'center'
  },
  {
    field: 'type',
    label: '类型',
    width: 60,
    align: 'center',
    slots: {
      default: (data: any) => {
        return <>{notificationType?.list?.find((item) => item.value === data.row.type)?.label}</>
      }
    }
  },
  {
    field: 'isPublished',
    label: t('menu.status'),
    width: 90,
    align: 'center',
    headerAlign: 'center',
    slots: {
      default: (data: any) => {
        return (
          <>
            <ElTag type={data.row.isPublished ? 'success' : 'danger'}>
              {data.row.isPublished ? t('table.published') : t('table.unpublished')}
            </ElTag>
          </>
        )
      }
    }
  },
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
    field: 'action',
    label: t('userDemo.action'),
    width: 240,
    fixed: 'right',
    slots: {
      default: (data: any) => {
        const row = data?.row
        return (
          <>
            <BaseButton type="success" onClick={() => action(row, 'detail')}>
              {t('exampleDemo.detail')}
            </BaseButton>
            <BaseButton type="primary" onClick={() => action(row, 'edit')}>
              {t('exampleDemo.edit')}
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
const delLoading = ref(false)

const delData = async (row: NoticeItem | null) => {
  const elTableExpose = await getElTableExpose()
  ids.value = row ? [row.id] : elTableExpose?.getSelectionRows().map((v: NoticeItem) => v.id) || []
  delLoading.value = true
  await delList(unref(ids).length).finally(() => {
    delLoading.value = false
  })
}

const searchSchema = reactive<FormSchema[]>([
  {
    field: 'title',
    label: '标题',
    component: 'Input'
  },
  {
    field: 'type',
    label: notificationType?.name,
    component: 'Select',
    componentProps: {
      options: notificationType?.list
    }
  }
])

const searchParams = ref<any>({})
const setSearchParams = (params: any) => {
  const { dateRange, ...rest } = params
  searchParams.value = { ...rest }
  if (dateRange) {
    // 因为是get请求，所以需要将日期格式化成json字符串
    searchParams.value.dateRange = JSON.stringify([
      dateRange[0].toISOString(),
      dateRange[1].toISOString()
    ])
  }
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
  const rawRow = JSON.parse(JSON.stringify(row))
  actionType.value = type
  if (type === 'edit') {
    rawRow.recipients = rawRow.recipients.map((item: any) => item?.user?.id)
  }
  currentRow.value = rawRow
  dialogVisible.value = true
}

const AddAction = () => {
  dialogTitle.value = t('exampleDemo.add') + '通知'
  currentRow.value = undefined
  dialogVisible.value = true
  actionType.value = ''
}

// ==========================================

const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit() //  获取提交的数据
  const isEdit = actionType.value === 'edit' //  判断时修改还是新增
  // formData?.menu && (formData.menu = formData?.menu.filter((item) => item.id))
  // return
  if (formData) {
    try {
      //  提交 新增 或者 修改
      saveLoading.value = true
      // console.log('xzz2021: save -> formData', formData)
      // return
      const res = isEdit ? await editNoticeApi(formData) : await addNoticeApi(formData)
      if (res?.id) {
        dialogVisible.value = false
        ElMessage.success('更新成功!')
        getList()
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
    <div class="mb-10px flex justify-between">
      <div>
        <BaseButton :loading="delLoading" type="danger" @click="delData(null)">
          {{ t('exampleDemo.del') }}
        </BaseButton>
        <BaseButton type="primary" @click="AddAction">{{ t('exampleDemo.add') }}</BaseButton>
      </div>
      <div>
        <BaseButton type="success">全部已读</BaseButton>
      </div>
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

  <Dialog v-model="dialogVisible" :title="dialogTitle" :destroy-on-close="false">
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
  <!-- <Test @keydown.enter="test" /> -->
</template>
