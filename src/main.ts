import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigKey } from './core/config/app-config/app-config';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WinstonModule } from 'nest-winston';
import winstonLogger from './core/libs/winston/winston-logger';
import { AllExceptionFilter } from './core/filters/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger({
      instance: winstonLogger,
    }),
  });

  const configService: ConfigService = app.get(ConfigService);

  app.useGlobalFilters(new AllExceptionFilter());

  await app.listen(configService.get<number>(ConfigKey.PORT));

  console.log(`App running on ${await app.getUrl()}`);
}

bootstrap();
