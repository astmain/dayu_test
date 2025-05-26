<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref, unref, nextTick } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { ElTree, ElCheckboxGroup, ElCheckbox } from 'element-plus'
// import { getMenuListApi } from '@/api/menu'
import { eachTree } from '@/utils/tree'
import { findIndex } from '@/utils'

// ==========================================
import { usePermissionStore } from '@/store/modules/permission'
import { getMenuWithPermissionByRoleId } from '@/api/role'

const { t } = useI18n()

const { required } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  }
})

const treeRef = ref<typeof ElTree>()

const formSchema = ref<FormSchema[]>([
  {
    field: 'name',
    label: t('role.roleName'),
    component: 'Input'
  },
  {
    field: 'status',
    label: t('menu.status'),
    component: 'Select',
    componentProps: {
      options: [
        {
          label: t('userDemo.disable'),
          value: false
        },
        {
          label: t('userDemo.enable'),
          value: true
        }
      ]
    }
  },
  {
    field: 'remark',
    label: t('userDemo.remark'),
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 5
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'menu',
    label: t('role.menu'),
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="flex w-full">
                <div class="flex-1">
                  <ElTree
                    ref={treeRef}
                    show-checkbox
                    node-key="id"
                    highlight-current
                    check-strictly={false}
                    expand-on-click-node={false}
                    data={treeData.value}
                    onNode-click={nodeClick}
                  >
                    {{
                      default: (data) => {
                        return <span>{t(data.data.meta.title)}</span>
                      }
                    }}
                  </ElTree>
                </div>
                <div class="flex-1">
                  {unref(currentTreeData) && unref(currentTreeData)?.permissionList ? (
                    <div class="flex gap-4">
                      <ElCheckbox
                        v-model={unref(currentTreeData).meta.checkAll}
                        indeterminate={unref(currentTreeData).meta.isIndeterminate}
                        onChange={handleCheckAllChange}
                        style={{
                          display:
                            unref(currentTreeData)?.permissionList.length > 1 ? 'block' : 'none'
                        }}
                      >
                        全选
                      </ElCheckbox>
                      <ElCheckboxGroup
                        v-model={unref(currentTreeData).meta.permissions}
                        onChange={handleCheckChange}
                      >
                        {unref(currentTreeData)?.permissionList.map((v: any) => {
                          return <ElCheckbox label={v.label} value={v.value}></ElCheckbox>
                        })}
                      </ElCheckboxGroup>
                    </div>
                  ) : null}
                </div>
              </div>
            </>
          )
        }
      }
    }
  }
])

const currentTreeData = ref()
const nodeClick = (treeData: any) => {
  currentTreeData.value = treeData
}

const rules = reactive({
  name: [required()],
  status: [required()]
})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods

const treeData = ref([])

watch(
  () => props.currentRow,
  (currentRow) => {
    if (!currentRow) return
    setValues(currentRow)
  },
  {
    deep: true,
    immediate: true
  }
)

// ==========================================
const handleCheckAllChange = (val: boolean) => {
  currentTreeData.value.meta.permissions = val
    ? currentTreeData.value.permissionList.map((v: any) => v.value)
    : []
  currentTreeData.value.meta.isIndeterminate = false
}
const handleCheckChange = (val: string[]) => {
  const checkedCount = val.length
  currentTreeData.value.meta.checkAll = checkedCount === currentTreeData.value.permissionList.length
  currentTreeData.value.meta.isIndeterminate =
    checkedCount > 0 && checkedCount < currentTreeData.value.permissionList.length
}

const { getMenuManageList, setMenuManageList } = usePermissionStore()

const getMenuList = async () => {
  // const res = await getMenuListApi()
  let list = await getMenuManageList
  if (!list.length) {
    const { list: newList } = await setMenuManageList()
    list = newList
  }
  // 1. 先获取整颗菜单列表树 permission为[] permissionList存在
  treeData.value = list as any //  mock数据是带有meta permission 和permissionList的数据
  if (!props.currentRow?.id) return
  const res2 = await getMenuWithPermissionByRoleId(props.currentRow.id)
  const currentRoleMenu = res2
  if (!currentRoleMenu.length) return
  await nextTick()
  // 2.  把所有需要勾选的项找出来   {id: menuid, permission: ['permission1', 'permission2']}
  const checked: any[] = []
  eachTree(currentRoleMenu, (v) => {
    //   currentRow.menu 本身带有permission meta也有 permission?????
    checked.push({
      id: v.id,
      permissions: v.meta?.permissions || [] //  当前菜单项权限数组  ['permission1', 'permission2']
    })
  })
  // 3. 遍历树形菜单
  eachTree(treeData.value, (v) => {
    const index = findIndex(checked, (item) => {
      // 找到满足条件的元素  返回索引
      return item.id === v.id
    })
    //  treeData 是数据中permission是空[], 所以需要在此手动赋值
    if (index > -1) {
      const meta = { ...(v.meta || {}) }
      meta.permissions = checked[index].permissions
      v.meta = meta
    }
  })
  //  此处使用了element plus tree组件的设置节点是否被选中方法
  //  这里只是 菜单项被 勾选
  for (const item of checked) {
    unref(treeRef)?.setChecked(item.id, true, false)
  }
  // unref(treeRef)?.setCheckedKeys(
  //   checked.map((v) => v.id),
  //   false
  // )
}
getMenuList()

const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    const formData = await getFormData()
    const checkedNodes = unref(treeRef)?.getCheckedNodes(false, true)
    const permissionIds: number[] = []
    const menuIds: number[] = []
    checkedNodes.map((v) => {
      menuIds.push(v.id)
      v.permissionList.map((w) => {
        if (v.meta?.permissions && v.meta?.permissions.includes(w.value)) {
          permissionIds.push(w.id)
        }
      })
    })
    formData.menuIds = menuIds
    formData.permissionIds = permissionIds
    return formData
  }
}
defineExpose({
  submit
})
</script>

<template>
  <Form :rules="rules" @register="formRegister" :schema="formSchema" />
</template>
