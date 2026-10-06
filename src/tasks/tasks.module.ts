/**
 * tasks.module.ts - МОДУЛЬ ФИЧИ "задачи".
 * Собирает в одну коробку всё, что относится к задачам: контроллер + сервис.
 * Подключается в AppModule через imports.
 */
import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';

@Module({
  controllers: [TasksController], // кто принимает запросы /tasks
  providers: [TasksService], // что можно внедрять (логика задач)
})
export class TasksModule {}
