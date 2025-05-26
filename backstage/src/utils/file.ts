import { uploadFileApi } from '@/api/file'
import { AudioTypes, DocTypes, FileIcon, ImageTypes, VideoTypes } from '@/constants/file'

export const formatFileSize = (size: number) => {
  let formatSize = ''
  if (size > 1024 * 1024 * 1024) {
    formatSize = `${(size / 1024 / 1024 / 1024).toFixed(2)} GB`
  } else if (size > 1024 * 1024) {
    formatSize = `${(size / 1024 / 1024).toFixed(2)} MB`
  } else if (size > 1024) {
    formatSize = `${(size / 1024).toFixed(2)} KB`
  } else {
    formatSize = `${size} B`
  }
  return formatSize
}

// 计算文件的sha256
export const getFileSha256 = async (file: File) => {
  const buffer = await file.arrayBuffer() // 将文件转换为 ArrayBuffer
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer) // 计算哈希值
  const hashArray = Array.from(new Uint8Array(hashBuffer)) // 转换为字节数组
  const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('') // 转换为十六进制字符串
  return hashHex
}

export const getFileIcon = (extension: string) => {
  return FileIcon[extension]
}

export const isImage = (extension: string) => {
  return ImageTypes.includes(extension)
}

type FileType = 'image' | 'video' | 'doc' | 'other' | 'audio'
export const getFileType = (extension: string): FileType => {
  if (ImageTypes.includes(extension)) {
    return 'image'
  } else if (VideoTypes.includes(extension)) {
    return 'video'
  } else if (DocTypes.includes(extension)) {
    return 'doc'
  } else if (AudioTypes.includes(extension)) {
    return 'audio'
  } else {
    return 'other'
  }
}
export function downloadFile({
  url,
  target = '_blank',
  fileName
}: {
  url: string
  target?: '_self' | '_blank'
  fileName?: string
}): Promise<boolean> {
  // 是否同源
  const isSameHost = new URL(url).host === location.host
  return new Promise<boolean>((resolve, reject) => {
    if (isSameHost) {
      // 同源资源，直接使用 <a> 标签下载
      const link = document.createElement('a')
      link.href = url
      link.target = target

      if (link.download !== undefined) {
        link.download = fileName || url.split('.').pop() || 'download'
      }

      if (document.createEvent) {
        const e = document.createEvent('MouseEvents')
        e.initEvent('click', true, true)
        link.dispatchEvent(e)
        return resolve(true)
      }

      if (!url.includes('?')) {
        url += '?download'
      }

      window.open(url, target)
      return resolve(true)
    } else {
      // 跨域资源，使用 fetch 获取文件并下载
      fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
          const link = document.createElement('a')
          link.href = URL.createObjectURL(blob)
          link.download = fileName || url.split('.').pop() || 'download'
          link.style.display = 'none'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(link.href)
          resolve(true)
        })
        .catch((err) => {
          reject(err)
        })
    }
  })
}

export const uploadFile = async (uploadFile: File) => {
  //  计算文件的sha256
  const sha256 = await getFileSha256(uploadFile)

  const res = await uploadFileApi({ remark: '', sha256, file: uploadFile })
  if (res.code == 200) {
    return res.data
  }
}

export const formatDataFn = (data: any[]) => {
  return data.map((item) => {
    const { id, children, permissionList, parentId, meta, ...rest } = item
    // 移除meta和permissionList的id
    if (meta) {
      delete meta.id
    }
    if (permissionList) {
      permissionList.forEach((item: any) => {
        delete item.id
      })
    }

    return {
      ...rest,
      permissionList: permissionList?.length ? permissionList : undefined,
      meta: meta ? meta : undefined,
      children: children?.length ? formatDataFn(children) : undefined
    }
  })
}

export const exportMenuSeedData = (data: any[]) => {
  const jsonData = formatDataFn(data)
  // 导出下载
  downloadFile({
    url: 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(jsonData, null, 2)),
    fileName: 'menuSeed.json'
  })
}
