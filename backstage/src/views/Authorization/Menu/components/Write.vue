<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref, unref } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
// import { getMenuListApi } from '@/api/menu'
import { ElButton, ElInput, ElMessage, ElPopconfirm, ElTable, ElTableColumn } from 'element-plus'
import AddButtonPermission from './AddButtonPermission.vue'
import { BaseButton } from '@/components/Button'
import { cloneDeep } from 'lodash-es'

// ==========================================
import { usePermissionStore } from '@/store/modules/permission'
import { batchCreatePermissionApi, delPermission, updatePermission } from '@/api/menu'
import { useClipboard } from '@/hooks/web/useClipboard'

const { t } = useI18n()

const { required } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  }
})

const handleEdit = async (row: any) => {
  // 深拷贝当前行数据到编辑行
  permissionEditingRow.value = { ...row }
}

const showDrawer = ref(false)
// 存储正在编辑的行的数据
const permissionEditingRow = ref<any>(null)
const cacheComponent = ref('')

const formSchema = reactive<FormSchema[]>([
  {
    field: 'type',
    label: '菜单类型',
    component: 'RadioButton',
    value: 0,
    colProps: {
      span: 24
    },
    componentProps: {
      options: [
        {
          label: '目录',
          value: 0
        },
        {
          label: '菜单',
          value: 1
        }
      ],
      on: {
        change: async (val: number) => {
          const formData = await getFormData()
          if (val === 1) {
            setSchema([
              {
                field: 'component',
                path: 'componentProps.disabled',
                value: false
              },
              {
                field: 'name',
                path: 'componentProps.disabled',
                value: true
              }
            ])
            setValues({
              component: unref(cacheComponent)
            })
          } else {
            setSchema([
              {
                field: 'component',
                path: 'componentProps.disabled',
                value: true
              },
              {
                field: 'name',
                path: 'componentProps.disabled',
                value: false
              }
            ])

            if (formData.parentId === void 0) {
              setValues({
                component: '#'
              })
            } else {
              setValues({
                component: '##'
              })
            }
          }
        }
      }
    }
  },
  {
    field: 'parentId',
    label: '父级菜单',
    component: 'TreeSelect',
    componentProps: {
      nodeKey: 'id',
      props: {
        // label: 'title',
        label: (item: any) => {
          return t(item?.meta?.title)
        },
        value: 'id',
        children: 'children'
      },
      highlightCurrent: true,
      expandOnClickNode: false,
      checkStrictly: true,
      checkOnClickNode: true,
      clearable: true,
      on: {
        change: async (val: number) => {
          const formData = await getFormData()
          if (val && formData.type === 0) {
            setValues({
              component: '##'
            })
          } else if (!val && formData.type === 0) {
            setValues({
              component: '#'
            })
          } else if (formData.type === 1) {
            setValues({
              component: unref(cacheComponent) ?? ''
            })
          }
        }
      }
    },
    optionApi: async () => {
      // const res = await getMenuListApi()
      // return res.data.list || []
      const res = usePermissionStore().getMenuManageList
      return res || []
    }
  },
  {
    field: 'meta.title',
    label: t('menu.menuName'),
    component: 'Input'
  },
  {
    field: 'component',
    label: '组件',
    component: 'Input',
    value: '#',
    componentProps: {
      disabled: true,
      placeholder: '#为顶级目录，##为子目录',
      on: {
        change: (val: string) => {
          cacheComponent.value = val
          setValues({ ...props.currentRow, component: val, name: val.split('/').pop() })
        }
      }
    }
  },
  {
    field: 'name',
    label: t('menu.name'),
    component: 'Input',
    componentProps: {
      on: {
        change: (val: string) => {
          setValues({ name: val.charAt(0).toUpperCase() + val.slice(1) })
        }
      }
    }
  },
  {
    field: 'meta.icon',
    label: t('menu.icon'),
    component: 'Input'
  },
  {
    field: 'path',
    label: t('menu.path'),
    component: 'Input'
  },
  {
    field: 'meta.activeMenu',
    label: t('menu.activeMenu'),
    component: 'Input'
  },
  {
    field: 'redirect',
    label: t('menu.redirect'),
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
    field: 'permissionList',
    label: t('menu.permission'),
    component: 'CheckboxGroup',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: (data: any) => {
          return (
            <>
              <div>
                <BaseButton
                  type="primary"
                  size="small"
                  onClick={() => (showDrawer.value = true)}
                  disabled={!data?.id}
                >
                  添加权限
                </BaseButton>
                <BaseButton type="danger" size="small" onClick={batchCreatePermission}>
                  快速生成增删改查
                </BaseButton>
                <BaseButton type="success" size="small" onClick={copyFormdata}>
                  一键复制表单
                </BaseButton>
                <BaseButton type="success" size="small" onClick={writeFormdata}>
                  一键写入表单
                </BaseButton>
              </div>
              <ElTable data={data?.permissionList}>
                <ElTableColumn type="index" prop="id" />
                <ElTableColumn
                  prop="label"
                  label="权限标识"
                  v-slots={{
                    default: ({ row }: any) =>
                      permissionEditingRow.value && permissionEditingRow.value.id === row.id ? (
                        <ElInput v-model={permissionEditingRow.value.label} size="small" />
                      ) : (
                        <div class="mr-1" key={row.value}>
                          {row.label}
                        </div>
                      )
                  }}
                />
                <ElTableColumn
                  prop="value"
                  label="值"
                  v-slots={{
                    default: ({ row }: any) =>
                      permissionEditingRow.value && permissionEditingRow.value.id === row.id ? (
                        <ElInput v-model={permissionEditingRow.value.value} size="small" />
                      ) : (
                        <span>{row.value}</span>
                      )
                  }}
                />

                <ElTableColumn
                  label="操作"
                  width="160"
                  v-slots={{
                    default: ({ row }: any) =>
                      permissionEditingRow.value && permissionEditingRow.value.id === row.id ? (
                        <>
                          <ElButton size="small" type="primary" onClick={handleSave}>
                            确定
                          </ElButton>
                          <ElButton
                            size="small"
                            type="warning"
                            onClick={() => (permissionEditingRow.value = null)}
                          >
                            取消
                          </ElButton>
                        </>
                      ) : (
                        <>
                          <ElButton size="small" type="primary" onClick={() => handleEdit(row)}>
                            编辑
                          </ElButton>
                          <ElPopconfirm title="确定删除?" onConfirm={() => handleDelete(row)}>
                            {{
                              reference: () => (
                                <ElButton size="small" type="danger">
                                  删除
                                </ElButton>
                              )
                            }}
                          </ElPopconfirm>
                        </>
                      )
                  }}
                />
              </ElTable>
            </>
          )
        }
      }
    }
  },
  {
    field: 'meta.hidden',
    label: t('menu.hidden'),
    component: 'Switch'
  },
  {
    field: 'meta.alwaysShow',
    label: t('menu.alwaysShow'),
    component: 'Switch'
  },
  {
    field: 'meta.noCache',
    label: t('menu.noCache'),
    component: 'Switch'
  },
  {
    field: 'meta.breadcrumb',
    label: t('menu.breadcrumb'),
    component: 'Switch'
  },
  {
    field: 'meta.affix',
    label: t('menu.affix'),
    component: 'Switch'
  },
  {
    field: 'meta.noTagsView',
    label: t('menu.noTagsView'),
    component: 'Switch'
  },
  {
    field: 'meta.canTo',
    label: t('menu.canTo'),
    component: 'Switch'
  }
])

