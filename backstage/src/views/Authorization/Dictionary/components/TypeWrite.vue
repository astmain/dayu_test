<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, ref, unref, watch } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { DictionaryItem, DictionaryEntry } from '@/api/dictionary/types'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox, ElTree } from 'element-plus'
import { useDictionaryStore } from '@/store/modules/dictionary'
import { ContentWrap } from '@/components/ContentWrap'
import { ElInput } from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { delDictionaryApi } from '@/api/dictionary'
import { ElPopover, ElButton } from 'element-plus'
import { storeToRefs } from 'pinia'
const { required } = useValidator()

const dictionaryStore = useDictionaryStore()
const { allDictionaryList } = storeToRefs(dictionaryStore)
const props = defineProps({
  currentRow: {
    type: Object as PropType<Nullable<DictionaryItem>>,
    default: () => null
  }
})

const rules = reactive({
  name: [required()],
  code: [required()],
  status: [required()],
  dicCategoryId: [required()]
})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods

const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    const formData = await getFormData()
    delete formData.entries

    try {
      saveLoading.value = true
      const res = await dictionaryStore.upsertDictionary(formData as DictionaryEntry)
      if (res) {
        dialogVisible.value = false
        ElMessage.success('更新成功!')
        currentChange({ id: formData.id, name: formData.name })
      }
    } catch (error) {
      console.log('🚀 ~ submit ~ error:', error)
    } finally {
      saveLoading.value = false
    }
  }
}

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

const { t } = useI18n()

const formSchema = reactive<FormSchema[]>([
  {
    field: 'name',
    label: '字典名称',
    component: 'Input'
  },
  {
    field: 'code',
    label: '字典编码',
    component: 'Input'
  },

  {
    field: 'description',
    label: t('userDemo.remark'),
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 5
    },
    colProps: {
      span: 24
    }
  }
])
const treeEl = ref<typeof ElTree>()

const currentDictType = ref('')
watch(
  () => currentDictType.value,
  (val) => {
    unref(treeEl)!.filter(val)
  }
)

const dialogVisible = ref(false)
const dialogTitle = ref('')
const saveLoading = ref(false)
const actionType = ref('')
// =================主逻辑=========================
// const DictList = ref<DictionaryItem[]>([])

// onMounted(() => {
//   const res = dictionaryStore.getAllDictionaryList
//   DictList.value = res
// })
const emit = defineEmits(['currentChange'])
const currentNodeKey = ref<number>(1)

const currentChange = (data: { id: number; name: string }) => {
  currentNodeKey.value = Number(data.id)
  emit('currentChange', currentNodeKey.value)
}

const filterNode = (value: string, data: { id: number; name: string }) => {
  if (!value) return true
  return data.name.includes(value)
}

const addType = () => {
  dialogVisible.value = true
  dialogTitle.value = t('exampleDemo.add')
  actionType.value = 'add'
}

const refreshList = async () => {
  await dictionaryStore.updateDictionaryList()
}

const editType = (data: { id: number; name: string; code: string }) => {
  actionType.value = 'edit'
  dialogVisible.value = true
  dialogTitle.value = t('exampleDemo.edit')
  setValues(data)
}
const deleteType = (id: number) => {
  if (!id) return
  ElMessageBox.confirm('确定删除该字典类型吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const res = await delDictionaryApi([id.toString()])
    if (res?.code === 200) {
      ElMessage.success('删除成功!')
      await refreshList()
    } else {
      ElMessage.error('删除失败!')
    }
  })
}

const handleContextmenu = (id: number) => {
  unref(treeEl)?.setCurrentKey(id)
}
</script>

<template>
  <ContentWrap class="w-250px">
    <div class="flex justify-center items-center h-full">
      <div class="flex-1">类型</div>
      <div class="flex justify-center items-center gap-10px">
        <Icon icon="ep:plus" :size="16" class="cursor-pointer" @click="addType" />
        <Icon icon="ep:refresh-right" :size="16" class="cursor-pointer" @click="refreshList" />
      </div>
    </div>

    <div class="my-10px">
      <ElInput
        v-model="currentDictType"
        class="flex-[2]"
        :placeholder="t('userDemo.searchDepartment')"
        clearable
      />
    </div>
    <!-- <ElDivider /> -->
    <ElTree
      ref="treeEl"
      :data="allDictionaryList"
      default-expand-all
      :expand-on-click-node="false"
      node-key="id"
      :current-node-key="currentNodeKey"
      highlight-current
      :props="{
        label: 'name'
      }"
      :filter-node-method="filterNode"
      @current-change="currentChange"
    >
      <template #default="{ data }">
        <ElPopover ref="popover" trigger="contextmenu" width="auto">
          <template #default>
            <ElButton type="primary" plain @click="editType(data)">编辑</ElButton>
            <ElButton type="danger" plain @click="deleteType(data?.id)">删除</ElButton>
          </template>
          <template #reference>
            <div
              @contextmenu="handleContextmenu(data?.id)"
              :title="data.name"
              class="whitespace-nowrap overflow-ellipsis overflow-hidden w-full"
            >
              {{ data.name }}
            </div>
          </template>
        </ElPopover>
      </template>
    </ElTree>
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <Form :rules="rules" @register="formRegister" :schema="formSchema" />
    <template #footer>
      <BaseButton type="primary" :loading="saveLoading" @click="submit">
        {{ t('exampleDemo.save') }}
      </BaseButton>
      <BaseButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</BaseButton>
    </template>
  </Dialog>
</template>
<style>
/* .is-current {
  background-color: #4053fd !important;
} */
</style>
