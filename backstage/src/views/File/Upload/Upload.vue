<script setup lang="tsx">
import { BaseButton } from '@/components/Button'
import { ContentWrap } from '@/components/ContentWrap'
import { TableColumn } from '@/components/Table'
import { useClipboard } from '@/hooks/web/useClipboard'
import { ElUpload, UploadFile, ElMessage, ElInput } from 'element-plus'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Table } from '@/components/Table'
import { formatFileSize, getFileSha256 } from '@/utils/file'
import { Icon } from '@/components/Icon'
const currentFileInfo = ref()
const imgBase64 = ref('')
const uploadList = ref<any[]>([])

import { useIcon } from '@/hooks/web/useIcon'
import { uploadFileApi } from '@/api/file'

const uploadChange = async (uploadFile: UploadFile) => {
  // 判断是否是图片
  // if (uploadFile?.raw?.type.indexOf('image') === -1) {
  //   ElMessage.error('请上传图片格式的文件')
  //   return
  // }
  if (!uploadFile.raw) return
  imgBase64.value = ''
  const name = uploadFile.name
  const type = uploadFile?.raw?.type || name.split('.').pop() || ''
  const size = uploadFile?.raw?.size
  //  计算文件的sha256
  const sha256 = await getFileSha256(uploadFile.raw)

  currentFileInfo.value = {
    name,
    type,
    size: Number(size),
    sha256,
    remark: '',
    file: uploadFile.raw
  }

  // 如果文件是图片类型
  const isImage = uploadFile.raw.type.indexOf('image') !== -1
  if (isImage) {
    // 获取图片的访问地址
    const url = URL.createObjectURL(uploadFile.raw)
    imgBase64.value = url
  }
}

const confirmUpload = async () => {
  if (!currentFileInfo.value) {
    ElMessage.error('请先上传文件')
    return
  }
  if (uploadList.value.find((item) => item.sha256 === currentFileInfo.value?.sha256)) {
    ElMessage.error('文件已存在')
    return
  }
  // 1. 上传文件
  try {
    const { remark, sha256, file } = currentFileInfo.value
    const res = await uploadFileApi({ remark, sha256, file })
    if (res.code == 200) {
      ElMessage.success('上传成功')
    } else {
      ElMessage.error('上传失败' + res.message)
    }
  } catch (error) {
    console.log('xzz2021: confirmUpload -> error', error)
  }
  // 2. 加入列表
  const { file, ...rest } = currentFileInfo.value

  uploadList.value.push({ ...rest, url: '' })
  // 3. 清空当前文件信息
  currentFileInfo.value.remark = ''
  console.log('xzz2021: confirmUpload -> fileInfo', currentFileInfo.value)
}

const delFile = (sha256: string) => {
  uploadList.value = uploadList.value.filter((item) => item.sha256 !== sha256)
}

const { copy } = useClipboard()

const { t } = useI18n()

const tableColumns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('userDemo.index'),
    type: 'index'
  },
  {
    field: 'name',
    label: '文件名'
  },
  {
    field: 'type',
    label: '文件类型'
  },
  {
    field: 'size',
    label: '文件大小',
    formatter: (row: any) => formatFileSize(row.size)
  },
  {
    field: 'url',
    label: '文件地址'
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
            <BaseButton type="primary" onClick={() => copy(row.url)}>
              复制链接
            </BaseButton>
            <BaseButton type="danger" onClick={() => delFile(row.uid)}>
              {t('exampleDemo.del')}
            </BaseButton>
          </>
        )
      }
    }
  }
])
const uploadIcon = useIcon({ icon: 'vi-ant-design:upload-outlined' })
// const rotateLeftIcon = useIcon({ icon: 'vi-ant-design:rotate-left-outlined' })
</script>

<template>
  <ContentWrap title="文件上传">
    <div class="flex items-center justify-center h-300px gap-30px">
      <div class="flex-1 flex flex-col h-full justify-between">
        <el-upload
          class="upload-demo"
          drag
          :auto-upload="false"
          :show-file-list="false"
          :on-change="uploadChange"
          action=""
        >
          <Icon icon="vi-ant-design:upload-outlined" :size="42" />
          <div class="el-upload__text"> 拖动文件到此处或 <em>点击上传</em> </div>
          <!-- <template #tip>
            <div class="el-upload__tip"> jpg/png files with a size less than 500kb </div>
          </template> -->
        </el-upload>
        <div v-if="currentFileInfo" class="flex flex-col gap-20px">
          <div class="flex items-center gap-20px">
            <div class="flex items-center gap-5px">
              <span>文件名: </span>
              <span class="text-red-500 max-w-100px truncate">{{ currentFileInfo?.name }}</span>
            </div>
            <div class="flex items-center gap-5px">
              <span>文件类型: </span>
              <span class="text-red-500">{{ currentFileInfo?.type }}</span>
            </div>
            <div class="flex items-center gap-5px">
              <span>文件大小: </span>
              <span class="text-red-500">{{ formatFileSize(currentFileInfo?.size) }}</span>
            </div>
          </div>
          <div class="flex items-center gap-10px">
            <ElInput
              v-model="currentFileInfo.remark"
              placeholder="文件备注信息"
              style="width: 260px"
            />
            <BaseButton type="primary" @click="confirmUpload" :icon="uploadIcon"
              >确认上传</BaseButton
            >
            <!-- <BaseButton type="primary" @click="cancelUpload" :icon="rotateLeftIcon"
              >重置文件</BaseButton
            > -->
          </div>
        </div>
      </div>
      <div class="h-full flex-1 flex justify-center border-1 border-red-500">
        <img v-if="imgBase64" :src="imgBase64" class="" />
      </div>
    </div>
  </ContentWrap>
  <ContentWrap title="文件列表" v-if="uploadList.length > 0" class="mt-10px">
    <Table :columns="tableColumns" node-key="id" :data="uploadList" align="center" />
  </ContentWrap>
</template>
