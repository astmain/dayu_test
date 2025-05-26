import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

enum MaterialProcess {
  LIGHT_CURE = 'LIGHT_CURE', // 光固化
  CUT = 'CUT', // 切割
  DRILL = 'DRILL', // 钻孔
  OTHER = 'OTHER', // 其他
}

enum MaterialType {
  //  光敏树脂 高分子粉末  金属粉末  线材  陶瓷   尼龙
  RESIN = 'RESIN', // 光敏树脂
  POLYMER_POWDER = 'POLYMER_POWDER', // 高分子粉末
  METAL_POWDER = 'METAL_POWDER', // 金属粉末
  WIRE = 'WIRE', // 线材
  CERAMIC = 'CERAMIC', // 陶瓷
  NYLON = 'NYLON', // 尼龙
  OTHER = 'OTHER', // 其他
}

export class CreateMaterialDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  start_price: number;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  process: MaterialProcess;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  property: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  density: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  structural_strength: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  shrinkage_rate: number;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  advantages: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  disadvantages: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  temperature_resistance: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  type: MaterialType;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  @IsOptional()
  is_default?: boolean;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateMaterialDto extends PartialType(CreateMaterialDto) {
  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  id: number;
}

export class DeleteMaterialDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  id: number;
}

// 添加图片 或者 删除图片
export class AddOrDeleteMaterialImgDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  img_url: string;
}
