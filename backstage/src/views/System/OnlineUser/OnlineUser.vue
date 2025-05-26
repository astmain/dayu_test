<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { reactive, onMounted } from 'vue'
import { BaseButton } from '@/components/Button'
import { usePermissionStore } from '@/store/modules/permission'
import { formatToDateTime } from '@/utils/dateUtil'
import useWebSocket from '@/hooks/websocket/index'
import { ElMessage } from 'element-plus'
import { forceLogoutApi } from '@/api/log'
// import { parseUserAgent, extractIP } from '@/utils/string'
const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const res = await usePermissionStore().getOnlineUserListi()
    return {
      list: res?.list || [],
      total: res?.total || 0
    }
  }
})
const { loading, dataList, total, currentPage, pageSize } = tableState
const { getList } = tableMethods

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
    field: 'user.username',
    label: '用户名',
    align: 'center'
  },

  {
    field: 'ip',
    label: 'IP地址'
  },
  {
    field: 'userAgent',
    label: '客户端'
  },
  {
    field: 'createdAt',
    label: '登录时间',
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
            <BaseButton type="success" onClick={() => forceLogout(data.row.userId)}>
              强退
            </BaseButton>
          </>
        )
      }
    }
  }
])

// const delLoading = ref(false)

const { registerHandler } = useWebSocket()

onMounted(() => {
  // 订阅 chat 类型的消息

  registerHandler('onlineUserChanged', (msg) => {
    console.log('收到在线用户变化通知:', msg)
    // 可在这里更新组件状态
    getList()
  })
})

//  这里只是发出 退出 命令
const forceLogout = async (id: number) => {
  const res = await forceLogoutApi(id)
  if (res?.ok) {
    ElMessage.success('强制退出命令发送成功')
  } else {
    ElMessage.error('强制退出命令发送失败')
  }
}
</script>

<template>
  <ContentWrap>
    <!-- <div class="mb-10px">
      <BaseButton :loading="delLoading" type="danger" @click="getList"> 刷新 </BaseButton>
    </div> -->

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
</template>
