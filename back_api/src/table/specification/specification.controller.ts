import { Controller, Get, Post, Body } from '@nestjs/common';
import { SpecificationService } from './specification.service';
import { CreateSpecificationDto, DeleteDto, UpsertItemDto, UpsertSpecificationDto } from './dto/specification.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('specification')
@ApiTags('规格')
export class SpecificationController {
  constructor(private readonly specificationService: SpecificationService) {}

  @Post()
  create(@Body() createSpecificationDto: CreateSpecificationDto) {
    return this.specificationService.create(createSpecificationDto);
  }

  @Get('list')
  async findAll() {
    return await this.specificationService.findAll();
  }

  @Post('upsert')
  @ApiOperation({ summary: '创建或插入规格' })
  upsertSpecification(@Body() upsertData: UpsertSpecificationDto) {
    return this.specificationService.UpsertSpecification(upsertData);
  }

  @Post('upsert_item')
  @ApiOperation({ summary: '创建或插入规格项' })
  upsertSpecificationItem(@Body() upsertData: UpsertItemDto) {
    return this.specificationService.UpsertItem(upsertData);
  }

  @Post('delete')
  @ApiOperation({ summary: '删除规格' })
  delete(@Body() data: DeleteDto) {
    return this.specificationService.delete(data);
  }

  @Post('delete_item')
  @ApiOperation({ summary: '删除规格项' })
  deleteItem(@Body() data: DeleteDto) {
    return this.specificationService.deleteItem(data);
  }
}
