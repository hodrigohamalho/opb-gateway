import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(4000);

  let port = process.env.SERVER_PORT || 4000;
  await app.listen(port);
}
bootstrap();
