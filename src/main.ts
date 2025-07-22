import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import * as dotenv from 'dotenv';
import { ZodFilter } from './shared/validation/zod-filter';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());
  app.use(morgan('dev'));
  app.useGlobalFilters(new ZodFilter());

  app.useStaticAssets(join(__dirname, '..', 'public/uploads'), {
    prefix: '/static/',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();