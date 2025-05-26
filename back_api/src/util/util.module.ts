import { Module } from '@nestjs/common';
import { UtilService } from './util.service';
import { UtilController } from './util.controller';
import { WsModule } from '@/ws/ws.module';
@Module({
  imports: [WsModule],
  controllers: [UtilController],

  //  模块未引用  但想注入使用service， 在module入口provider 进行 引入声明即可
  // 或者将此模块 设置为全局模块
  providers: [UtilService],
})
export class UtilModule {}
