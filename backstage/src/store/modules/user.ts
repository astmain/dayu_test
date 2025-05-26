import { defineStore } from 'pinia'
import { store } from '../index'
import { ElMessageBox } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { useTagsViewStore } from './tagsView'
import router from '@/router'

import { UserLoginType2, UserType2 } from '@/api/login/types'
import { AppCustomRouteRecordRaw2 } from '@/api/menu/types'
import defaultAvatar from '@/assets/imgs/avatar.jpg'
import { getUnReadMsgCountApi } from '@/api/notice'

interface UserState {
  userInfo?: UserType2
  tokenKey: string
  token: string
  roleRouters?: string[] | AppCustomRouteRecordRaw[] | AppCustomRouteRecordRaw2[]
  rememberMe: boolean
  loginInfo?: UserLoginType2
  unReadCount: number
}

export const useUserStore = defineStore('user', {
  state: (): UserState => {
    return {
      userInfo: undefined,
      tokenKey: 'Authorization',
      token: '',
      roleRouters: undefined,
      // 记住我
      rememberMe: true,
      loginInfo: undefined,
      unReadCount: 0
    }
  },
  getters: {
    getTokenKey(): string {
      return this.tokenKey
    },
    getToken(): string {
      return this.token
    },
    getUserInfo(): UserType2 | undefined {
      return this.userInfo
    },
    getRoleRouters():
      | string[]
      | AppCustomRouteRecordRaw[]
      | AppCustomRouteRecordRaw2[]
      | undefined {
      return this.roleRouters
    },
    getRememberMe(): boolean {
      return this.rememberMe
    },
    getLoginInfo(): UserLoginType2 | undefined {
      return this.loginInfo
    },
    getUserAvatar(): string {
      return this.userInfo?.avatar || defaultAvatar
    },
    getUnReadCount(): number {
      return this.unReadCount
    }
  },
  actions: {
    setTokenKey(tokenKey: string) {
      this.tokenKey = tokenKey
    },
    setToken(token: string) {
      this.token = token
    },
    setUserInfo(userInfo?: UserType2) {
      this.userInfo = userInfo
    },
    setRoleRouters(roleRouters: string[] | AppCustomRouteRecordRaw2[]) {
      this.roleRouters = roleRouters
    },
    logoutConfirm() {
      const { t } = useI18n()
      ElMessageBox.confirm(t('common.loginOutMessage'), t('common.reminder'), {
        confirmButtonText: t('common.ok'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      })
        .then(async () => {
          this.reset()

          // const res = await loginOutApi().catch(() => {})
          // if (res) {
          //   this.reset()
          // }
        })
        .catch(() => {})
    },
    async cmdLogout() {
      // const res = await forceLogoutApi(id).catch(() => {})
      // 这里是收到 强制退出命令    应该做下打点记录  调用登出接口 及 登出原因类型
      this.reset()
    },
    reset() {
      const tagsViewStore = useTagsViewStore()
      tagsViewStore.delAllViews()
      this.setToken('')
      this.setUserInfo(undefined)
      this.setRoleRouters([])
      router.replace('/login')
    },
    logout() {
      this.reset()
    },
    setRememberMe(rememberMe: boolean) {
      this.rememberMe = rememberMe
    },
    setLoginInfo(loginInfo: UserLoginType2 | undefined) {
      this.loginInfo = loginInfo
    },
    async setUnReadCount() {
      const res = await getUnReadMsgCountApi()
      this.unReadCount = res?.total || 0
    }
  },
  persist: true
})

export const useUserStoreWithOut = () => {
  return useUserStore(store)
}
