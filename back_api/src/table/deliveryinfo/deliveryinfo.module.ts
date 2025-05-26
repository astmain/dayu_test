import { Module } from '@nestjs/common';
import { DeliveryinfoService } from './deliveryinfo.service';
import { DeliveryinfoController } from './deliveryinfo.controller';

@Module({
  controllers: [DeliveryinfoController],
  providers: [DeliveryinfoService],
})
export class DeliveryinfoModule {}
