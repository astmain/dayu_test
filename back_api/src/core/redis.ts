//  这里 使用 redis 缓存  对 redis做容灾处理

// redis-cache.factory.ts
// import * as redisStore from 'cache-manager-ioredis';
// import { Redis } from 'ioredis';
// import { CacheModuleOptions } from '@nestjs/common';

// export async function redisCacheFactory(): Promise<CacheModuleOptions> {
//   const redis = new Redis({
//     host: 'localhost',
//     port: 6379,
//     connectTimeout: 3000,
//     lazyConnect: true, // 不立即连接
//     retryStrategy: () => null, // 不自动重连
//   });

//   try {
//     await redis.connect();
//     await redis.ping(); // 测试连通性
//     console.log('[Cache] ✅ 使用 Redis 缓存');
//     return {
//       store: redisStore,
//       ttl: 5,
//       redisInstance: redis,
//     };
//   } catch (error) {
//     console.warn('[Cache] ⚠️ Redis 无法连接，回退到内存缓存');
//     return {
//       ttl: 5,
//       isGlobal: true, // 即便 fallback，也是全局缓存
//     };
//   }
// }
