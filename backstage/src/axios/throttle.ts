import { getRequestKey } from './requestKey'

// 缓存上次请求的时间戳
const requestCache = new Map<string, number>()
const THROTTLE_GAP = 1000 // 1秒

setInterval(() => {
  const now = Date.now()
  for (const [key, time] of requestCache) {
    if (now - time > THROTTLE_GAP) {
      requestCache.delete(key)
    }
  }
}, 60 * 1000)

export const throttleWrap = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  delay: number = THROTTLE_GAP
): T => {
  return ((...args: any[]) => {
    const key = getRequestKey(args[0])
    const now = Date.now()
    const lastTime = requestCache.get(key)

    return new Promise((resolve, reject) => {
      if (lastTime && now - lastTime < delay) {
        return reject(new Error('请求被节流，请稍后再试'))
      }

      // 设置请求时间戳
      requestCache.set(key, now)

      // 处理 Promise 结果
      return fn(...args)
        .then(resolve)
        .catch(reject)
    })
  }) as T
}

/*

//  同时缓存方法 url 和 data和 data
const getRequestKey = (config: AxiosConfig): string => {
  const dataStr = JSON.stringify(config.data || {})
  const urlStr = config.url
  return `${config.method || 'get'}::${urlStr}::${dataStr}`
}
  */
