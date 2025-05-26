import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { plainToInstance, ClassConstructor } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// 序列化拦截器   将此拦截器 提供给 装饰器 使用  简化代码
@Injectable()
export class SerializeInterceptor<T> implements NestInterceptor {
  constructor(private dto: ClassConstructor<T>) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data =>
        plainToInstance(this.dto, data, {
          // 设为true 将会对出参进行严格的控制 以及类型转换
          excludeExtraneousValues: true,
          // 设为true 将会对出参进行类型转换
          enableImplicitConversion: true,
        }),
      ),
    );
  }
}
