// import { DynamicModule, Global, Module, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
// import { PrismaService as PgService } from './prisma.service';
// import { PrismaModuleOptions, getDbType } from './interface';
// import { PrismaClient as PgClient } from './client/postgresql';
// import { PrismaClient as MysqlClient } from './client/mysql';
// // import { PrismaService as MongoService } from './prisma2.service';
// @Global() // 标记为全局模块
// @Module({
//   providers: [PgService], //  此处定义只是会初始化此实例
//   exports: [PgService], // 当需要将service注入到其他模块使用时，需要导出, 从而其他模块自动new 当前class时才有这个变量
// })
// export class PrismaCoreModule implements OnApplicationBootstrap, OnApplicationShutdown {
//   static forRoot(options: PrismaModuleOptions): DynamicModule {
//     const { url, options: option = {} } = options;
//     const dbType = getDbType(url);
//     const CONFIG = { datasources: { db: { url }, ...option } };
//     const PrismaClientProvider = {
//       provide: 'PRISMA_CLIENT',
//       useFactory: () => {
//         console.log('🚀 ~ PrismaCoreModule ~ forRoot ~ dbType:', dbType);
//         if (dbType === 'postgresql') {
//           return new PgClient(CONFIG);
//         } else if (dbType === 'mysql') {
//           return new MysqlClient(CONFIG);
//         } else {
//           throw new Error(`Unsupported database type: ${dbType}`);
//         }
//       },
//     };
//     return {
//       module: PrismaCoreModule,
//       providers: [PrismaClientProvider],
//       exports: [PrismaClientProvider],
//     };
//   }
//   static forRootAsync(_options?: PrismaModuleOptions): DynamicModule {
//     return {
//       module: PrismaCoreModule,
//       providers: [PgService],
//       exports: [PgService],
//     };
//   }
//   //   理论上数据库连接的实例化 应该在此处模块创建时  而程序关闭时应该 销毁数据库连接池
//   onApplicationBootstrap() {
//     console.log('PrismaModule onApplicationBootstrap');
//   }
//   onApplicationShutdown() {
//     console.log('PrismaModule onApplicationShutdown');
//   }
// }
