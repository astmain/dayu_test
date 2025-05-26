import { request } from "@/network/axios"

import { AddHistory2CartDataRes, BaseRes, BaseResList, DeleteHistoryDataRes, GetHistoryListRes } from "./type"

const PREFIX = "fileinfo/"

enum URL {
  getHistoryListApi = PREFIX + "list",
  addHistory2CartApi = PREFIX + "cart",
  deleteHistoryApi = PREFIX + "delete",
}

// 添加到购物车
export const addHistory2CartApi = (ids: number[]) =>
  request.post<BaseRes<AddHistory2CartDataRes>>("fileinfo/add_cart", ids)

// 删除历史
export const deleteHistoryApi = (data: { ids: number[] }) =>
  request.post<BaseRes<DeleteHistoryDataRes>>(URL.deleteHistoryApi, data)

// 获取历史列表
export const getHistoryListApi = () => request.get<BaseRes<GetHistoryListRes[]>>("fileinfo/list")

// 获取购物车列表
export const getCartListApi = () => request.get<BaseResList<any[]>>("cart/ownerlist")

// 删除购物车
export const deleteCartApi = (ids: number[]) => request.post<BaseRes<any[]>>("cart/deleteItem", ids)

// 获取产品分类列表  材料加产品
export const getProductCategoryListApi = () => request.get<BaseRes<any[]>>("product_category/list")

// 购物车 当前产品  修改规格
export const updateCartProductApi = (data: { id: number; code: string; name: string; category_id: number }) =>
  request.post<BaseRes<any[]>>("product_material/update", data)
