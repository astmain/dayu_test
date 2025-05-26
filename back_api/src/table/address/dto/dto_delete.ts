import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class dto_delete {
  @ApiProperty({ type: Number, description: '地址数据库id字段', example: 0 })
  @IsNumber()
  id?: number;
}
