import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalErrorHandler } from './errors/exceptionHandler';

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

  await app.listen(process.env.PORT ?? 3000);
  console.log(`process running at PORT: ${process.env.PORT ?? 3000}`);
}
bootstrap();