const rules = reactive({
  component: [required()],
  name: [required()],
  path: [required()],
  'meta.title': [required()]
})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose, setSchema } = formMethods

const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    const formData = await getFormData()
    delete formData.children
    delete formData.permissionList
    if (formData.id && formData.id === formData.parentId) {
      ElMessage.error('父级菜单不能选择自己')
      return
    }
    return formData
  }
}

const batchCreatePermission = async () => {
  const formData = await getFormData()
  formData.nodeid = Date.now().toString()
  try {
    const { id, path } = usePermissionStore().getCurMenuInfo
    const res = await batchCreatePermissionApi({ menuId: id, path })
    if (res?.count) {
      emit('refresh2', id)
      ElMessage.success('快速生成权限模版成功')
    } else {
      ElMessage.error(res?.message || '生成权限模版失败')
    }
  } catch (error) {
    console.log('🚀 ~ xzz: confirm -> error', error)
  }
  // 清空表单
  // formMethods.resetForm()
}

watch(
  () => props.currentRow,
  async (value) => {
    if (!value) return
    const currentRow = cloneDeep(value)
    // ==========================================
    const { id, path } = currentRow
    id && (await usePermissionStore().setCurMenuInfo({ id, path })) // 设置当前菜单id
    // ==========================================
    cacheComponent.value = currentRow.type === 1 ? currentRow.component : ''
    if (currentRow.parentId === 0) {
      setSchema([
        {
          field: 'component',
          path: 'componentProps.disabled',
          value: true
        }
      ])
    } else {
      setSchema([
        {
          field: 'component',
          path: 'componentProps.disabled',
          value: false
        }
      ])
    }
    if (currentRow.type === 1) {
      setSchema([
        {
          field: 'component',
          path: 'componentProps.disabled',
          value: false
        },
        {
          field: 'name',
          path: 'componentProps.disabled',
          value: true
        }
      ])
    } else {
      setSchema([
        {
          field: 'component',
          path: 'componentProps.disabled',
          value: true
        },
        {
          field: 'name',
          path: 'componentProps.disabled',
          value: false
        }
      ])
    }
    setValues(currentRow)
  },
  {
    deep: true,
    immediate: true
  }
)

