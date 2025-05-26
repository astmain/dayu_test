<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'
import { ref, unref, watch } from 'vue'
import { ElTree, ElInput, ElDivider } from 'element-plus'
import { useTable } from '@/hooks/web/useTable'
import { Search } from '@/components/Search'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { Dialog } from '@/components/Dialog'
import { BaseButton } from '@/components/Button'

import { addUserApi, getUserByDepartmentIdApi, updateUserApi } from '@/api/user'
import type { FormSchema } from '@/components/Form'
import { formatToDateTime } from '@/utils/dateUtil'
import { ElMessage } from 'element-plus'
import type { DepartmentItem2, DepartmentUserItem2 } from '@/api/department/types'
import { deleteUserByIdsApi } from '@/api/department'
import { TableColumn } from '@/components/Table'
import { storeToRefs } from 'pinia'
import { useDepartmentStore } from '@/store/modules/department'
const { t } = useI18n()
const { getDepartmentList } = useDepartmentStore()
const { departmentList } = storeToRefs(useDepartmentStore())

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { pageSize, currentPage } = tableState
    const res = await getUserByDepartmentIdApi({
      id: unref(currentNodeKey),
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize),
      ...unref(searchParams)
    })
    return {
      list: res?.list || [],
      total: res?.total || 0
    }
  },
  fetchDelApi: async () => {
    const res = await deleteUserByIdsApi(unref(ids))
    return !!res
  }
})
const { total, loading, dataList, pageSize, currentPage } = tableState
const { getList, getElTableExpose, delList } = tableMethods

const searchParams = ref<any>({})
const setSearchParams = (params: any) => {
  currentNodeKey.value = 0
  currentPage.value = 1
  searchParams.value = params
  getList()
  searchParams.value = {}
}

const treeEl = ref<typeof ElTree>()

const tableColumns = ref<TableColumn[]>([
  {
    label: '用户名',
    field: 'username'
  },
  {
    label: '手机号',
    field: 'phone'
  },
  {
    label: '部门',
    field: 'department.name'
  },
  {
    label: '创建时间',
    field: 'createdAt',
    slots: {
      default: (data: any) => {
        return <>{formatToDateTime(data.row.createdAt)}</>
      }
    }
  },
  {
    field: 'roles',
    label: '角色',
    slots: {
      default: (data: any) => {
        const roles = data?.row?.roles
        return roles ? <>{roles.map((v) => v.name).join(',')}</> : <></>
      }
    }
  },
  {
    label: '操作',
    field: 'action',
    width: 240,
    slots: {
      default: (data: any) => {
        const row = data.row as DepartmentUserItem2
        return (
          <>
            <BaseButton type="primary" onClick={() => action(row, 'edit')} disabled={row?.id === 1}>
              {t('exampleDemo.edit')}
            </BaseButton>
            <BaseButton type="success" onClick={() => action(row, 'detail')}>
              {t('exampleDemo.detail')}
            </BaseButton>
            <BaseButton type="danger" onClick={() => delData(row)} disabled={row?.id === 1}>
              {t('exampleDemo.del')}
            </BaseButton>
          </>
        )
      }
    }
  }
])

const currentNodeKey = ref<number>(-1)

const fetchDepartment = async () => {
  await getDepartmentList({})
  // await nextTick()
  // unref(treeEl)?.setCurrentKey(currentNodeKey.value)
}
fetchDepartment()

const currentDepartment = ref('')
watch(
  () => currentDepartment.value,
  (val) => {
    unref(treeEl)!.filter(val)
  }
)

const currentChange = (data: DepartmentItem2) => {
  currentNodeKey.value = Number(data.id)
  currentPage.value = 1
  getList()
}

const filterNode = (value: string, data: DepartmentItem2) => {
  if (!value) return true
  return data.name.includes(value)
}

const dialogVisible = ref(false)
const dialogTitle = ref('')

