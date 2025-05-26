import { IsIdNotEqualToParentIdConstraint } from '@/processor/pipe/validater';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, MaxLength, Validate } from 'class-validator';
export class CreateSpecificationDto {
  name: string;
  is_tag: boolean;
  parentId: number;
}

export class UpsertSpecificationDto {
  @ApiProperty({ type: Number })
  @IsOptional()
  id?: number;

  @ApiProperty({ type: Number })
  @IsOptional()
  parentId?: number;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @MaxLength(10, { message: '规格名称不能超过10个字符' })
  name: string;

  @ApiProperty({ type: Boolean })
  @IsOptional()
  is_tag?: boolean;

  @Validate(IsIdNotEqualToParentIdConstraint)
  checkIdsNotEqual: boolean; // 这个字段是为了触发自定义验证器，可以省略其值
}

export class UpsertItemDto {
  @ApiProperty({ type: Number })
  @IsOptional()
  id?: number;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @MaxLength(10, { message: '规格名称不能超过10个字符' })
  name: string;

  @ApiProperty({ type: Boolean })
  @IsOptional()
  is_default?: boolean;

  @ApiProperty({ type: Number })
  @IsOptional()
  price?: number;

  @ApiProperty({ type: Number })
  @IsOptional()
  start_price?: number;

  @ApiProperty({ type: Number })
  @IsOptional()
  specificationId?: number;
}

export class DeleteDto {
  // 限定是number array
  @ApiProperty({ isArray: true })
  @IsArray()
  @IsNumber({}, { each: true, message: 'ids 的每个值必须是一个符合指定约束的数字' })
  ids: number[];
}
