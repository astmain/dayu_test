import { Controller, Body, Get, Query, Delete } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { IQueryParams } from '../processor/utils/queryBuilder';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('日志')
@Controller('logger')
export class LoggerController {
  constructor(private readonly loggerService: LoggerService) {}

  @Get('getList')
  @ApiOperation({ summary: '获取日志列表' })
  logList(@Query() joinQueryParams: IQueryParams) {
    //  启用缓存后   相同请求 会直接跳过这里的控制器
    // console.log('xzz2021: UtilController -> logList -> joinQueryParams', joinQueryParams);
    return this.loggerService.getLogList(joinQueryParams);
  }

  @Delete('delete')
  @ApiOperation({ summary: '删除日志' })
  delete(@Body() data: { ids: number[] }) {
    return this.loggerService.deleteLog(data.ids);
  }
}
