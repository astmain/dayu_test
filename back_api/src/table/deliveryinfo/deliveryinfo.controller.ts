import { Controller, Get, Post, Body } from '@nestjs/common';
import { DeliveryinfoService } from './deliveryinfo.service';
import { UpsertItemDto } from './dto/deliveryinfo.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('deliveryinfo')
export class DeliveryinfoController {
  constructor(private readonly deliveryinfoService: DeliveryinfoService) {}

  @Post()
  create(@Body() createDeliveryinfoDto: any) {
    return this.deliveryinfoService.create(createDeliveryinfoDto);
  }

  @Get('list')
  @ApiOperation({ summary: '获取交期列表' })
  findAll() {
    return this.deliveryinfoService.findAll();
  }

  @Post('upsert')
  @ApiOperation({ summary: '创建或更新交期' })
  upsert(@Body() upsertData: UpsertItemDto) {
    console.log('🚀 ~ DeliveryinfoController ~ upsert ~ upsertData:', upsertData);
    return this.deliveryinfoService.upsert(upsertData);
  }
}
