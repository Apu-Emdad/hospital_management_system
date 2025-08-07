import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

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
      // Handle more Prisma error codes if needed
    }

    console.log('exception.message', exception.message);

    response.status(status).json({
      status: 'failed',
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
      details:
        process.env.NODE_ENV === 'DEVELOPMENT'
          ? { message: exception.message, exception: exception }
          : undefined,
    });
  }
}
