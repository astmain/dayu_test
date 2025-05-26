import { IsBooleanWithTransform, IsIdNotEqualToParentIdConstraint } from '@/processor/pipe/validater';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Validate } from 'class-validator';

export class Department {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: Boolean })
  status: boolean = true;

  @ApiPropertyOptional({ type: String })
  remark?: string;

  @ApiProperty({ type: Boolean })
  isDeleted: boolean;

  @ApiPropertyOptional({ type: Number })
  parentId?: number;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiPropertyOptional({ type: Date })
  deletedAt?: Date;

  @ApiPropertyOptional({ type: () => Department })
  parent?: Department;

  @ApiProperty({ isArray: true, type: () => Department })
  children: Department[];
}

export class CreateDepartmentDto {
  @ApiProperty({ type: Number })
  @IsOptional()
  parentId?: number;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: Boolean })
  @IsOptional()
  status?: boolean;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  remark?: string;
}

export class UpdateDepartmentDto {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  id: number;

  /* 

  //  两者选其一  必有一项

  @ApiProperty({ type: Number })
  @ValidateIf((object) => !object.name)   //    要么有name  要么有id
  @ValidateIf((object, value) => value !== null)
  id: number;

  @ApiProperty({ type: String })
  @ValidateIf((object) => !object.id)
  name: string;


  @IsString()
  @IsIn(['can', 'cannot'])  // 限定 值的  范围
  test: 'can' | 'cannot';
*/
  @ApiProperty({ type: Number })
  @IsOptional()
  parentId?: number;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @MaxLength(10, { message: '部门名称不能超过10个字符' })
  name: string;

  @ApiProperty({ type: Boolean })
  @IsOptional()
  status: boolean;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  remark: string | null;

  @Validate(IsIdNotEqualToParentIdConstraint)
  checkIdsNotEqual: boolean; // 这个字段是为了触发自定义验证器，可以省略其值
}

export class DeleteDepartmentDto {
  // 限定是number array
  @ApiProperty({ isArray: true })
  @IsArray()
  @IsNumber({}, { each: true, message: 'ids 的每个值必须是一个符合指定约束的数字' })
  ids: number[];
}

export class ListParamsDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: Boolean })
  @IsOptional()
  @IsBooleanWithTransform()
  status?: boolean;
}
