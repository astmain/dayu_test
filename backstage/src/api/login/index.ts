import request from '@/axios'
// import type { UserType } from './types'
import type {
  RouteRecordResponse,
  UserRegisterType,
  UserType,
  UserType2,
  LoginResType,
  ResCode,
  WechatLoginRes,
  SmsLoginRes,
  RegisterResType
} from './types'

interface RoleParams {
  roleName: string
}

export const loginApi = (data: UserType): Promise<IResponse<UserType>> => {
  return request.post({ url: '/mock/user/login', data })
}

export const loginOutApi = (): Promise<IResponse> => {
  return request.get({ url: '/mock/user/loginOut' })
}

export const getUserListApi = ({ params }: AxiosConfig) => {
  return request.get<{
    code: string
    data: {
      list: UserType[]
      total: number
    }
  }>({ url: '/mock/user/list', params })
}

export const getAdminRoleApi = (
  params: RoleParams
): Promise<IResponse<AppCustomRouteRecordRaw[]>> => {
  return request.get({ url: '/mock/role/list', params })
}

export const getTestRoleApi = (params: RoleParams): Promise<IResponse<string[]>> => {
  return request.get({ url: '/mock/role/list2', params })
}

//   ==========================================

export const loginApi2 = (data: UserType2): Promise<LoginResType> => {
  return request.post({ url: '/api/auth/login', data })
}

export const smsLoginApi = (data: { phone: string; code: string }): Promise<LoginResType> => {
  return request.post({ url: '/api/auth/sms/login', data })
}

export const registerApi = (data: UserRegisterType): Promise<RegisterResType> => {
  return request.post({ url: 'api/auth/register', data })
}

export const getRoleMenuApi = (): Promise<RouteRecordResponse> => {
  return request.get({ url: '/api/role/getRoleMenu' })
}

export const getSmsCode = (data: { phone: string; type: string }): Promise<ResCode> => {
  return request.post({ url: '/api/auth/getSmsCode', data })
}

export const smsBind = (data: any): Promise<SmsLoginRes> => {
  return request.post({ url: '/api/auth/sms/bind', data })
}

export const wechatLogin = (code: string): Promise<WechatLoginRes> => {
  return request.post({ url: '/api/auth/wechat/login', data: { code } })
}

export const wechatBind = (data: any): Promise<WechatLoginRes> => {
  return request.post({ url: '/api/auth/wechat/bind', data })
}
