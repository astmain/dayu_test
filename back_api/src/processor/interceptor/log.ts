// request-log.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { LoggerService } from '@/logger/logger.service';
import { extractIP } from '@/processor/utils/string';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@/prisma/client/postgresql/runtime/library';
import { prismaErrorMsg } from '@/processor/utils/prismaError';
//  请求拦截器  提供日志记录

interface JwtUser {
  id: number;
  username: string;
  phone: string;
}

// Extend Express Request to include user
interface RequestWithUser extends Request {
  user?: JwtUser;
}

@Injectable()
export class RequestLogInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<RequestWithUser>();
    const response = ctx.getResponse<Response>();
    const { method, url, ip = '未知', headers, body } = request;
    const userAgent = headers['user-agent'] || '';
    const userPhone = request['user']?.phone || body?.phone || '';

    //  登录接口要做单独处理 ,  因为此时还没有用户身份  只能通过request.body 获取用户信息  假定登陆者

    //  获取当前上下文
    const start = Date.now();
    if (url.includes('utils/log/') || url.includes('utils/online/user')) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data: any) => {
        // 如果返回的是文件流 则不包装
        if (data instanceof ReadableStream) {
          return data;
        }
        // 自定义包装返回的数据
        if (typeof data === 'object') {
          this.loggerService.createInfoLog({ message: data?.message, context: '数据响应' });

          const aaa = {
            ...data,
            code: data?.code || 200,
            timestamp: new Date().toISOString(), // 添加时间戳
          };
          return aaa;
        }
        return { message: data, timestamp: new Date().toISOString() };
      }),
      //  tap 是rxjs 的 操作符 用于在流中进行操作  类似于finally
      tap((data: any) => {
        // 如果返回的是文件流 则不记录日志
        if (data instanceof ReadableStream) {
          return;
        }
        const statusCode = data.code || response.statusCode;

        // 构建日志数据
        const logData = {
          resCode: statusCode,
          method,
          url,
          ip: extractIP(ip),
          userAgent: userAgent,
          // ...parseUserAgent(userAgent),
          feedbackMsg: data.message || '',
          duration: Date.now() - start,
        };

        // 将日志写入数据库
        // this.logger.error(logData);

        void this.loggerService.createRequestLog(logData, userPhone as string);
      }),

      // 错误请求的日志记录   //  如果上层方法没有使用try catch 包裹 则错误会走到这里
      catchError(async (err: any) => {
        // const duration = Date.now() - start; // 计算请求耗时
        let feedbackMsg = err?.message || '网络异常';
        console.log('🚀 ~ RequestLogInterceptor ~ catchError ~ feedbackMsg:', feedbackMsg);
        const isPrismaValidationErr = err instanceof PrismaClientValidationError;
        if (isPrismaValidationErr) {
          const match = err.message.match(/Argument `[^`]+` is missing\./) || ['---'];

          feedbackMsg = '数据字段验证错误: ' + match[0];
        }
        const isPrismaClientErr = err instanceof PrismaClientKnownRequestError;
        if (isPrismaClientErr) {
          feedbackMsg = prismaErrorMsg(err.code);
        }

        const logData = {
          method,
          url,
          ip: extractIP(ip),
          resCode: err?.status || 400,
          userAgent: userAgent,
          // ...parseUserAgent(userAgent),
          feedbackMsg, // 错误信息
          duration: Date.now() - start,
          //   errorStack: err.stack || '', // 可选：记录错误堆栈（调试用）
        };

        //  PrismaClientKnownRequestError  必须是要操作的client实例

        //  一个是log写入本地文件  一个是写入数据库

        await this.loggerService.createRequestLog(
          logData,
          userPhone as string,
          isPrismaClientErr && feedbackMsg == '数据库服务异常',
        ); // 写入数据库

        // err.stack   错误堆栈信息
        const stackName = err.stack.split(':')[0];
        this.loggerService.createErrorLog({
          message: feedbackMsg,
          error: logData,
          context: stackName,
        });

        // console.log('🚀 ~ RequestLogInterceptor ~ catchError ~ err.stack:', err.stack);

        return {
          code: err?.status || 400,
          message: feedbackMsg,
          meta: err?.meta,
        };

        // 将错误继续抛出，以便 NestJS 继续处理异常
        // return throwError(() => err);
        // return err?.response;
      }),
    );
  }
}
