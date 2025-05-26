export interface NoticeItem {
  id: string
  title: string
  type: string
  recipientIds: string[]
  content: string
  isPublished: boolean
  createdAt: string
  creator: {
    username: string
    id: number
  }
}

export interface NoticeListResponse {
  list: NoticeItem[]
  total: number
}

export interface NoticeRecipientItem {
  id: number
  notice: NoticeItem
  noticeId: number
  user: {
    username: string
    id: number
  }
  userId: number
  isRead: boolean
  createdAt: string
}

export interface NoticeRecipientListResponse {
  list: NoticeRecipientItem[]
  total: number
}
