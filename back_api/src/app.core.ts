import { PrismaModule } from '@/prisma/prisma.module';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { WsModule } from './ws/ws.module';
import { UtilModule } from './util/util.module';
import { StaticfileModule } from './staticfile/staticfile.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
// import { AllExceptionsFilter } from './processor/filter/exceptions';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ScheduleTaskModule } from './schedule/schedule.module';
import { PermissionGuard } from './processor/guards/permission.guard';
import { RequestLogInterceptor } from '@/processor/interceptor/log';
import { CONFIG_MODULE } from './core/config.module';
import { SERVER_STATIC_MODULE } from './core/server.static';
import { WinstonLoggerModule } from './logger/winston.module';
import { DynamicThrottlerGuard } from './processor/guards/throttler.guard';
// import { PrismaClientExceptionFilter } from './processor/interceptor/prisma-exception.filter';
// import { FilterKeyInterceptor } from './processor/interceptor/ttt.interceptor';
export const CORE_MODULE = [
  CONFIG_MODULE,
  ThrottlerModule.forRoot([
    {
      ttl: 6000,
      limit: 6,
    },
  ]),
  PrismaModule,
  WsModule,
  // 内置 缓存
  // CacheModule.register({
  //   isGlobal: true, // 使缓存全局可用
  //   ttl: 5000, // 生存时间（毫秒）
  //   max: 10, // 最大缓存项数
  // }),
  // 外部 redis 缓存
  CacheModule.registerAsync({
    useFactory: () => {
      return {
        name: 'redis',
        ttl: 1000, // 这里单位也是毫秒
        stores: [createKeyv('redis://localhost:6379')],
      };
    },
    isGlobal: true,
  }),
  UtilModule,
  // 静态文件
  StaticfileModule,
  SERVER_STATIC_MODULE,
  HttpModule.register({
    timeout: 5000,
    maxRedirects: 5,
    global: true,
  }),
  AuthModule,
  ScheduleTaskModule,
  WinstonLoggerModule,
];

export const GLOBAL_GUARD = [
  {
    // 全局速率限制
    provide: APP_GUARD,
    useClass: ThrottlerGuard,
  },
  {
    // 全局JWT token校验
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },
  {
    // 全局动态限流
    provide: APP_GUARD,
    useClass: DynamicThrottlerGuard,
  },
  {
    // 全局权限校验   //  必须放在jwt校验之后  因为需要获取用户身份
    provide: APP_GUARD,
    useClass: PermissionGuard,
  },

  // { provide: APP_FILTER, useClass: PrismaClientExceptionFilter }, // 全局启用prisma异常过滤器
  { provide: APP_INTERCEPTOR, useClass: RequestLogInterceptor }, // 全局启用日志拦截器
  // { provide: APP_FILTER, useClass: AllExceptionsFilter }, // 全局启用异常过滤器  使用后会截断 一定要进行加工 后续流程
  // { provide: APP_INTERCEPTOR, useClass: FilterKeyInterceptor }, // 全局启用过滤多余信息拦截器
];
