import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { Request, Response, NextFunction } from 'express';
import basicAuth from 'basic-auth';

function swaggerAuth(username: string, password: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = basicAuth(req);
    if (!user || user.name !== username || user.pass !== password) {
      res.set('WWW-Authenticate', 'Basic realm="Swagger"');
      return res.status(401).send('Authentication required.');
    }
    next();
  };
}

export function createSwagger(app: INestApplication) {
  // Swagger 密码保护
  app.use('/api-docs', swaggerAuth('admin', '123456')); // 设定用户名密码
  const config = new DocumentBuilder()
    .setTitle('后台管理')
    .setDescription('design by xzz2021 <a>404 not found</a>')
    .setVersion('1.0')
    .addBearerAuth({
      description: 'Please enter token:',
      name: 'Authorization',
      bearerFormat: 'Bearer',
      scheme: 'Bearer',
      type: 'http',
      in: 'Header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
}
