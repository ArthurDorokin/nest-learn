/**
 * app.module.ts - КОРНЕВОЙ МОДУЛЬ. Как <App /> на фронте: в него подключаются все остальные части.
 * Если модуль не подключён сюда (прямо или через другой модуль), Nest о нём не узнает.
 */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';

@Module({
  // imports - другие модули, которые подключаем (наша фича "задачи")
  imports: [TasksModule],
  // controllers - классы, принимающие HTTP-запросы этого модуля
  controllers: [AppController],
  // providers - сервисы, которые можно внедрять через конструктор (DI)
  providers: [AppService],
})
export class AppModule {}
