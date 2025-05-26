import request from '@/axios'

const MATERIAL = '/api/material/'

enum MaterialApi {
  MaterialList = MATERIAL + 'list',
  AddMaterial = MATERIAL + 'add',
  EditMaterial = MATERIAL + 'update',
  DeleteMaterial = MATERIAL + 'delete',
  SearchMaterial = MATERIAL + 'query',
  UploadMaterialImage = MATERIAL + 'upload',
  DeleteMaterialImage = MATERIAL + 'delete_file'
}
export const getMaterialListApi = (params?: any) => {
  return request.get({ url: MaterialApi.MaterialList, params })
}

export const addMaterialApi = (data) => {
  return request.post({ url: MaterialApi.AddMaterial, data })
}

export const editMaterialApi = (data) => {
  return request.post({ url: MaterialApi.EditMaterial, data })
}

export const delMaterialApi = (ids: string[]) => {
  return request.post({ url: MaterialApi.DeleteMaterial, data: { ids } })
}

export const searchMaterialApi = (data) => {
  return request.get({ url: MaterialApi.SearchMaterial, params: data })
}

// 材料图片上传
export const uploadMaterialImageApi = (data) => {
  return request.post({
    url: MaterialApi.UploadMaterialImage,
    data,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export const deleteMaterialImageApi = (data) => {
  return request.post({ url: MaterialApi.DeleteMaterialImage, data })
}

//  交期
const DELIVERY_TIME = '/api/deliveryinfo/'

enum DeliveryTimeApi {
  DeliveryTimeList = DELIVERY_TIME + 'list',
  UpsertDeliveryTime = DELIVERY_TIME + 'upsert',
  DeleteDeliveryTime = DELIVERY_TIME + 'delete'
}
export const getDeliveryTimeApi = () => {
  return request.get({ url: DeliveryTimeApi.DeliveryTimeList })
}
export const upsertDeliveryTimeApi = (data) => {
  return request.post({ url: DeliveryTimeApi.UpsertDeliveryTime, data })
}

export const delDeliveryTimeApi = (id) => {
  return request.post({ url: DeliveryTimeApi.DeleteDeliveryTime, data: { id } })
}

const SPECIFICATION = '/api/specification/'

enum SpecificationApi {
  SpecificationList = SPECIFICATION + 'list',
  UpsertSpecification = SPECIFICATION + 'upsert',
  DeleteSpecification = SPECIFICATION + 'delete',
  UpsertSpecificationItem = SPECIFICATION + 'upsert_item',
  DeleteSpecificationItem = SPECIFICATION + 'delete_item'
}
//  增值服务  规格选择项目
export const getSpecificationListApi = () => {
  return request.get({ url: SpecificationApi.SpecificationList })
}

export const upsertSpecificationApi = (data) => {
  return request.post({ url: SpecificationApi.UpsertSpecification, data })
}

export const delSpecificationApi = (ids: string[]) => {
  return request.post({ url: SpecificationApi.DeleteSpecification, data: { ids } })
}

// 规格子项 添加 删除  更新

export const upsertSpecificationItemApi = (data) => {
  return request.post({ url: SpecificationApi.UpsertSpecificationItem, data })
}

export const delSpecificationItemApi = (ids: number[]) => {
  return request.post({ url: SpecificationApi.DeleteSpecificationItem, data: { ids } })
}
