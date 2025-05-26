import { request } from "@/network/axios"

import {
  BaseRes,
  ChangePasswordData,
  ChangePayPasswordData,
  ChangePhoneData,
  ChangeRes,
  UpdateUserInfoData,
  UserInfoData,
} from "./type"

const PREFIX = "user/"

enum URL {
  ChangePasswordApi = PREFIX + "change_password",
  ChangePayPasswordApi = PREFIX + "change_pay_password",
  ChangePhoneApi = PREFIX + "change_phone",
  UpdateUserInfoData = PREFIX + "updateInfo", // 用户信息
  DeRegisterApi = PREFIX + "disable", // 注销账号
}

export const ChangePasswordApi = (data: ChangePasswordData) =>
  request.post<BaseRes<ChangeRes>>(URL.ChangePasswordApi, data)

export const ChangePayPasswordApi = (data: ChangePayPasswordData) =>
  request.post<BaseRes<ChangeRes>>(URL.ChangePayPasswordApi, data)

export const ChangePhoneApi = (data: ChangePhoneData) => request.post<BaseRes<ChangeRes>>(URL.ChangePhoneApi, data)

export const UpdateUserInfoApi = (data: UpdateUserInfoData) =>
  request.post<BaseRes<UserInfoData>>(URL.UpdateUserInfoData, data)

export const DeRegisterApi = (data: { id: number }) => request.post<BaseRes<any>>(URL.DeRegisterApi, data)
