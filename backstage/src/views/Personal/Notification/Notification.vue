<script setup lang="tsx">
import { onMounted, reactive, ref, unref } from 'vue'
import { useTable } from '@/hooks/web/useTable'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { ElMessage, ElTag } from 'element-plus'
import { Search } from '@/components/Search'
import { FormSchema } from '@/components/Form'
import { ContentWrap } from '@/components/ContentWrap'
import Detail from './components/Detail.vue'
import { Dialog } from '@/components/Dialog'
import { BaseButton } from '@/components/Button'

// ==========================================
import { formatToDateTime } from '@/utils/dateUtil'
import { getSelfNoticeListApi, markAsReadApi } from '@/api/notice/index'
import { NoticeRecipientItem } from '@/api/notice/types'
import { useUserStore } from '@/store/modules/user'
import useWebSocket from '@/hooks/websocket/index'
import { useAppStore } from '@/store/modules/app'

const { t } = useI18n()
const ids = ref<string[]>([])

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    const params = {
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize),
      ...unref(searchParams)
    }
    const res = await getSelfNoticeListApi(params)
    return {
      list: res?.list || [],
      total: res?.total || 0
    }
  },
  fetchBatchOperateApi: async () => {
    const res = await markAsReadApi(ids.value)
    return res
  }
})

const { loading, dataList, total } = tableState
const { getList, getElTableExpose, batchOperateList } = tableMethods

const appStore = useAppStore()

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
    field: 'notice.title',
    label: '标题',
    align: 'center'
  },
  {
    field: 'notice.type',
    label: '类型',
    width: 60,
    align: 'center',
    slots: {
      default: (data: any) => {
        return (
          <>
            {
              appStore.getDictionaryMap['notification_type']?.list.find(
                (v: any) => v.code === data.row.notice.type
              )?.label
            }
          </>
        )
      }
    }
  },
  {
    field: 'isRead',
    label: t('menu.status'),
    width: 90,
    align: 'center',
    headerAlign: 'center',
    slots: {
      default: (data: any) => {
        return (
          <>
            <ElTag type={data.row.isRead ? 'success' : 'danger'}>
              {data.row.isRead ? '已读' : '未读'}
            </ElTag>
          </>
        )
      }
    }
  },
  {
    field: 'createdAt',
    // label: t('tableDemo.displayTime'),
    label: '发布时间',
    slots: {
      default: (data: any) => {
        return <>{formatToDateTime(data.row.createdAt)}</>
      }
    }
  },

  {
    field: 'action',
    label: t('userDemo.action'),
    width: 200,
    fixed: 'right',
    slots: {
      default: (data: any) => {
        const row = data?.row
        return (
          <>
            <BaseButton type="warning" onClick={() => action(row, 'detail')}>
              {t('exampleDemo.detail')}
            </BaseButton>
            {/* <BaseButton type="primary" onClick={() => action(row, 'edit')}>
              {t('exampleDemo.edit')}
            </BaseButton> */}
            <BaseButton type="danger" onClick={() => markAsRead(row)} disabled={row.isRead}>
              {t('common.markAsRead')}
            </BaseButton>
          </>
        )
      }
    }
  }
])

const searchSchema = reactive<FormSchema[]>([
  {
    field: 'title',
    label: '标题',
    component: 'Input'
  },
  {
    field: 'type',
    label: '类型',
    component: 'Select',
    componentProps: {
      options: [
        { label: '系统通知', value: 'system' },
        { label: '用户通知', value: 'user' }
      ]
    }
  },
  {
    field: 'isRead',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '已读', value: true },
        { label: '未读', value: false }
      ]
    }
  },
  {
    field: 'dateRange',
    label: '时间范围',
    component: 'DatePicker',
    componentProps: {
      type: 'daterange',
      rangeSeparator: '至'
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

const userStore = useUserStore()

const action = async (row: any, type: string) => {
  dialogTitle.value = t('exampleDemo.detail')
  actionType.value = type
  currentRow.value = row
  dialogVisible.value = true
  if (!row.isRead) {
    await markAsReadApi([row.id])
    // 更新未读数量
    getList()
    userStore.setUnReadCount()
  }
}

const delLoading = ref(false)
const markAsRead = async (row: any) => {
  if (row) {
    const res = await markAsReadApi([row.id])
    if (res) {
      ElMessage.success('标为已读成功')
      setTimeout(() => {
        getList()
        // 更新未读数量
        userStore.setUnReadCount()
      }, 2000)
    }
    return
  }
  const elTableExpose = await getElTableExpose()
  ids.value = elTableExpose?.getSelectionRows().map((v: NoticeRecipientItem) => v.id) || []
  if (!ids.value.length) return ElMessage.error('请先勾选项目')
  delLoading.value = true
  await batchOperateList({ zh: '标计已读', en: 'mark as read' }).finally(() => {
    delLoading.value = false
  })
  // 更新未读数量
  userStore.setUnReadCount()
}

const { registerHandler } = useWebSocket()
onMounted(() => {
  registerHandler('newNotice', (msg) => {
    console.log('收到新通知:', msg)
    // 可在这里更新组件状态
    userStore.setUnReadCount()
    getList()
  })
})
</script>

<template>
  <ContentWrap>
    <Search :schema="searchSchema" @reset="setSearchParams" @search="setSearchParams" />
    <div class="mb-10px">
      <BaseButton type="success" @click="markAsRead">{{ t('common.markAsRead') }}</BaseButton>
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
    <Detail :current-row="currentRow.notice" />
    <template #footer>
      <!-- <BaseButton
        v-if="actionType !== 'detail'"
        type="primary"
        :loading="saveLoading"
        @click="save"
      >
        {{ t('exampleDemo.save') }}
      </BaseButton> -->
      <BaseButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</BaseButton>
    </template>
  </Dialog>
</template>
