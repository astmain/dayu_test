import { delBomApi, getBomListApi, upsertBomApi } from '@/api/bom'
import { defineStore } from 'pinia'

interface BomState {
  bomList: any[]
}

export const useBomStore = defineStore('bom', {
  state: (): BomState => {
    return {
      bomList: []
    }
  },
  getters: {
    getBomList: (state) => state.bomList
  },
  actions: {
    async updateBomList(params?: any) {
      const res = await getBomListApi(params)
      const list = res?.list
      this.bomList = list
      return { list, total: list?.length }
    },
    async deleteBom(ids: number[]) {
      const res = await delBomApi(ids)
      if (res?.code === 200) {
        return true
      }
      return false
    },
    async upsertBom(formData) {
      const res = await upsertBomApi(formData)
      if (res?.code === 200) {
        return true
      }
      return false
    }
  }
})
