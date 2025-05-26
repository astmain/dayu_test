import { defineStore } from 'pinia'
import { asyncConstantRouterMap, asyncRouterMap, constantRouterMap } from '@/router'
import {
  generateRoutesByFrontEnd,
  generateRoutesByServer,
  flatMultiLevelRoutes
} from '@/utils/routerHelper'
import { store } from '../index'
import { cloneDeep } from 'lodash-es'

import { getMenuListApi2 } from '@/api/menu'
import { AppCustomRouteRecordRaw2 } from '@/api/menu/types'
import { getAllDepartmentListApi, getDepartmentListApi } from '@/api/department'
import { formatToTree } from '@/utils/tree2'
import { DepartmentItem2 } from '@/api/department/types'
import { getRoleListApi2 } from '@/api/role'
import { getLogListApi, getOnlineUserListApi } from '@/api/log'
import { RoleItemType } from '@/api/role/type'

export interface PermissionState {
  routers: AppRouteRecordRaw[]
  addRouters: AppRouteRecordRaw[]
  isAddRouters: boolean
  menuTabRouters: AppRouteRecordRaw[]
  menuManageList: AppCustomRouteRecordRaw2[]
  curMenuInfo: Partial<AppCustomRouteRecordRaw2>
  departmentList: DepartmentItem2[]
  allDepartmentList: DepartmentItem2[]
  roleList: Partial<RoleItemType>[]
  allMenuList: AppCustomRouteRecordRaw2[]
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    routers: [],
    addRouters: [],
    isAddRouters: false,
    menuTabRouters: [],
    menuManageList: [],
    curMenuInfo: {},
    departmentList: [],
    allDepartmentList: [],
    roleList: [],
    allMenuList: []
  }),
  getters: {
    getRouters(): AppRouteRecordRaw[] {
      return this.routers
    },
    getAddRouters(): AppRouteRecordRaw[] {
      return flatMultiLevelRoutes(cloneDeep(this.addRouters))
    },
    getIsAddRouters(): boolean {
      return this.isAddRouters
    },
    getMenuTabRouters(): AppRouteRecordRaw[] {
      return this.menuTabRouters
    },
    getMenuManageList(): AppCustomRouteRecordRaw2[] {
      return this.menuManageList
    },

    getCurMenuInfo(): Partial<AppCustomRouteRecordRaw2> {
      return this.curMenuInfo
    },
    getDepartmentList(): DepartmentItem2[] {
      return this.departmentList
    },
    getAllDepartmentList(): DepartmentItem2[] {
      return this.allDepartmentList
    },
    getRoleList(): any[] {
      return this.roleList
    },
    getAllMenuList(): AppCustomRouteRecordRaw2[] {
      return this.allMenuList
    }
  },
  actions: {
    generateRoutes(
      type: 'server' | 'frontEnd' | 'static',
      routers?: AppCustomRouteRecordRaw[] | string[] | AppCustomRouteRecordRaw2[]
    ): Promise<unknown> {
      return new Promise<void>((resolve) => {
        let routerMap: AppRouteRecordRaw[] = []
        if (type === 'server') {
          // 模拟后端过滤菜单
          routerMap = generateRoutesByServer(routers as AppCustomRouteRecordRaw[])
        } else if (type === 'frontEnd') {
          // 模拟前端过滤菜单
          routerMap = generateRoutesByFrontEnd(cloneDeep(asyncRouterMap), routers as string[])
        } else {
          // 直接读取静态路由表
          routerMap = cloneDeep(asyncRouterMap)
        }
        if (routerMap.length == 0) {
          routerMap = cloneDeep(asyncConstantRouterMap)
        }
        // 动态路由，404一定要放到最后面
        this.addRouters = routerMap.concat([
          {
            path: '/:path(.*)*',
            redirect: '/404',
            name: '404Page',
            meta: {
              hidden: true,
              breadcrumb: false
            }
          }
        ])
        // 渲染菜单的所有路由
        this.routers = cloneDeep(constantRouterMap).concat(routerMap)
        // console.log('xzz2021: this.routers', this.routers)
        resolve()
      })
    },
    setIsAddRouters(state: boolean): void {
      this.isAddRouters = state
    },
    setMenuTabRouters(routers: AppRouteRecordRaw[]): void {
      this.menuTabRouters = routers
    },
    // ==========================================
    async setMenuManageList() {
      const res = await getMenuListApi2()
      const { list = [], total = 0 } = res
      const newList = list.length ? formatToTree(list) : []
      this.allMenuList = list
      this.menuManageList = newList
      return { list: newList, total }
    },
    setCurMenuInfo(info: Partial<AppCustomRouteRecordRaw2>): void {
      this.curMenuInfo = info
    },
    async setDepartmentList(params) {
      const res = await getDepartmentListApi(params)
      this.departmentList = formatToTree(res?.list || []) || []
      return { list: this.departmentList, total: res?.total || 0 }
    },
    async setAllDepartmentList() {
      const res = await getAllDepartmentListApi()
      this.allDepartmentList = formatToTree(res?.list || []) || []
      return this.allDepartmentList
    },
    async setRoleList(params?: any) {
      const res = await getRoleListApi2(params || {})
      const { list = [], total = 0 } = res
      this.roleList = list
      return { list, total }
    },
    async getRoleSelectList() {
      if (!this.roleList.length) {
        await this.setRoleList()
      }
      return this.roleList?.map((v) => {
        return { label: v.name, value: v.id }
      })
    },
    async getLogList(params?: any) {
      const res = await getLogListApi(params)
      return res
    },
    async getOnlineUserListi() {
      const res = await getOnlineUserListApi()
      return res
    }
  },
  // persist: true,
  persist: {
    pick: [
      'routers',
      'addRouters',
      'menuTabRouters',
      'menuManageList',
      // 'curMenuInfo',
      'departmentList',
      'allDepartmentList',
      'roleList'
      // 'isAddRouters'
    ]
  }
})

export const usePermissionStoreWithOut = () => {
  return usePermissionStore(store)
}
