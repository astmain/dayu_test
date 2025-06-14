import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class dto_save {
  @ApiProperty({ type: Number, description: '地址数据库id字段可选参数', example: 0 })
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiProperty({ type: String, description: '地址类型', example: 'home' })
  @IsString({ each: true })
  @IsNotEmpty()
  address_tag: string;

  @ApiProperty({ type: String, description: '联系人', example: '小许' })
  @IsString({ each: true })
  name: string;

  @ApiProperty({ type: String, description: '中国区域省市区', example: '15160315110' })
  @IsString({ each: true })
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ type: [String], description: '中国区域省市区', example: ['福建省', '泉州市', '鲤城区'] })
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  region: string[];

  @ApiProperty({ type: String, description: '详细地址街道', example: '五星街72号' })
  @IsNotEmpty()
  @IsString()
  street: string;
}
