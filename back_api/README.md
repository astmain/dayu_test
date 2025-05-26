### 常见问题

1. 如果`npx prisma push`出现警告会重置数据库, 一定要取消; 如果是字段冲突, 可以尝试删除冲突表, 再重新生成, 至少不会影响整个数据库;

#### 开发历程

1. 依赖路线

   > 常规防攻击: `helmet`  
   > ORM平台prisma: `@prisma/client` `prisma`  
   > 缓存功能: `@nestjs/cache-manager` `cache-manager`  
   > redis缓存: `@keyv/redis` `keyv` `cacheable`  
   > websocket通信: `@nestjs/websockets` `@nestjs/platform-socket.io` `socket.io`  
   > 静态资源托管及文件上传: `@nestjs/serve-static` `@types/multer` `iconv-lite`  
   > 安全速率限制: ` @nestjs/throttler`  
   > JWT认证: `@nestjs/passport` `@nestjs/jwt` `passport-jwt` `bcryptjs`  
   > HTTP请求:`@nestjs/axios` `axios`  
   > 阿里云短信:`@alicloud/dysmsapi20170525` `@alicloud/openapi-client` `@alicloud/tea-util`  
   > 任务和队列: `@nestjs/schedule` `cron` `@nestjs/bullmq` `bullmq`  
   > 接口文档: `@nestjs/swagger` `basic-auth` `@types/basic-auth`  
   > 环境变量设置: `@nestjs/config` `joi` `cross-env`  
   > 字段转换与校验, DTO自动生成: `class-validator` `class-transformer` `prisma-class-generator`  
   > 系统日志: `winston` `nest-winston` `winston-daily-rotate-file` `winston-transport`  
   > ssh连接远程服务器： `node-ssh`  
   > 邮件服务: `nodemailer`  
   > 微服务熔断: `oppossum`