const currentRow = ref<DepartmentUserItem2>()
const actionType = ref('')

const delLoading = ref(false)
const ids = ref<string[]>([])

const delData = async (row?: DepartmentUserItem2) => {
  const elTableExpose = await getElTableExpose()
  ids.value = row
    ? [row.id]
    : elTableExpose?.getSelectionRows().map((v: DepartmentUserItem2) => v.id) || []
  delLoading.value = true

  await delList(unref(ids).length).finally(() => {
    delLoading.value = false
  })
}

const action = async (row: DepartmentUserItem2, type: string) => {
  dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
  actionType.value = type
  // type === 'edit' ? (editLoading.value = true) : (detailLoading.value = true)

  currentRow.value = {
    ...row,
    // departmentId: row?.department?.id || 0, // id 用于下拉回显
    roleArr: JSON.parse(JSON.stringify(row?.roles || [])), // 用于详情页展示
    roles: row?.roles?.map((v) => v.id) || [] // id数组用于下拉回显
    // department: unref(treeEl)?.getCurrentNode() || {} // id 用于表单下拉数据
  } //getCurrentNode返回当前被选中节点的数据
  dialogVisible.value = true
  // unref(treeSelectRef)?.setCheckedKeys([row.department.id], true) //  自动选中相应部门
  // unref(treeSelectRef)?.setCurrentKey(row.department.id) //  自动选中相应部
}

const writeRef = ref<ComponentRef<typeof Write>>()

const saveLoading = ref(false)

const searchSchema = ref<FormSchema[]>([
  {
    field: 'username',
    label: t('userDemo.username'),
    component: 'Input'
  },
  {
    field: 'phone',
    label: '手机号',
    component: 'Input'
  }
])
const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()

  const isEdit = actionType.value === 'edit' //  判断是修改还是新增
  if (formData) {
    try {
      //  提交 新增 或者 修改
      saveLoading.value = true
      const res = isEdit ? await updateUserApi(formData) : await addUserApi(formData)
      if (res?.id) {
        dialogVisible.value = false
        ElMessage.success('更新成功!')
        currentPage.value = 1
        getList()
      }
    } catch (error) {
      console.log('🚀 ~ xzz: save -> error', error)
    } finally {
      saveLoading.value = false
    }
  }
}
</script>

<template>
  <div class="flex w-100% h-100%">
    <ContentWrap class="w-250px">
      <div class="flex justify-center items-center">
        <div class="flex-1">{{ t('userDemo.departmentList') }}</div>
        <ElInput
          v-model="currentDepartment"
          class="flex-[2]"
          :placeholder="t('userDemo.searchDepartment')"
          clearable
        />
      </div>
      <ElDivider />
      <ElTree
        ref="treeEl"
        :data="departmentList"
        default-expand-all
        :expand-on-click-node="false"
        node-key="id"
        :current-node-key="currentNodeKey"
        :props="{
          label: 'name'
        }"
        :filter-node-method="filterNode"
        @current-change="currentChange"
      >
        <template #default="{ data }">
          <div :title="data.name" class="whitespace-nowrap overflow-ellipsis overflow-hidden">
            {{ data.name }}
          </div>
        </template>
      </ElTree>
    </ContentWrap>
    <ContentWrap class="flex-[3] ml-20px">
      <Search
        @reset="setSearchParams({ id: -1 })"
        @search="setSearchParams"
        :schema="searchSchema"
      />
      <div class="mb-10px">
        <!-- <BaseButton type="primary" @click="AddAction">{{ t('exampleDemo.add') }}</BaseButton> -->
        <!-- <BaseButton :loading="delLoading" type="danger" @click="delData()">
          {{ t('exampleDemo.del') }}
        </BaseButton> -->
      </div>
      <Table
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :columns="tableColumns"
        :data="dataList"
        :loading="loading"
        @register="tableRegister"
        :pagination="{
          total
        }"
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
  </div>
</template>
