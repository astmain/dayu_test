import type { AxiosRequestConfig } from 'axios'

// 缓存生成的 key
const keyCache = new Map<string, string>()

// 规范化数据，确保属性顺序一致
const normalizeData = (data: any): string => {
  if (!data) return ''
  if (typeof data !== 'object') return String(data)

  const sortedMap = new Map()
  Object.keys(data)
    .sort()
    .forEach((key) => {
      sortedMap.set(key, data[key])
    })

  return JSON.stringify(Object.fromEntries(sortedMap))
}

// 简单的 hash 函数
const hash = (str: string): string => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return hash.toString(36)
}

/**
 * 生成请求的唯一标识 key
 * @param config Axios 请求配置
 * @returns 请求的唯一标识
 */
export const getRequestKey = (config: AxiosRequestConfig): string => {
  try {
    const { method = 'get', url, data, params } = config

    // 生成临时 key 用于缓存查找
    const tempKey = `${method}::${url}::${JSON.stringify(params)}::${JSON.stringify(data)}`

    // 检查缓存
    if (keyCache.has(tempKey)) {
      return keyCache.get(tempKey)!
    }

    // 处理 params（URL 参数）
    const normalizedParams = params ? normalizeData(params) : ''

    // 处理 data（请求体）
    const normalizedData = data ? normalizeData(data) : ''

    // 组合 key 并生成 hash
    const keyStr = `${method}::${url}::${normalizedParams}::${normalizedData}`
    const hashedKey = hash(keyStr)

    // 存入缓存
    keyCache.set(tempKey, hashedKey)

    return hashedKey
  } catch (error) {
    console.error('Error generating request key:', error)
    // 返回一个基于基本信息的 fallback key
    return `${config.method || 'get'}::${config.url}`
  }
}

/**
 * 清理 key 缓存
 * @param maxSize 最大缓存数量，超过此数量将清理最早的缓存
 */
export const clearKeyCache = (maxSize: number = 1000): void => {
  if (keyCache.size > maxSize) {
    const keysToDelete = Array.from(keyCache.keys()).slice(0, keyCache.size - maxSize)
    keysToDelete.forEach((key) => keyCache.delete(key))
  }
}
