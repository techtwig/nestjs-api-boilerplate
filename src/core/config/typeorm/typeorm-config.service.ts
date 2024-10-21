import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  @Inject()
  private configService: ConfigService;

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.configService.get<'mysql'>('DB_VENDOR'),
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_DATABASE'),
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    };
  }
}
