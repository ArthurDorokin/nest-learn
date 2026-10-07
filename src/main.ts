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

  // Глобальная валидация: все DTO с декораторами class-validator (@IsString и т.п.)
  // проверяются автоматически для ВСЕХ эндпоинтов. Без этого декораторы ничего не делают.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // выкинуть из тела поля, которых нет в DTO
      forbidNonWhitelisted: true, // а если такие поля пришли - ответить 400, а не молча выкинуть
      transform: true, // превращать JSON в экземпляр класса DTO (и типы вроде "5" -> 5)
    }),
  );

  // Запускаем HTTP-сервер. Порт берём из переменной окружения PORT, иначе 8000.
  // Позже сюда же можно добавить Swagger и т.п.
  await app.listen(process.env.PORT ?? 8000);
}
void bootstrap();
