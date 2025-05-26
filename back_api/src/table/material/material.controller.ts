import { Controller, Get, Post, Body } from '@nestjs/common';
import { MaterialService } from './material.service';
import { CreateMaterialDto, DeleteMaterialDto, UpdateMaterialDto } from './dto/material.dto';
import { ApiOperation } from '@nestjs/swagger';
import { TransformKeyPipe } from '@/processor/pipe/validater';
@Controller('material')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  //  前台部分

  //  后台部分
  @Get('list')
  findAll() {
    return this.materialService.findAll();
  }

  @Post('add')
  @ApiOperation({ summary: '创建材料' })
  add(@Body(new TransformKeyPipe('description')) createMaterialDto: CreateMaterialDto) {
    return this.materialService.add(createMaterialDto);
  }

  @Post('update')
  @ApiOperation({ summary: '更新材料' })
  update(@Body() createMaterialDto: UpdateMaterialDto) {
    return this.materialService.update(createMaterialDto);
  }

  @Post('delete')
  @ApiOperation({ summary: '删除材料' })
  delete(@Body() data: DeleteMaterialDto) {
    return this.materialService.delete(data.id);
  }
}
