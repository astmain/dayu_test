import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import helmet from 'helmet';
import { createSwagger } from './core/swagger';
import { GLOBAL_VALIDATION_PIPE } from './processor/pipe/globalValidationPipe';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER as 'NestWinston')); // 使用winston替换掉nest内置日志
  console.log(`111---process.env.PORT:`, process.env.PORT);
  console.log(`http://127.0.0.1:8001/api-docs                admin/123456`);

  // app.use(
  //   helmet({
  //     crossOriginEmbedderPolicy: false,
  //     contentSecurityPolicy: {
  //       directives: {
  //         imgSrc: [`'self'`, 'data:', '*'],
  //         scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
  //         manifestSrc: [`'self'`, 'apollo-server-landing-page.cdn.apollographql.com'],
  //         frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
  //       },
  //     },
  //     crossOriginResourcePolicy: { policy: 'cross-origin' }, // 加这一行才能加载图片资源
  //   }),
  // );

  app.setGlobalPrefix('api');
  createSwagger(app);

  app.useGlobalPipes(GLOBAL_VALIDATION_PIPE); // 全局类转换校验  定义了dto的会自动转换
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
