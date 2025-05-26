import type { AppCustomRouteRecordRaw } from 'types/router'

export interface AppCustomRouteRecordRaw2 extends AppCustomRouteRecordRaw {
  id: number
  parentId: number
  children?: AppCustomRouteRecordRaw2[]
  sort: number | null
  status: boolean
  path: string
  permissionList?: any[]
  type: number
}

export interface MenuListResponse {
  code: number
  message: string
  list: AppCustomRouteRecordRaw2[]
  total: number
}
