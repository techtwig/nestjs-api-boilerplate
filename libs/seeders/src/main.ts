import { CommandFactory } from 'nest-commander';
import { ApiSeedersModule } from './api-seeders.module';

async function bootstrap() {
  await CommandFactory.run(ApiSeedersModule, ['warn', 'error']);
}
bootstrap();
