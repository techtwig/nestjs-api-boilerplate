import { Controller, Get, Inject, Logger, LoggerService } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(Logger)
    private readonly logger: LoggerService,
  ) {}

  @Get()
  getHello(): string {
    this.logger.debug('Getting Hello');
    return this.appService.getHello();
  }
}
