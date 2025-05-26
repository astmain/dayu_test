import request from '@/axios'
import { DepartmentUserParams, DepartmentUserResponse, UserItem2 } from './types'
interface IdResponse {
  id: number
}
interface DetailUserResponse {
  department: { id: number; name: string }
  roles: { id: number; name: string }[]
}

// interface PersonResponse {
//   userInfo: UserItem
// }

interface PersonResponse2 {
  userInfo: UserItem2
}
// 根据 部门id 进行分页查询
export const getUserByDepartmentIdApi = (params: DepartmentUserParams) => {
  return request.get<DepartmentUserResponse>({ url: '/api/user/listByDepartmentId', params })
}

export const resetPasswordApi = (data) => {
  return request.post<IdResponse>({ url: '/api/user/resetPassword', data })
}
export const getUserByIdApi = (params: { id: number }) => {
  return request.get<DetailUserResponse>({ url: '/api/user/detailById', params })
}

export const getAllUserApi = () => {
  return request.get({ url: '/api/user/all' })
}

export const addUserApi = (data) => {
  return request.post({ url: '/api/user/add', data })
}

export const updateUserApi = (data) => {
  return request.post({ url: '/api/user/update', data })
}

//  根据id获取用户个人中心信息  及角色数组
export const getPersonByIdApi = (params: { id: number }) => {
  return request.get<PersonResponse2>({ url: '/api/user/detailInfo', params })
}

// 更新用户信息
export const updatePersonApi = (data) => {
  return request.post({ url: '/api/user/updateInfo', data })
}

// 更新用户密码
export const updatePasswordApi = (data) => {
  return request.post({ url: '/api/user/updatePassword', data })
}

//  表单数据 和 blob一起提交时  无法确定边界
// 上传头像
export const uploadAvatarApi = (data: FormData) => {
  return request.post({
    url: '/api/user/upload/avatar',
    data,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
