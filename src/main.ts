import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalErrorHandler } from './errors/exceptionHandler';
import { PORT } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // to validate by DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  //global error handler
  app.useGlobalFilters(new GlobalErrorHandler());

  await app.listen(PORT ?? 3000);
  console.log(`process running at PORT: ${PORT ?? 3000}`);
}
bootstrap();
