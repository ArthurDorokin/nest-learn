# nest-learn

Учебный REST API на **NestJS + TypeScript + PostgreSQL (TypeORM)**: список задач с созданием,
чтением, обновлением и удалением (CRUD), валидацией входных данных и хранением в базе.

## Что умеет

| Метод    | URL          | Что делает                          |
| -------- | ------------ | ----------------------------------- |
| `POST`   | `/tasks`     | создать задачу                      |
| `GET`    | `/tasks`     | получить все задачи                 |
| `GET`    | `/tasks/:id` | получить одну задачу                |
| `PATCH`  | `/tasks/:id` | изменить задачу (любые поля частично) |
| `DELETE` | `/tasks/:id` | удалить задачу                      |

Сервер слушает порт **8000**.

---

## Как запустить этот проект

Нужны: **Node.js 20+**, **Docker**.

```bash
npm install            # поставить зависимости
docker compose up -d   # запустить PostgreSQL в контейнере
npm run start:dev      # запустить сервер с автоперезапуском
```

Проверка: открой http://localhost:8000/tasks - должен прийти `[]`.
Запросы для проверки лежат в файле `requests.http` (в PhpStorm рядом с каждым есть кнопка ▶).

Остановить базу: `docker compose stop`. Данные при этом сохраняются
(они лежат в Docker-томе `pgdata`). Удалить вместе с данными: `docker compose down -v`.

---

## Как сделать такое же приложение с нуля

### 0. Подготовка

```bash
node -v                      # нужен Node.js 20+
docker --version             # нужен Docker
npm i -g @nestjs/cli         # консольная утилита Nest
```

### 1. Создать проект

```bash
mkdir my-app && cd my-app
nest new .
```

Ответы на вопросы установщика: пакетный менеджер **npm**, на вопрос про `@nestjs/observe` - **n**
(это мониторинг для продакшена, для учёбы не нужен), модули - **CJS (CommonJS) with jest**.

Проверь, что всё работает: `npm run start:dev` и открой http://localhost:3000 - будет `Hello World!`.

> Порт можно поменять в `src/main.ts`: `app.listen(process.env.PORT ?? 8000)`.

### 2. Сгенерировать модуль с CRUD

```bash
nest g resource tasks
```

Ответы: транспорт **REST API**, генерировать CRUD entry points - **yes**.

Появится папка `src/tasks` с модулем, контроллером, сервисом, DTO и сущностью,
а в `app.module.ts` модуль подключится сам.

| Файл                         | Зачем                                                              |
| ---------------------------- | ------------------------------------------------------------------ |
| `tasks.module.ts`            | «Коробка» фичи: собирает контроллер, сервис и доступ к таблице     |
| `tasks.controller.ts`        | Маршруты: принять запрос, вызвать сервис, вернуть ответ            |
| `tasks.service.ts`           | Вся логика: найти, создать, изменить, удалить                      |
| `dto/create-task.dto.ts`     | Какие данные клиент может прислать при создании                    |
| `dto/update-task.dto.ts`     | То же при изменении (все поля необязательные)                      |
| `entities/task.entity.ts`    | Как задача хранится в базе (станет таблицей)                       |

### 3. Валидация входных данных

```bash
npm i class-validator class-transformer
```

**а) `src/main.ts`** - включить проверку глобально (до `app.listen`):

```ts
import { ValidationPipe } from '@nestjs/common';

app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true, // выкинуть поля, которых нет в DTO
    forbidNonWhitelisted: true, // а если такие пришли - ответить 400
    transform: true, // превращать JSON в экземпляр DTO
  }),
);
```

**б) `dto/create-task.dto.ts`** - правила на поля:

```ts
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional() // ставить выше остальных
  @IsString()
  description?: string;
}
```

**в) `dto/update-task.dto.ts`** - `PartialType` копирует поля и правила, добавляем `done`:

```ts
import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsBoolean()
  @IsOptional()
  done?: boolean;
}
```

**г) `tasks.controller.ts`** - id из URL превращаем в число (`/tasks/abc` даст 400):

```ts
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  return this.tasksService.findOne(id);
}
```

То же в `update` и `remove`; `ParseIntPipe` импортируется из `@nestjs/common`.

### 4. База данных PostgreSQL в Docker

Создай `docker-compose.yml` в корне:

```yaml
services:
  db:
    image: postgres:16
    restart: unless-stopped
    environment:
      POSTGRES_USER: nest
      POSTGRES_PASSWORD: nest
      POSTGRES_DB: nest_learn
    ports:
      - '5432:5432'
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

```bash
docker compose up -d
docker compose ps        # статус должен быть running
```

### 5. Подключить TypeORM

```bash
npm i @nestjs/typeorm typeorm@^0.3 pg
```

**а) `src/app.module.ts`** - подключение к базе в `imports`:

```ts
import { TypeOrmModule } from '@nestjs/typeorm';

TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'nest',
  password: 'nest',
  database: 'nest_learn',
  autoLoadEntities: true, // подхватывать сущности из forFeature
  synchronize: true, // сам создаёт таблицы по сущностям (ТОЛЬКО для учёбы)
}),
```

**б) `entities/task.entity.ts`** - класс становится таблицей:

```ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn() // автоинкрементный id
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true }) // длинный текст, можно пусто
  description?: string;

  @Column({ default: false })
  done: boolean;
}
```

**в) `tasks.module.ts`** - дать модулю доступ к таблице:

```ts
imports: [TypeOrmModule.forFeature([Task])],
```

**г) `tasks.service.ts`** - вместо массива работаем через репозиторий:

```ts
constructor(
  @InjectRepository(Task)
  private readonly tasksRepository: Repository<Task>,
) {}

create(dto: CreateTaskDto) {
  return this.tasksRepository.save(this.tasksRepository.create(dto));
}
findAll() {
  return this.tasksRepository.find();
}
async findOne(id: number) {
  const task = await this.tasksRepository.findOneBy({ id });
  if (!task) throw new NotFoundException(`Task #${id} not found`);
  return task;
}
async update(id: number, dto: UpdateTaskDto) {
  const task = await this.findOne(id);
  Object.assign(task, dto);
  return this.tasksRepository.save(task);
}
async remove(id: number) {
  await this.tasksRepository.remove(await this.findOne(id));
}
```

Контроллер при этом менять не нужно.

### 6. Проверить

В `requests.http` лежат запросы на все сценарии. Ожидаемые ответы:

| Запрос                                   | Ответ |
| ---------------------------------------- | ----- |
| `POST /tasks` с `{"title": "..."}`       | 201, созданная задача |
| `POST /tasks` с `{}` или `{"title": 123}` | 400   |
| `POST /tasks` с лишним полем             | 400   |
| `GET /tasks/abc`                         | 400   |
| `GET /tasks/99999`                       | 404   |

Главная проверка базы: создай задачу, перезапусти сервер и сделай `GET /tasks` - задача должна остаться.

Посмотреть таблицу глазами: в PhpStorm **Database → + → PostgreSQL** с параметрами
`localhost`, `5432`, пользователь `nest`, пароль `nest`, база `nest_learn`
(при первом подключении нажми **Download** драйвера).

---

## Шпаргалка: что за что отвечает

```
Клиент -> Controller -> Service -> Repository -> PostgreSQL
          (маршрут)     (логика)   (запросы)     (данные)
```

| Понятие          | Простыми словами                                                            |
| ---------------- | --------------------------------------------------------------------------- |
| **Module**       | коробка фичи; Nest узнаёт о приложении, обходя модули                       |
| **Controller**   | принимает HTTP-запрос и отдаёт ответ, логики не содержит                    |
| **Service**      | бизнес-логика; получает зависимости через конструктор (DI)                  |
| **DTO**          | форма данных от клиента + правила проверки                                  |
| **Entity**       | класс, который становится таблицей в базе                                   |
| **Pipe**         | преобразует/проверяет значение перед методом (`ValidationPipe`, `ParseIntPipe`) |
| **Repository**   | готовые методы работы с таблицей (`find`, `save`, `remove`)                 |
| **Dependency Injection** | класс просит нужное в конструкторе, Nest создаёт и подставляет      |

Основные декораторы: `@Module`, `@Controller`, `@Injectable` (роль класса); `@Get`, `@Post`,
`@Patch`, `@Delete` (маршрут); `@Body`, `@Param`, `@Query` (данные запроса);
`@IsString`, `@IsOptional` (валидация); `@Entity`, `@Column`, `@PrimaryGeneratedColumn` (таблица).

---

## Команды

| Команда                     | Что делает                              |
| --------------------------- | --------------------------------------- |
| `npm run start:dev`         | запуск с автоперезапуском               |
| `npm run build`             | сборка                                  |
| `npm run format`            | форматирование Prettier                 |
| `npm run lint`              | проверка линтером                       |
| `npm test`                  | unit-тесты                              |
| `docker compose up -d`      | запустить базу                          |
| `docker compose stop`       | остановить базу (данные сохранятся)     |
| `docker compose down -v`    | удалить базу вместе с данными           |
| `nest g resource <имя>`     | сгенерировать модуль с CRUD             |

## Что дальше изучать

1. Конфиг через `.env` и `@nestjs/config` (пароли не в коде)
2. Связи между таблицами: пользователи и их задачи
3. Авторизация: регистрация, логин, JWT, guards
4. Миграции вместо `synchronize: true`
5. Swagger-документация и тесты (unit и e2e)

Документация: https://docs.nestjs.com
