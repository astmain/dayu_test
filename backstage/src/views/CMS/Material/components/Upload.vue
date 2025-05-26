<template>
  <el-upload
    v-model:file-list="newFileList"
    action=""
    list-type="picture-card"
    :on-preview="handlePictureCardPreview"
    :on-remove="handleRemove"
    :auto-upload="false"
    :on-change="handleChange"
    :with-credentials="true"
  >
    <!-- <el-icon><Plus /></el-icon> -->
    +
  </el-upload>

  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ElDialog, ElUpload } from 'element-plus'
import type { UploadProps } from 'element-plus'
import { deleteMaterialImageApi, uploadMaterialImageApi } from '@/api/material'
const props = defineProps({
  material_id: {
    type: Number,
    default: () => null
  },
  fileList: {
    type: Object,
    default: () => {}
  }
})

const newFileList = computed(() => {
  return props.fileList?.map((item) => ({ id: item.id, name: item.id, url: item.file_url }))
})
const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handleRemove: UploadProps['onRemove'] = async (uploadFile: any) => {
  const res = await deleteMaterialImageApi({
    id: props?.material_id,
    attachment_id: uploadFile?.id
  })

  console.log("🚀 ~ consthandleRemove:UploadProps['onRemove']= ~ res:", res)
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}

const handleChange: UploadProps['onChange'] = async (uploadFile) => {
  const file = uploadFile.raw
  const filename = file?.name
  const res = await uploadMaterialImageApi({ file, id: props?.material_id, filename })
  console.log("🚀 ~ consthandleChange:UploadProps['onChange']= ~ res:", res)
}
</script>