defineExpose({
  submit
})

// ==========================================
const emit = defineEmits(['refresh', 'refresh2'])

const handleDelete = async (tag: any) => {
  try {
    const res = await delPermission(tag.id)
    if (res?.id) {
      // permissionEditingRow.value = null // 重置编辑状态
      // 删除对应的权限
      const formData = await getFormData()
      // console.log('✨ 🍰 ✨ xzz2021: handleDelete -> formData', formData)
      // setValues({
      //   permissions: formData?.permissions?.filter((v: any) => v.value !== tag.value)
      // })
      emit('refresh2', formData?.id)
    }
  } catch (error) {
    console.log('🚀 ~ xzz: handleDelete -> error', error)
  }
}

const handleSave = async () => {
  const formData = await getFormData()
  const index = formData?.permissionList?.findIndex((x) => x.id === permissionEditingRow.value.id)
  if (index !== -1) {
    const newPermission = { ...permissionEditingRow.value }
    newPermission.name = (formData.path + '_' + newPermission.value).toUpperCase()
    // formData.permissionList[index] = newPermission
    try {
      const res = await updatePermission(newPermission)
      if (res?.id) {
        permissionEditingRow.value = null // 重置编辑状态
        emit('refresh')
      } else {
        // 更新失败  还原
        // formData.permissionList[index] = permissionEditingRow.value
      }
    } catch (error) {
      console.log('🚀 ~ xzz: handleSave -> error', error)
    }
  }
}

const confirm = async (id: number) => {
  if (!id) return ElMessage.error('菜单id不存在, 请刷新页面后再试!')
  emit('refresh2', id)
}

const { copy, getText } = useClipboard()

const copyFormdata = async () => {
  const formData = await getFormData()
  const { component, name, path, type, status, meta, redirect } = formData
  const dataStr = JSON.stringify({ component, name, path, type, status, meta, redirect })
  copy(dataStr)
  ElMessage.success('复制成功!')
}

const writeFormdata = async () => {
  // 获取剪贴板数据
  const dataStr = await getText()
  const formdata = JSON.parse(dataStr || '{}')
  cacheComponent.value = formdata?.component
  setValues(formdata)
  if (formdata.type === 1) {
    setSchema([
      {
        field: 'component',
        path: 'componentProps.disabled',
        value: false
      },
      {
        field: 'name',
        path: 'componentProps.disabled',
        value: true
      }
    ])
  } else {
    setSchema([
      {
        field: 'component',
        path: 'componentProps.disabled',
        value: true
      },
      {
        field: 'name',
        path: 'componentProps.disabled',
        value: false
      }
    ])
  }
}
</script>

<template>
  <Form :rules="rules" @register="formRegister" :schema="formSchema" />
  <AddButtonPermission v-model="showDrawer" @confirm="confirm" />
</template>
