import { BOMCategory } from '@/prisma/client/postgresql';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class BomDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  code: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: String })
  @IsOptional()
  color: string;

  @ApiProperty({ type: Number })
  @IsOptional()
  sort: number;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  unit: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  category: BOMCategory;

  @ApiProperty({ type: Number })
  @IsOptional()
  count?: number;

  @ApiProperty({ type: Number })
  @IsOptional()
  unit_price?: number;

  @ApiProperty({ type: Number })
  @IsOptional()
  total_price?: number;

  @ApiProperty({ type: String })
  @IsOptional()
  description?: string;
}

export class UpsertBomDto extends BomDto {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  id: number;
}

export class DeleteBomDto {
  // 限定是number array
  @ApiProperty({ isArray: true })
  @IsArray()
  @IsNumber({}, { each: true, message: 'ids 的每个值必须是一个符合指定约束的数字' })
  ids: number[];
}
