import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { NODE_ENV } from 'src/config';

@Catch()
export class GlobalErrorHandler implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected error occurred';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        status = HttpStatus.CONFLICT;
        message = `Duplicate value for unique field: ${exception.meta?.target?.[0]}`;
      }
      if (exception.code === 'P2025') {
        status = HttpStatus.BAD_REQUEST;
        message = `User Not found`;
      }
      // Handle more Prisma error codes if needed
    }

    console.log('exception.message', exception.message);

    response.status(status).json({
      status: 'failed',
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
      details:
        NODE_ENV === 'DEVELOPMENT'
          ? { message: exception.message, exception: exception }
          : undefined,
    });
  }
}
