import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CORE_MODULE, GLOBAL_GUARD } from './app.core';
import { TABLE_MODULE } from './app.table';
import { UtilService } from '@/util/util.service';
import { SshModule } from './ssh/ssh.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { CartModule } from './table/cart/cart.module';
import { SpecificationModule } from './table/specification/specification.module';
import { DeliveryinfoModule } from './table/deliveryinfo/deliveryinfo.module';
import { BomModule } from './table/bom/bom.module';

@Module({
  imports: [...CORE_MODULE, ...TABLE_MODULE, SshModule, CartModule, SpecificationModule, DeliveryinfoModule, BomModule],
  controllers: [AppController],
  providers: [
    AppService, // controller希望使用service  必须在modlue里向外暴露  roviders
    {
      //  全局缓存所有端点
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    UtilService,
    ...GLOBAL_GUARD,
  ],
})
export class AppModule implements NestModule {
  configure(_consumer: MiddlewareConsumer) {
    // _consumer
    //   .apply(
    //     helmet({
    //       crossOriginResourcePolicy: { policy: 'cross-origin' }, // 允许跨域资源加载
    //     }),
    //   )
    //   .forRoutes('/static');
  }
}
