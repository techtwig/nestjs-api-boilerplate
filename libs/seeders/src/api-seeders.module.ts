import { Module } from '@nestjs/common';
import 'winston-daily-rotate-file';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiSeederCommand } from './api-seeder.command';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmConfigService } from '../../../src/core/config/typeorm/typeorm-config.service';
import { validateConfig } from '../../../src/core/config/app-config/app-config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateConfig,
    }),
    TypeOrmModule.forRootAsync({
      imports: [],
      useClass: TypeOrmConfigService,
    }),
  ],
  controllers: [],
  providers: [ApiSeederCommand],
})
export class ApiSeedersModule {}
