import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { appConfig } from './core/config/app-config/app-config';
import { ConfigModule } from '@nestjs/config';
import { GlobalModule } from './modules/global-module/global.module';
import { TodoModule } from './modules/todo/todo.module';

@Module({
  imports: [ConfigModule.forRoot(appConfig), GlobalModule, TodoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
