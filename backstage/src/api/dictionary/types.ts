// ==========================================
export interface DictionaryBase {
  id: number
  name: string
  code: string
  sort: number
  description?: string
  status: boolean
}

export interface DictionaryEntry extends DictionaryBase {
  parentId?: number
  children?: DictionaryEntry[]
}

export interface DictionaryItem extends DictionaryBase {
  entries?: DictionaryEntry[]
}

export interface DictionaryList {
  list: DictionaryItem[]
  total: number
}

export interface BaseResponse {
  code: number
  message: string
  data?: any
}
