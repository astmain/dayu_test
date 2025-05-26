import { getRoleMenuApi } from '@/api/login'
import { formatToTree } from '@/utils/tree2'
import { useUserStore } from '@/store/modules/user'
import { usePermissionStore } from '@/store/modules/permission'
import { useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router'
import { ref, watch } from 'vue'
import { AppCustomRouteRecordRaw2 } from '@/api/menu/types'
// import { set } from 'nprogress'

const userStore = useUserStore()
const permissionStore = usePermissionStore()

export const useRoleMenu = () => {
  const { currentRoute, addRoute, push } = useRouter()
  const redirect = ref<string>('')

  // 获取角色信息
  const getRole = async () => {
    // 后端直接通过token解析用户角色
    // const res =
    //   appStore.getDynamicRouter && appStore.getServerDynamicRouter
    //     ? await getRoleMenuApi() //  走服务端获取路由
    //     : await getTestRoleApi({ roleName: 'test' })
    const res = await getRoleMenuApi() //  走服务端获取路由
    // console.log('xzz2021: getRole -> res', res)
    const { code, menuList } = res
    if (code === 200) {
      const routers = menuList ? formatToTree(menuList) : []
      // console.log('xzz2021: getRole -> routers', JSON.parse(JSON.stringify(routers)))
      userStore.setRoleRouters(routers as AppCustomRouteRecordRaw2[])
      await permissionStore
        .generateRoutes('server', routers as AppCustomRouteRecordRaw2[])
        .catch(() => {})

      permissionStore.getAddRouters.forEach((route) => {
        addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
      })
      permissionStore.setIsAddRouters(true)
      // console.log('xzz2021: getRole -> redirect.value', redirect.value)
      //  1. 这里正常应该跳转到来源路由, 一般首次登录来源是首页/, 从而会跳转到常量路由里定义的redirect项,如果此时路由不存在就会跳转404
      // 2. 所以开发阶段, 要么设定好常量路由第0项的redirect, 要么直接跳转已有路由的第0项 避免出错
      // 3. 最佳方案, 必须存在一个所有用户都拥有的路由欢迎页, 从而避免跳转404
      push({ path: redirect.value || permissionStore.routers[0].path })
      // push({ path: '/authorization/menu' })
    }
  }

  watch(
    () => currentRoute.value,
    (route: RouteLocationNormalizedLoaded) => {
      redirect.value = route?.query?.redirect as string
    },
    {
      immediate: true
    }
  )
  return {
    redirect,
    getRole
  }
}
