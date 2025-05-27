import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateDepartmentDto, DeleteDepartmentDto, ListParamsDto, UpdateDepartmentDto } from './dto/department.dto';
import { TransformKeyPipe } from 'src/processor/pipe/validater';
import { IQueryParams } from '@/processor/utils/queryBuilder';
import { Public } from '@/processor/decorator/public';
import {OutputDto} from "@/table/department/dto/output.dto";
// import { Action } from '@/processor/enum/action';
// import { RequiredPermission } from '@/processor/decorator/permission';

@ApiTags('部门')
@Controller('department')
// @RequiredPermission('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post('add')
  @ApiOperation({ summary: '创建部门' })
  create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentService.create(createDepartmentDto);
  }

  // @RequiredPermission('department_edit'.toLocaleUpperCase())
  @Public()
  @Post('update')
  @ApiOperation({ summary: '更新部门' })
  // @RequiredPermission(Action.UPDATE)
  update(@Body(new TransformKeyPipe('remark')) updateDepartmentDto: UpdateDepartmentDto) {
    return this.departmentService.update(updateDepartmentDto);
  }

  @Post('delete')
  @ApiOperation({ summary: '删除部门' })
  delete(@Body() obj: DeleteDepartmentDto) {
    return this.departmentService.batchRemove(obj.ids);
  }

  @Get('list')
  @ApiOperation({ summary: '获取部门列表' })
  findBy(@Query() joinQueryParams: IQueryParams) {
    return this.departmentService.findBy(joinQueryParams);
  }

  @Public()
  @Get('list2')
  @ApiOperation({ summary: '获取部门列表' })
  findBy2(@Query() params: ListParamsDto) {
    return { params };
  }

  @Get('alllist')
  @ApiOperation({ summary: '获取所有部门列表' })
  findAll() {
    return this.departmentService.findAll();
  }
}
