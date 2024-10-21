import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GlobalModule } from './modules/global-module/global.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './core/config/typeorm/typeorm-config.service';
import { validateConfig } from './core/config/app-config/app-config';
import { AuthModule } from './modules/auth-module/auth.module';
import { TodoModule } from './modules/todo/todo.module';

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
    GlobalModule,
    AuthModule,
    TodoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
