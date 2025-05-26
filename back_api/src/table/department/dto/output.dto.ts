import { Exclude } from 'class-transformer';
import { IsNumber } from 'class-validator';

//  定义对 出参 的校验
export class OutputDto {
  @IsNumber()
  id: number;

  @Exclude()
  name: string;

  // @Expose({ name: 'sqldbname' })  // 将数据库查询出的字段key名改为任意你项返回的key  returnName
  // returnName: any

  constructor(partial: Partial<OutputDto>) {
    Object.assign(this, partial);
  }
}
