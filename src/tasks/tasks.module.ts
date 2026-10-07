/**
 * tasks.module.ts - МОДУЛЬ ФИЧИ "задачи".
 * Собирает в одну коробку всё, что относится к задачам: контроллер + сервис + доступ к таблице.
 * Подключается в AppModule через imports.
 */
import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';

@Module({
  // forFeature регистрирует сущность Task в этом модуле: благодаря этому сервис может
  // получить репозиторий (@InjectRepository(Task)) для работы с таблицей task.
  // Заодно autoLoadEntities в AppModule узнаёт, что такая сущность есть.
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [TasksController], // кто принимает запросы /tasks
  providers: [TasksService], // что можно внедрять (логика задач)
})
export class TasksModule {}
