import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 없는 속성은 자동으로 제거
      forbidNonWhitelisted: true, // DTO에 없는 속성이 들어오면 에러 발생
      transform: true, // 타입을 자동으로 변환
    }),
  );

  app.enableCors({
    // 운영 환경(production)이면 특정 도메인만 허용, 개발 환경이면 모두 허용(true)
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://a.com', 'https://b.com']
        : true,
    credentials: true, // 쿠키/인증 헤더 전달 허용
  });

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
