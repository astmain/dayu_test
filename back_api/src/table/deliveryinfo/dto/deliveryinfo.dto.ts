import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { IsNumber } from 'class-validator';

export class UpsertItemDto {
  @ApiProperty({ type: Number })
  @IsOptional()
  id?: number;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  duration: number;

  @ApiProperty({ type: Boolean })
  @IsOptional()
  is_default?: boolean;

  @ApiProperty({ type: Boolean })
  @IsOptional()
  active?: boolean;

  @ApiProperty({ type: Number })
  @IsOptional()
  price?: number;

  @ApiProperty({ type: String })
  @IsOptional()
  description?: string;
}

export class DeleteDto {
  // 限定是number array
  @ApiProperty({ isArray: true })
  @IsArray()
  @IsNumber({}, { each: true, message: 'ids 的每个值必须是一个符合指定约束的数字' })
  ids: number[];
}
