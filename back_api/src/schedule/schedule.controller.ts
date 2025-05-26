import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('定时任务')
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  @ApiOperation({ summary: '创建定时任务' })
  create(@Body() createScheduleDto: any) {
    return this.scheduleService.create(createScheduleDto);
  }

  @Get()
  findAll() {
    return this.scheduleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateScheduleDto: any) {
    return this.scheduleService.update(+id, updateScheduleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduleService.remove(+id);
  }
}
