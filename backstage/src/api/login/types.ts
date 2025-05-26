import type { AppCustomRouteRecordRaw } from 'types/router'

export interface UserLoginType {
  username: string
  password: string
}

export interface UserType {
  username: string
  password: string
  role: string
  roleId: string
}

//   ==========================================

export interface UserLoginType2 {
  password: string
  phone: string
}

interface AppCustomRouteRecordRaw2 extends AppCustomRouteRecordRaw {
  id: number
  parentId: number
  children?: AppCustomRouteRecordRaw2[]
  sort: number | null
}

export interface RouteRecordResponse {
  code: number
  message: string
  menuList: AppCustomRouteRecordRaw2[]
  adminList: AppCustomRouteRecordRaw[]
}

export interface ResCode {
  code: number
  message: string
}

export interface WechatLoginRes {
  code: number
  message: string
  userinfo: UserType | { nickName: string; headimgurl: string; unionid: string }
  access_token?: string
}

export interface SmsLoginRes {
  code: number
  message: string
  userinfo: UserType | { phone: string }
  access_token?: string
}

export interface UserType2 {
  id: number
  username: string
  phone: string
  avatar: string
  roleList: { id: number; name: string }[]
  department: { id: number; name: string }
  createdAt: string
  email: string
}

export interface RegisterResType {
  data: {
    avatar: string
    createdAt: string
    deletedAt: string
    departmentId: string
    id: number
    isDeleted: boolean
    password: string
    phone: string
    status: boolean
    updatedAt: string
    username: string
    wechatId: string
  }
}
export interface UserRegisterType {
  username: string
  password: string
  phone: string
  code: string
}

interface Role {
  id: string
  name: string
}
export interface UserInfo {
  id: string
  username: string
  phone: string
  avatar: string
  role: Role[]
}

export interface LoginResType {
  code: number
  userinfo: UserType2 | { phone: string }
  access_token?: string
  message: string
}
