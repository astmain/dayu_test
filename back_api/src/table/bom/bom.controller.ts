import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { BomService } from './bom.service';
import { ApiOperation } from '@nestjs/swagger';
import { IQueryParams } from '@/processor/utils/queryBuilder';
import { DeleteBomDto, UpsertBomDto } from './dto/bom.dto';

@Controller('bom')
export class BomController {
  constructor(private readonly bomService: BomService) {}

  @Post('upsert')
  @ApiOperation({ summary: '创建或插入BOM' })
  upsertBom(@Body() upsertData: UpsertBomDto) {
    return this.bomService.UpsertBom(upsertData);
  }

  @Post('delete')
  @ApiOperation({ summary: '删除BOM' })
  delete(@Body() obj: DeleteBomDto) {
    return this.bomService.delete(obj.ids);
  }

  @Get('list')
  @ApiOperation({ summary: '获取BOM列表' })
  findBy(@Query() joinQueryParams: IQueryParams) {
    return this.bomService.findBy(joinQueryParams);
  }
}
