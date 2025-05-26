<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Dialog } from '@/components/Dialog'
import { useI18n } from '@/hooks/web/useI18n'
import { ElTag } from 'element-plus'
import { Table, TableColumn } from '@/components/Table'
import type { DepartmentItem, DepartmentItem2 } from '@/api/department/types'
import { useTable } from '@/hooks/web/useTable'
import { ref, unref, reactive } from 'vue'
import Detail from './components/Detail.vue'
import { BaseButton } from '@/components/Button'
import { usePermissionStore } from '@/store/modules/permission'
import { FormSchema } from '@/components/Form'
import { formatToDateTime } from '@/utils/dateUtil'
import { deleteLogByIdsApi } from '@/api/log'

const ids = ref<string[]>([])

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    const params = {
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize),
      ...unref(searchParams)
    }
    const res = await usePermissionStore().getLogList(params)
    return {
      list: res?.list || [],
      total: res?.total || 0
    }
  },
  fetchDelApi: async () => {
    const res = await deleteLogByIdsApi(unref(ids))
    return !!res
  }
})
const { loading, dataList, total, currentPage, pageSize } = tableState
const { getList, getElTableExpose, delList } = tableMethods

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

const { t } = useI18n()

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
    field: 'method',
    label: '请求方法',
    width: '90px',
    align: 'center'
  },
  {
    field: 'resCode',
    label: '响应状态',
    width: '90px',
    align: 'center',
    slots: {
      default: (data: any) => {
        const resCode = data.row.resCode
        return (
          <>
            <ElTag type={resCode >= 200 && resCode < 300 ? 'success' : 'danger'}>
              {resCode >= 200 && resCode < 300 ? '成功' : '失败'}
            </ElTag>
          </>
        )
      }
    }
  },
  {
    field: 'feedbackMsg',
    label: '反馈信息',
    minWidth: '90px',
    slots: {
      default: (data: any) => {
        return <>{data.row.feedbackMsg.replace('成功', '').replace('失败', '')}</>
      }
    }
  },
  {
    field: 'user.username',
    label: '操作人',
    align: 'center'
  },
  {
    field: 'url',
    label: '操作路径',
    minWidth: '160px'
  },
  {
    field: 'ip',
    label: 'IP地址'
  },
  {
    field: 'duration',
    minWidth: '90px',
    label: '响应时长',
    align: 'center'
  },
  {
    field: 'createdAt',
    label: '操作时间',
    width: '165px',
    slots: {
      default: (data: any) => {
        return <>{formatToDateTime(data.row.createdAt)}</>
      }
    }
  },
  {
    field: 'action',
    width: '160px',
    label: t('tableDemo.action'),
    fixed: 'right',
    slots: {
      default: (data: any) => {
        return (
          <>
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

const dialogVisible = ref(false)
const dialogTitle = ref('')

const currentRow = ref<DepartmentItem | null>(null)
const actionType = ref('')

const delLoading = ref(false)

const delData = async (row: DepartmentItem2 | null) => {
  const elTableExpose = await getElTableExpose()
  ids.value = row
    ? [row.id]
    : elTableExpose?.getSelectionRows().map((v: DepartmentItem) => v.id) || []
  delLoading.value = true
  await delList(unref(ids).length).finally(() => {
    delLoading.value = false
  })
}

const action = (row: DepartmentItem, type: string) => {
  dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
  actionType.value = type
  currentRow.value = row
  dialogVisible.value = true
}

const searchSchema = reactive<FormSchema[]>([
  {
    field: 'username',
    label: '操作人',
    component: 'Input'
  },
  {
    field: 'url',
    label: '操作路径',
    component: 'Input'
  },
  {
    field: 'dateRange',
    label: '操作时间',
    component: 'DatePicker',
    componentProps: {
      type: 'datetimerange',
      format: 'YYYY-MM-DD HH:mm:ss',
      //   valueFormat: 'YYYY-MM-DDTHH:mm:ss',
      disabledDate: (time: Date) => {
        return time.getTime() > Date.now() + 1000 * 60 * 60 * 24
      }
    }
  }
])
</script>

<template>
  <ContentWrap>
    <Search :schema="searchSchema" @search="setSearchParams" @reset="setSearchParams" />

    <div class="mb-10px">
      <BaseButton :loading="delLoading" type="danger" @click="delData(null)">
        {{ t('exampleDemo.del') }}
      </BaseButton>
    </div>

    <Table
      v-model:pageSize="pageSize"
      v-model:currentPage="currentPage"
      :columns="tableColumns"
      :data="dataList"
      :loading="loading"
      :pagination="{
        total: total
      }"
      @register="tableRegister"
    />
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <Detail :current-row="currentRow" />

    <template #footer>
      <BaseButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</BaseButton>
    </template>
  </Dialog>
</template>
