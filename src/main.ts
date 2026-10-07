/**
 * main.ts - ТОЧКА ВХОДА приложения (аналог index.tsx / main.ts на фронте).
 * Именно этот файл запускается командой `npm run start:dev`.
 * Здесь мы создаём Nest-приложение и говорим, на каком порту слушать запросы.
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Создаём приложение, передав корневой модуль (от него Nest строит всё дерево)
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Запускаем HTTP-сервер. Порт берём из переменной окружения PORT, иначе 8000.
  // Позже сюда же добавим глобальные штуки: ValidationPipe, Swagger и т.п.
  await app.listen(process.env.PORT ?? 8000);
}
void bootstrap();
