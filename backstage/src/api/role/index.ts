import request from '@/axios'

import { formatToTree } from '@/utils/tree2'

export const getRoleListApi = () => {
  return request.get({ url: '/mock/role/table' })
}

// ==========================================

export const getRoleListApi2 = (params?: any) => {
  return request.get({ url: '/api/role/getRoleList', params })
}

export const addRoleApi = (data) => {
  return request.post({ url: '/api/role/add', data })
}

export const editRoleApi = (data) => {
  return request.post({ url: '/api/role/update', data })
}

export const getMenuWithPermissionByRoleId = async (id: number) => {
  const res = await request.get({ url: '/api/role/getMenuByRoleId', params: { id } })
  const newRes = formatToTree(res.list)
  return newRes
}

export const delRoleApi = (id) => {
  return request.delete({ url: '/api/role/' + id })
}
