/**
 * app.module.ts - КОРНЕВОЙ МОДУЛЬ. Как <App /> на фронте: в него подключаются все остальные части.
 * Если модуль не подключён сюда (прямо или через другой модуль), Nest о нём не узнает.
 */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  // imports - другие модули, которые подключаем
  imports: [
    // Подключение к PostgreSQL (параметры совпадают с docker-compose.yml)
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'nest',
      password: 'nest',
      database: 'nest_learn',
      autoLoadEntities: true, // подхватывать сущности, зарегистрированные через forFeature
      synchronize: true, // сам создаёт/меняет таблицы под сущности (только для учёбы!)
    }),
    // наша фича "задачи"
    TasksModule,
  ],
  // controllers - классы, принимающие HTTP-запросы этого модуля
  controllers: [AppController],
  // providers - сервисы, которые можно внедрять через конструктор (DI)
  providers: [AppService],
})
export class AppModule {}
