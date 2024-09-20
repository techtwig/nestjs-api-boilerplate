import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as process from 'node:process';
import { AppEnvironment, ConfigKey } from '../config/app-config/app-config';

interface ResponseObject {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string;
  dev_note?: string;
  errors?: any;
}

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const responseObject: ResponseObject = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: 'Internal server error',
    };

    responseObject.dev_note =
      exception?.stack?.toString() || exception.toString();

    const cacheControlHeader: any = response.getHeader('Cache-Control');
    if (cacheControlHeader) {
      response.set('Cache-Control', 'no-cache');
    }

    if (exception?.message) {
      responseObject.message = exception?.message;
    }

    if (exception?.status) {
      responseObject.statusCode = exception.status;
    }

    if (process.env[ConfigKey.APP_ENV] === AppEnvironment.PROD) {
      delete responseObject['dev_note'];
    }

    return response.status(responseObject.statusCode).json(responseObject);
  }
}
