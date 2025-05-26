import request from '@/axios'

export const getNoticeListApi = (params: any) => {
  return request.get({ url: '/api/notice/list', params })
}
export const deleteNoticeByIdsApi = (ids: string[]) => {
  return request.delete({ url: '/api/notice/deleteByIds', data: { ids } })
}
export const addNoticeApi = (data: any) => {
  return request.post({ url: '/api/notice/add', data })
}
export const editNoticeApi = (data: any) => {
  return request.post({ url: '/api/notice/update', data })
}

export const getSelfNoticeListApi = (params: any) => {
  return request.get({ url: '/api/notice/selfList', params })
}
export const markAsReadApi = (ids: string[]) => {
  return request.post({ url: '/api/notice/markAsRead', data: { ids } })
}

export const getUnReadMsgCountApi = () => {
  return request.get({ url: '/api/notice/unread' })
}
