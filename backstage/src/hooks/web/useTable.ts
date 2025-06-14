import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableExpose, TableProps, TableSetProps, TableColumn } from '@/components/Table'
import { ElTable, ElMessageBox, ElMessage } from 'element-plus'
import { ref, watch, unref, nextTick, onMounted } from 'vue'

const { t } = useI18n()

interface UseTableConfig {
  /**
   * 是否初始化的时候请求一次
   */
  immediate?: boolean
  fetchDataApi: () => Promise<{
    list: any[]
    total?: number
  }>
  fetchDelApi?: () => Promise<boolean>
  fetchBatchOperateApi?: () => Promise<boolean>
}

export const useTable = (config: UseTableConfig) => {
  const { immediate = true } = config

  const loading = ref(false)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const total = ref(0)
  const dataList = ref<any[]>([])
  let isPageSizeChange = false
  watch(
    () => currentPage.value,
    () => {
      if (!isPageSizeChange) methods.getList()
      isPageSizeChange = false
    }
  )

  watch(
    () => pageSize.value,
    () => {
      if (unref(currentPage) === 1) {
        methods.getList()
      } else {
        currentPage.value = 1
        isPageSizeChange = true
        methods.getList()
      }
    }
  )

  onMounted(() => {
    if (immediate) {
      methods.getList()
    }
  })

  // Table实例
  const tableRef = ref<typeof Table & TableExpose>()

  // ElTable实例
  const elTableRef = ref<ComponentRef<typeof ElTable>>()

  const register = (ref: typeof Table & TableExpose, elRef: ComponentRef<typeof ElTable>) => {
    tableRef.value = ref
    elTableRef.value = unref(elRef)
  }

  const getTable = async () => {
    await nextTick()
    const table = unref(tableRef)
    if (!table) {
      console.error('The table is not registered. Please use the register method to register')
    }
    return table
  }

  const methods = {
    /**
     * 获取表单数据
     */
    getList: async () => {
      loading.value = true
      try {
        const res = await config?.fetchDataApi()
        if (res) {
          dataList.value = res.list
          total.value = res.total || 0
        }
      } catch (err: any) {
        ElMessage.error(err?.message || '获取数据失败')
        console.log('fetchDataApi error', err)
      } finally {
        loading.value = false
      }
    },

    /**
     * @description 设置table组件的props
     * @param props table组件的props
     */
    setProps: async (props: TableProps = {}) => {
      const table = await getTable()
      table?.setProps(props)
    },

    /**
     * @description 设置column
     * @param columnProps 需要设置的列
     */
    setColumn: async (columnProps: TableSetProps[]) => {
      const table = await getTable()
      table?.setColumn(columnProps)
    },

    /**
     * @description 新增column
     * @param tableColumn 需要新增数据
     * @param index 在哪里新增
     */
    addColumn: async (tableColumn: TableColumn, index?: number) => {
      const table = await getTable()
      table?.addColumn(tableColumn, index)
    },

    /**
     * @description 删除column
     * @param field 删除哪个数据
     */
    delColumn: async (field: string) => {
      const table = await getTable()
      table?.delColumn(field)
    },

    /**
     * @description 获取ElTable组件的实例
     * @returns ElTable instance
     */
    getElTableExpose: async () => {
      await getTable()
      return unref(elTableRef)
    },

    refresh: () => {
      methods.getList()
    },

    // sortableChange: (e: any) => {
    //   console.log('sortableChange', e)
    //   const { oldIndex, newIndex } = e
    //   dataList.value.splice(newIndex, 0, dataList.value.splice(oldIndex, 1)[0])
    //   // to do something
    // }
    // 删除数据
    delList: async (idsLength: number) => {
      const { fetchDelApi } = config
      if (!fetchDelApi) {
        console.warn('fetchDelApi is undefined')
        return
      }
      ElMessageBox.confirm(t('common.delMessage'), t('common.delWarning'), {
        confirmButtonText: t('common.delOk'),
        cancelButtonText: t('common.delCancel'),
        type: 'warning'
      }).then(async () => {
        const res = await fetchDelApi()
        if (res) {
          ElMessage.success(t('common.delSuccess'))

          // 计算出临界点
          const current =
            unref(total) % unref(pageSize) === idsLength || unref(pageSize) === 1
              ? unref(currentPage) > 1
                ? unref(currentPage) - 1
                : unref(currentPage)
              : unref(currentPage)

          currentPage.value = current
          methods.getList()
        }
      })
    },
    // 批量操作数据
    batchOperateList: async (message: { zh: string; en: string }) => {
      const { zh = '删除', en = 'delete' } = message || {}
      const { fetchBatchOperateApi } = config
      if (!fetchBatchOperateApi) {
        console.warn('fetchBatchOperateApi is undefined')
        return
      }
      ElMessageBox.confirm(
        t('common.batchMessage', { operate: zh, operateEn: en }),
        t('common.delWarning'),
        {
          confirmButtonText: t('common.ok'),
          cancelButtonText: t('common.cancel'),
          type: 'warning'
        }
      ).then(async () => {
        const res = await fetchBatchOperateApi()
        if (res) {
          ElMessage.success(t('common.batchSuccess', { operate: zh, operateEn: en }))
          methods.getList()
        }
      })
    }
  }

  return {
    tableRegister: register,
    tableMethods: methods,
    tableState: {
      currentPage,
      pageSize,
      total,
      dataList,
      loading
    }
  }
}
