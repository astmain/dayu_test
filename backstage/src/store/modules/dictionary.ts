import {
  delDicEntryApi,
  delDictionaryApi,
  getDicEntryListApi,
  getDictionaryListApi,
  upsertDicEntryApi,
  upsertDictionaryApi
} from '@/api/dictionary'
import { defineStore } from 'pinia'
import { DictionaryEntry, DictionaryItem } from '@/api/dictionary/types'
import { ElMessage } from 'element-plus'

const mapDic = (rawList: any[]) => {
  const list = JSON.parse(JSON.stringify(rawList))
  const res = {}
  list.map((item: any) => {
    res[item.code] = item.entries.map((v: any) => ({
      label: v.name,
      value: v.code
    }))
  })
  return res
}

interface DictionaryState {
  dictionaryMap: Record<string, any>
  dicEntryList: DictionaryEntry[]
  allDictionaryList: DictionaryItem[]
}

export const useDictionaryStore = defineStore('dictionary', {
  state: (): DictionaryState => ({
    dictionaryMap: {},
    dicEntryList: [],
    allDictionaryList: []
  }),
  getters: {
    getDictionaryMap: (state) => state.dictionaryMap,
    getDicEntryList: (state) => state.dicEntryList,
    getAllDictionaryList: (state) => state.allDictionaryList
  },
  actions: {
    // 更新获取所有字典 包含字典项  统一使用
    async updateDictionaryList() {
      const res = await getDictionaryListApi()
      this.allDictionaryList = res?.list
      this.dictionaryMap = mapDic(res?.list)
      return this.allDictionaryList
    },

    async upsertDictionary(data: DictionaryEntry) {
      const res = await upsertDictionaryApi(data)
      if (res?.code === 200) {
        await this.updateDictionaryList()
        return true
      }
      return false
    },
    async deleteDictionary(id: number) {
      const res = await delDictionaryApi([id.toString()])
      if (res?.code === 200) {
        ElMessage.success('删除成功!')
        await this.updateDictionaryList()
      }
    },
    async deleteDictEntry(ids: number[]) {
      const res = await delDicEntryApi(ids)
      if (res?.code === 200) {
        ElMessage.success('删除成功!')
        await this.updateDictionaryList()
        return true
      }
      return false
    },
    // 获取指定字典的字典项列表
    async setDictionaryEntryList(params?: any) {
      const res = await getDicEntryListApi(params)
      this.dicEntryList = res?.list
      return { list: this.dicEntryList, total: res?.total || 0 }
    },
    async upsertDicEntry(data: DictionaryEntry) {
      const res = await upsertDicEntryApi(data)
      if (res?.code === 200) {
        await this.updateDictionaryList()
        return true
      }
      return false
    }
  },
  persist: true
})
