import { NestFactory } from '@nestjs/core';
import { IndexModule } from './modules/index.module';

(async () => {
  const app = await NestFactory.create(IndexModule);
  app.enableCors();
  await app.listen(3000);
})();
