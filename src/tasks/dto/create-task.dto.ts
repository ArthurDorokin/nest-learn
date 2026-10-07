/**
 * create-task.dto.ts - DTO для создания задачи (POST /tasks).
 * Описывает, ЧТО клиент имеет право прислать в теле запроса.
 * Заметь: тут нет id и done - их ставит сервер, а не клиент.
 * Декораторы class-validator проверяют данные; работают благодаря ValidationPipe в main.ts.
 * Неверные данные отвергаются с ответом 400 ещё до того, как дойдут до сервиса.
 * Аналог типа payload'а запроса на фронте, только с реальной проверкой в рантайме.
 */
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  // обязательное поле: должна быть непустая строка
  @IsString()
  @IsNotEmpty()
  title: string;

  // необязательное: если поля нет - проверки пропускаются, если есть - должна быть строка
  // (@IsOptional ставим выше остальных; "?" влияет только на TypeScript, не на валидацию)
  @IsOptional()
  @IsString()
  description?: string;
}
