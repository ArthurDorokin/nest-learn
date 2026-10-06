/**
 * tasks.service.ts - СЕРВИС: вся бизнес-логика задач (найти, создать, изменить, удалить).
 * Контроллер просто зовёт методы отсюда.
 * Аналог хука/стора на фронте (useTasks, Pinia, Redux).
 * Сейчас "база" - обычный массив в памяти. Позже заменим на настоящую БД через ORM,
 * а контроллер при этом менять не придётся - в этом смысл разделения.
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  // Наше "хранилище". Пропадёт при перезапуске сервера.
  private tasks: Task[] = [];
  // Счётчик для генерации id (в БД это будет делать сама база)
  private nextId = 1;

  // Создать: добавляем id и done=false, остальное берём из DTO
  create(dto: CreateTaskDto): Task {
    const task: Task = { id: this.nextId++, done: false, ...dto };
    this.tasks.push(task);
    return task;
  }

  // Вернуть все задачи
  findAll(): Task[] {
    return this.tasks;
  }

  // Найти одну. Если нет - кидаем исключение, Nest превратит его в ответ 404
  findOne(id: number): Task {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) throw new NotFoundException(`Task #${id} not found`);
    return task;
  }

  // Обновить: находим (или 404) и переписываем только присланные поля
  update(id: number, dto: UpdateTaskDto): Task {
    const task = this.findOne(id);
    Object.assign(task, dto);
    return task;
  }

  // Удалить: находим (или 404) и убираем из массива
  remove(id: number): void {
    const task = this.findOne(id);
    this.tasks = this.tasks.filter((t) => t.id !== task.id);
  }
}
