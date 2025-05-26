import { create } from "zustand"

import { getHistoryListApi } from "@/network/api/print"

interface PrintHistoryStore {
  printHistory: any[]
  initPrintHistory: () => Promise<void>
}

export const usePrintHistoryStore = create<PrintHistoryStore>((set) => ({
  printHistory: [],
  initPrintHistory: async () => {
    const res = await getHistoryListApi()
    console.log("🚀 ~ initPrintHistory ~ res:", res)
    set({ printHistory: res?.data || [] })
  },
}))
