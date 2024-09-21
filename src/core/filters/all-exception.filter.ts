import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as process from 'node:process';
import { AppEnvironment, ConfigKey } from '../config/app-config/app-config';

interface ResponseObject {
  statusCode: number;
  path: string;
  message: string;
  stack?: string;
  errors?: any;
}

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException | Error, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const cacheControlHeader: any = response.getHeader('Cache-Control');
    if (cacheControlHeader) {
      response.set('Cache-Control', 'no-cache');
    }

    const responseObject: ResponseObject = {
      message: this.getErrorMessage(exception),
      statusCode: this.getErrorCode(exception),
      path: request.url,
    };

    if (exception instanceof BadRequestException) {
      const response: any = exception.getResponse();
      if (response?.message) {
        responseObject['errors'] = response.message;
      }
    }

    responseObject.stack = exception?.stack?.toString() || exception.toString();

    if (process.env[ConfigKey.APP_ENV] === AppEnvironment.PROD) {
      delete responseObject['stack'];
    }

    return response.status(responseObject.statusCode).json(responseObject);
  }

  private getErrorMessage(exception: HttpException | Error) {
    if (exception instanceof HttpException) {
      if (exception instanceof BadRequestException) {
        const response: any = exception.getResponse();
        if (response?.error) {
          return response.error;
        }
      } else if (typeof exception.getResponse() === 'string') {
        return exception.message;
      }
    }

    if (exception instanceof Error) {
      return exception.message;
    }

    return 'Internal server error';
  }

  private getErrorCode(exception: HttpException | Error) {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
