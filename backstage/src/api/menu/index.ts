import request from '@/axios'

import type { MenuListResponse } from './types'

export const getMenuListApi = () => {
  return request.get({ url: '/mock/menu/list' })
}

export const getMenuListApi2 = async (): Promise<MenuListResponse> => {
  const res = await request.get({ url: '/api/menu/getMenuList' })
  return res
}
export const generateDevMenuApi = () => {
  return request.get({ url: '/api/util/generateDevMenu' })
}

export const addMenuApi = (data) => {
  return request.post({ url: '/api/menu/add', data })
}

export const editMenuApi = (data) => {
  return request.post({ url: '/api/menu/update', data })
}

export const delMenuApi = (id) => {
  return request.delete({ url: '/api/menu/' + id })
}

export const addPermission = (data) => {
  return request.post({ url: '/api/permission/add', data })
}
export const updatePermission = (data) => {
  return request.post({ url: '/api/permission/update', data })
}
export const delPermission = (id) => {
  return request.delete({ url: '/api/permission/' + id })
}

export const sortMenuApi = (data) => {
  return request.post({ url: '/api/menu/sort', data })
}

export const batchCreatePermissionApi = (data) => {
  return request.post({ url: '/api/permission/batchCreate', data })
}

export const generateMenuSeedApi = (data) => {
  return request.post({ url: '/api/menu/generateMenuSeed', data })
}
