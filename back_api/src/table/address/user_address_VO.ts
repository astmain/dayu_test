import { Exclude } from 'class-transformer';
import { IsNumber } from 'class-validator';

//  定义对 出参 的校验
export class list {
  @IsNumber()
  id: number;

  @Exclude()
  name: string;
}
