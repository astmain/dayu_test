import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

export const SERVER_STATIC_MODULE = ServeStaticModule.forRoot({
  rootPath: join(process.cwd(), 'static'), // 静态文件的根路径  不能设置为dist 因为编译会清理

  serveRoot: '/static', // 设置 URL 路径前缀
  // 如果需要设置 CORS，可以在这里自定义 headers
  serveStaticOptions: {
    setHeaders: (res: any) => {
      res.setHeader('Access-Control-Allow-Origin', '*'); // 允许所有源访问
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // 允许的请求方法
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept'); // 允许的请求头
    },
  },
});
