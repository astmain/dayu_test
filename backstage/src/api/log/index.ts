import request from '@/axios'

export const deleteLogByIdsApi = (ids: string[] | number[]) => {
  return request.delete({ url: '/api/utils/log/delete', data: { ids } })
}
export const getLogListApi = (params: any) => {
  return request.get({ url: '/api/logger/getList', params })
}

export const getOnlineUserListApi = () => {
  console.log('🚀 ~ getOnlineUserListApi ~============= getOnlineUserListApi:')
  return request.get({ url: '/api/utils/online/user' })
}

export const forceLogoutApi = (id: number) => {
  return request.post({ url: '/api/utils/forceLogout', data: { id } })
}
