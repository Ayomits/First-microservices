import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createConfig } from './constants';

const config = createConfig(`user-service`)

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, config);
  app.listen().then(() => console.log(`UserService start`));
}
bootstrap();
