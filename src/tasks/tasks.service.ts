/**
 * tasks.service.ts - СЕРВИС: вся бизнес-логика задач (найти, создать, изменить, удалить).
 * Контроллер просто зовёт методы отсюда.
 * Аналог хука/стора на фронте (useTasks, Pinia, Redux).
 * Данные хранятся в PostgreSQL, работаем с ними через репозиторий TypeORM
 * (готовые методы find, findOneBy, save, remove - SQL писать не нужно).
 * Когда мы заменили массив на базу, контроллер менять не пришлось - в этом смысл разделения.
 * Методы async: запрос в базу занимает время, поэтому они возвращают Promise.
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  // Dependency Injection: просим у Nest репозиторий таблицы task.
  // @InjectRepository(Task) указывает, КАКОЙ именно репозиторий нужен
  // (берётся из TypeOrmModule.forFeature([Task]) в tasks.module.ts).
  // Имя tasksRepository - просто соглашение для читаемости, Nest на него не смотрит.
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  // Создать: create() собирает объект Task из DTO (в базу пока не пишет),
  // save() сохраняет его (INSERT) и возвращает с id и done=false, которые проставила база
  create(dto: CreateTaskDto): Promise<Task> {
    const task = this.tasksRepository.create(dto);
    return this.tasksRepository.save(task);
  }

  // Вернуть все задачи (SELECT * FROM task)
  findAll(): Promise<Task[]> {
    return this.tasksRepository.find();
  }

  // Найти одну по id. findOneBy вернёт null, если строки нет.
  // Тогда кидаем исключение, Nest превратит его в ответ 404
  async findOne(id: number): Promise<Task> {
    const task = await this.tasksRepository.findOneBy({ id });
    if (!task) throw new NotFoundException(`Task #${id} not found`);
    return task;
  }

  // Обновить: находим (или 404), переписываем только присланные поля и сохраняем (UPDATE)
  async update(id: number, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    Object.assign(task, dto);
    return this.tasksRepository.save(task);
  }

  // Удалить: находим (или 404) и удаляем строку из таблицы (DELETE)
  async remove(id: number): Promise<void> {
    const task = await this.findOne(id);
    await this.tasksRepository.remove(task);
  }
}
