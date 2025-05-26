import { AxiosResponse, InternalAxiosRequestConfig } from './types'
import { ElMessage } from 'element-plus'
import qs from 'qs'
import { SUCCESS_CODE, TRANSFORM_REQUEST_DATA } from '@/constants'
// import { useUserStoreWithOut } from '@/store/modules/user'
import { objToFormData } from '@/utils'

const defaultRequestInterceptors = (config: InternalAxiosRequestConfig) => {
  if (
    config.method === 'post' &&
    config.headers['Content-Type'] === 'application/x-www-form-urlencoded'
  ) {
    config.data = qs.stringify(config.data)
  } else if (
    TRANSFORM_REQUEST_DATA &&
    config.method === 'post' &&
    config.headers['Content-Type'] === 'multipart/form-data' &&
    !(config.data instanceof FormData) // 不是formData 则进行转换
  ) {
    config.data = objToFormData(config.data)
  }
  if (config.method === 'get' && config.params) {
    let url = config.url as string
    url += '?'
    const keys = Object.keys(config.params)
    for (const key of keys) {
      if (config.params[key] !== void 0 && config.params[key] !== null) {
        url += `${key}=${encodeURIComponent(config.params[key])}&`
      }
    }
    url = url.substring(0, url.length - 1)
    config.params = {}
    config.url = url
  }
  // 如果data本身就是formData 则会直接走向这里  不会进行任何处理
  return config
}

// 只有响应拦截器 一号通过了, 才会走到这边的二号
const defaultResponseInterceptors = (response: AxiosResponse) => {
  // console.log('🚀 ~ defaultResponseInterceptors ~ response:', response)
  if (response?.config?.responseType === 'blob') {
    // 如果是文件流，直接过
    return response
  } else if (response.data.code === SUCCESS_CODE) {
    return response.data
  } else if (response.config?.url?.includes('weather')) {
    return response.data
  } else if (response?.data?.result) {
    return response.data.result
  } else {
    // console.log('xzz2021: defaultResponseInterceptors -> response.data', response.data)
    const msg = response?.data?.message || response?.data || '请求失败'

    ElMessage.error(msg?.length > 150 ? msg.slice(0, 150) : msg)
    // if (response?.data?.code === 401) {
    //   const userStore = useUserStoreWithOut()
    //   userStore.logout()
    // }
  }
}

export { defaultResponseInterceptors, defaultRequestInterceptors }
