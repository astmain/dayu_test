import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// 过滤前端传递来的多余信息   updatedAt CreatedAt   无效??????????
//  字段校验的管道中 已经做了 数据白名单 处理
@Injectable()
export class FilterKeyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 这里的逻辑会在前置过滤和后置过滤分别执行  共 执行2次
    const frontData = context.switchToHttp().getRequest()?.body;
    if (frontData) {
      delete frontData?.updatedAt;
      delete frontData?.createdAt;
      delete frontData?.deletedAt;
      context.switchToHttp().getRequest().body = frontData;
    }
    return next.handle().pipe(
      //  map是对返回数据进行处理   相当于后置过滤
      map((data: any) => {
        return data;
      }),
    );
  }
}
