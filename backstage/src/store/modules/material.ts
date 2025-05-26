import { delMaterialApi, getMaterialListApi, addMaterialApi, editMaterialApi } from '@/api/material'
import { defineStore } from 'pinia'

export const useMaterialStore = defineStore('material', {
  state: () => ({
    materialList: []
  }),
  getters: {
    getMaterialList: (state) => state.materialList
  },
  actions: {
    async updateMaterialList(params?: any) {
      const res = await getMaterialListApi(params)
      const list = res?.data
      this.materialList = list
      return { list, total: list?.length }
    },
    async addMaterial(data: any) {
      const res = await addMaterialApi(data)
      return res
    },
    async editMaterial(data: any) {
      const res = await editMaterialApi(data)
      return res
    },
    async delMaterial(ids: string[]) {
      const res = await delMaterialApi(ids)
      return res
    }
  }
})
