import request from '@/axios'

export const upsertBomApi = (data) => {
  return request.post({ url: '/api/bom/upsert', data })
}

export const delBomApi = (ids: number[]) => {
  return request.post({ url: '/api/bom/delete', data: { ids } })
}

export const getBomListApi = (params: any) => {
  return request.get({ url: '/api/bom/list', params })
}
