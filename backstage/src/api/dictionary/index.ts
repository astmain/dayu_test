import request from '@/axios'
import { BaseResponse, DictionaryList } from './types'

// //  获取不带entry的 字典列表
// export const getAllDictionaryListApi = () => {
//   return request.get<DictionaryList>({ url: '/api/dictionary/all' })
// }

// export const getDicListApi = () => {
//   return request.get<DictionaryList>({ url: '/api/dictionary/list' })
// }

//===================

// export const addDictionaryApi = (data) => {
//   return request.post({ url: '/api/dictionary/add', data })
// }

// export const editDictionaryApi = (data) => {
//   return request.post({ url: '/api/dictionary/update', data })
// }

//  此处后端合并了处理分页查询和 带id过滤的分页查询
export const getDictionaryListApi = () => {
  return request.get<DictionaryList>({ url: '/api/dictionary/all' })
}

export const upsertDictionaryApi = (data) => {
  return request.post({ url: '/api/dictionary/upsert', data })
}

export const delDictionaryApi = (ids: string[]) => {
  return request.post({ url: '/api/dictionary/delete', data: { ids } })
}

//  字典项
export const upsertDicEntryApi = (data) => {
  return request.post<BaseResponse>({ url: '/api/dictionary/entry/upsert', data })
}

export const delDicEntryApi = (ids: number[]) => {
  return request.post({ url: '/api/dictionary/entry/delete', data: { ids } })
}

export const getDicEntryListApi = (params: any) => {
  return request.get<DictionaryList>({ url: '/api/dictionary/entry/list', params })
}
