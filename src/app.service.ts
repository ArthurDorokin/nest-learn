/**
 * app.service.ts - демо-сервис из шаблона Nest. Просто возвращает строку.
 * Показывает идею: логика живёт в сервисе, а контроллер только вызывает её.
 */
import { Injectable } from '@nestjs/common';

// @Injectable() - пометка "этот класс можно внедрять в другие через конструктор"
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
