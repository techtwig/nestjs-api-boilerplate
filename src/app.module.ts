import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { appConfig } from './core/config/app-config/app-config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(appConfig)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
