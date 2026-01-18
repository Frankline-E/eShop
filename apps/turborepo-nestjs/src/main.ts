import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 6001);
}

void bootstrap();

// 🟡 Alternative Fixes (When appropriate)
// 1️⃣ Handle errors explicitly (good for production)
// bootstrap().catch((err) => {
//   console.error('NestJS failed to start', err);
//   process.exit(1);
// });
