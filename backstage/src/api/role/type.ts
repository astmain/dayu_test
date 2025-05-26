export interface RoleItemType {
  id: number
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export interface RoleList {
  list: Partial<RoleItemType>[]
  total: number
}
