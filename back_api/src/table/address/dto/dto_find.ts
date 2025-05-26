import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class dto_find {
  @ApiProperty({ type: Number, description: '用户id', example: 0 })
  @IsOptional()
  @IsNumber()
  id?: number;
}
