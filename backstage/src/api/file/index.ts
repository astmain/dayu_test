import request from '@/axios'

interface UploadFileParams {
  file: File
  sha256: string
  remark?: string
  [key: string]: any
}
export const uploadFileApi = (data: UploadFileParams) => {
  return request.post({
    url: '/api/staticfile/upload',
    data,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
// export const uploadAvatarApi = (data: { file: Blob; id: number }) => {
//   return request.post({
//     url: '/api/user/upload/avatar',
//     data,
//     headers: { 'Content-Type': 'multipart/form-data' }
//   })
// }
export const getFileListApi = (params: any) => {
  return request.get({ url: '/api/staticfile/list', params })
}

export const delFileApi = (sha256: string) => {
  return request.delete({ url: '/api/staticfile/sha256/' + sha256 })
}

// export const delRoleApi = (id) => {
//   return request.delete({ url: '/api/role/' + id })
// }

// export const delFileApi = (sha256: string) => {
//   return request.delete({ url: '/api/staticfile/' + sha256 })
// }
export const batchDeleteFileApi = (sha256s: string[]) => {
  return request.post({ url: '/api/staticfile/batchDelete2', data: { sha256s } })
}
