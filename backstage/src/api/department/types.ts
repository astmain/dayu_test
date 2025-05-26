export interface DepartmentItem {
  id: string
  departmentName: string
  children?: DepartmentItem[]
}

export interface DepartmentListResponse {
  list: DepartmentItem[]
}

export interface DepartmentUserParams {
  pageSize: number
  pageIndex: number
  id: string
  username?: string
  account?: string
}

export interface DepartmentUserItem {
  id: string
  username: string
  account: string
  email: string
  createTime: string
  role: string
  department: DepartmentItem
}

export interface DepartmentUserResponse {
  list: DepartmentUserItem[]
  total: number
}

// ==========================================
export interface DepartmentItem2 {
  id: number
  name: string
  children?: DepartmentItem[]
  sort: number | null
  parentId: number
}

export interface DepartmentListResponse2 {
  list: DepartmentItem2[]
  total: number
}

export interface DepartmentUserItem2 {
  id: number
  username: string
  account: string
  email: string
  createTime: string
  role: string
  departments: DepartmentItem
  departmentId: number | string
  roles: { id: number; name: string }[] | number[]
  roleArr: any
}
