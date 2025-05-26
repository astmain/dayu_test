import {
  getMaterialListApi,
  getSpecificationListApi,
  getDeliveryTimeApi,
  upsertSpecificationItemApi,
  delSpecificationItemApi,
  upsertDeliveryTimeApi
} from '@/api/material'
import { defineStore } from 'pinia'

interface CmsState {
  materialList: any[]
  materialTotal: number
  specificationList: any[]
  deliveryTimeList: any[]
}

export const useCmsStore = defineStore('cmsxzz', {
  state: (): CmsState => {
    return {
      materialList: [],
      materialTotal: 0,
      specificationList: [],
      deliveryTimeList: []
    }
  },
  getters: {
    getMaterialList: (state) => state.materialList,
    getMaterialTotal: (state) => state.materialTotal,
    getSpecificationList: (state) => state.specificationList,
    getDeliveryTimeList: (state) => state.deliveryTimeList
  },
  actions: {
    async updateMaterialList(params?: any) {
      const res = await getMaterialListApi(params)
      const list = res?.list
      this.materialList = list
      this.materialTotal = list?.length
      return { list, total: list?.length }
    },
    async updateSpecificationList() {
      const res = await getSpecificationListApi()
      this.specificationList = res?.list
      return { list: this.specificationList, total: this.specificationList?.length }
    },
    async updateSpecificationItemList(formData) {
      const res = await upsertSpecificationItemApi(formData)
      if (res?.code === 200) {
        // await this.updateSpecificationList()
        return true
      }
      return false
    },
    async updateDeliveryTimeList() {
      const res = await getDeliveryTimeApi()
      this.deliveryTimeList = res?.list
      return { list: this.deliveryTimeList, total: this.deliveryTimeList?.length }
    },
    async upsertDeliveryTime(formData) {
      const res = await upsertDeliveryTimeApi(formData)
      if (res?.code === 200) {
        // await this.updateDeliveryTimeList()
        return true
      }
      return false
    },
    async deleteSpecListItme(ids: number[]) {
      const res = await delSpecificationItemApi(ids)
      if (res?.code === 200) {
        return true
      }
      return false
    }
  }
})
