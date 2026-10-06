/**
 * app.controller.ts - демо-контроллер из шаблона Nest.
 * Отвечает на GET http://localhost:8000/ строкой "Hello World!".
 * Нужен только для проверки, что сервер жив. Можно спокойно удалить позже.
 */
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// @Controller() без аргумента - маршруты начинаются от корня "/"
@Controller()
export class AppController {
  // Dependency Injection: Nest сам создаёт AppService и передаёт сюда
  constructor(private readonly appService: AppService) {}

  // GET /
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
