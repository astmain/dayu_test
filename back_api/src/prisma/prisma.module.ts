import { Global, Module } from '@nestjs/common';
import { PrismaService as PgService } from './prisma.service';
// import { MongoService } from './mongo.service';

// import { PrismaCoreModule } from './prisma-core.module';
// import { PrismaModuleOptions } from './interface';
// import { PrismaService as MongoService } from './prisma2.service';
@Global() // 标记为全局模块
@Module({
  providers: [PgService], //  此处定义只是会初始化此实例
  exports: [PgService], // 当需要将service注入到其他模块使用时，需要导出, 从而其他模块自动new 当前class时才有这个变量
})
export class PrismaModule {
  // static forRoot(options?: PrismaModuleOptions): DynamicModule {
  //   return {
  //     module: PrismaModule,
  //     imports: [PrismaCoreModule.forRoot(options as PrismaModuleOptions)],
  //   };
  // }
  // static forRootAsync(options?: PrismaModuleOptions): DynamicModule {
  //   return {
  //     module: PrismaModule,
  //     imports: [PrismaCoreModule.forRootAsync(options as PrismaModuleOptions)],
  //   };
  // }
}
