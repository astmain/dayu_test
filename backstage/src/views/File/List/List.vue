<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { Dialog } from '@/components/Dialog'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import type { FileItem } from '@/api/file/types'
import { useTable } from '@/hooks/web/useTable'
import { ref, unref, reactive } from 'vue'
// import Detail from './components/Detail.vue'

import { BaseButton } from '@/components/Button'
// import { usePermissionStore } from '@/store/modules/permission'
// import { FormSchema } from '@/components/Form'
import { formatToDateTime } from '@/utils/dateUtil'
import { delFileApi, getFileListApi, batchDeleteFileApi } from '@/api/file'
import { formatFileSize, downloadFile } from '@/utils/file'
import RenderFile from './components/RenderFile.vue'
import { ElMessage } from 'element-plus'
import UploadBtn from './components/UploadBtn.vue'

const ids = ref<string[]>([])

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    const params = {
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize),
      ...unref(searchParams)
    }
    const res = await getFileListApi(params)
    const { list, total } = res
    return { list, total }
  },

  fetchDelApi: async () => {
    const res = await batchDeleteFileApi(unref(ids))
    return !!res
  }
})
const { loading, dataList, total, currentPage, pageSize } = tableState
const { getList, getElTableExpose, delList } = tableMethods

const searchParams = ref<any>({})
// const setSearchParams = (params: any) => {
//   const { dateRange, ...rest } = params
//   searchParams.value = { ...rest }
//   //   if (dateRange) {
//   //     // 因为是get请求，所以需要将日期格式化成json字符串
//   //     searchParams.value.dateRange = JSON.stringify([
//   //       dateRange[0].toISOString(),
//   //       dateRange[1].toISOString()
//   //     ])
//   //   }
//   getList()
// }

const { t } = useI18n()
const delFile = async (sha256: string) => {
  try {
    const res = await delFileApi(sha256)
    if (res.code == 200) {
      getList()
      ElMessage.success('删除成功')
    } else {
      ElMessage.error('删除失败' + res.data.message)
    }
  } catch (error) {
    console.log(error)
  }
}
const tableColumns = reactive<TableColumn[]>([
  { field: 'select', type: 'selection' },
  {
    field: 'index',
    label: t('userDemo.index'),
    type: 'index'
  },
  {
    field: 'filename',
    label: '文件预览',
    width: 170,
    slots: {
      default: (data: any) => {
        const { url, extension, filename } = data.row
        return <RenderFile url={url} extension={extension} filename={filename} />
      }
    }
  },
  // {
  //   field: 'name',
  //   label: '名称'
  // },
  // {
  //   field: 'extension',
  //   label: '文件类型'
  // },
  {
    field: 'size',
    label: '文件大小',
    formatter: (row: any) => formatFileSize(row.size)
  },
  {
    field: 'uploadTime',
    label: '上传时间',
    formatter: (row: any) => formatToDateTime(row.uploadTime)
  },
  {
    field: 'uploader',
    label: '上传人'
  },
  {
    field: 'remark',
    label: t('userDemo.remark')
  },
  {
    field: 'action',
    label: t('userDemo.action'),
    width: 240,
    slots: {
      default: (data: any) => {
        const row = data.row
        return (
          <>
            {/* <BaseButton
              type="primary"
              onClick={() => downloadFile({ url: row.url, fileName: row.filename })}
            >
              编辑
            </BaseButton> */}
            <BaseButton
              type="primary"
              onClick={() => downloadFile({ url: row.url, fileName: row.filename })}
            >
              下载
            </BaseButton>
            <BaseButton type="danger" onClick={() => delFile(row.sha256)}>
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

// const currentRow = ref<FileItem | null>(null)
// const actionType = ref('')

const delLoading = ref(false)

const delData = async () => {
  const elTableExpose = await getElTableExpose()
  ids.value = elTableExpose?.getSelectionRows().map((v: FileItem) => v.sha256) || []
  if (ids.value.length === 0) {
    ElMessage.warning('请选择要删除的文件')
    return
  }
  delLoading.value = true

  await delList(unref(ids).length).finally(() => {
    delLoading.value = false
  })
}

// const searchSchema = reactive<FormSchema[]>([
//   {
//     field: 'username',
//     label: '操作人',
//     component: 'Input'
//   },
//   {
//     field: 'url',
//     label: '操作路径',
//     component: 'Input'
//   }
// ])
</script>

<template>
  <!-- <audio
    class="audio"
    src="http://127.0.0.1:5000/static/test/无名的人.mp3"
    controls
    autoplay
  ></audio> -->
  <ContentWrap>
    <!-- <Search :schema="searchSchema" @search="setSearchParams" @reset="setSearchParams" /> -->

    <div class="mb-10px flex items-center gap-10px">
      <UploadBtn @success="getList" />
      <BaseButton :loading="delLoading" type="danger" @click="delData">
        {{ t('exampleDemo.batchDel') }}
      </BaseButton>
      <div class="ml-auto">
        <BaseButton :loading="delLoading" type="warning" @click="getList"> 刷新 </BaseButton>
      </div>
    </div>

    <Table
      v-model:pageSize="pageSize"
      v-model:currentPage="currentPage"
      align="center"
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
    <!-- <Detail :current-row="currentRow" /> -->

    <template #footer>
      <BaseButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</BaseButton>
    </template>
  </Dialog>
</template>
