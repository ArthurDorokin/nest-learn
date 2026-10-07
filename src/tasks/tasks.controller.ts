/**
 * tasks.controller.ts - КОНТРОЛЛЕР: описывает маршруты (URL + HTTP-метод).
 * Его работа: принять запрос -> достать данные -> передать в сервис -> вернуть ответ.
 * Логики тут быть не должно (она в TasksService).
 * Аналог роутера/обработчика маршрутов на фронте.
 */
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

// Все маршруты ниже начинаются с /tasks
@Controller('tasks')
export class TasksController {
  // Dependency Injection: Nest сам подставляет готовый TasksService
  constructor(private readonly tasksService: TasksService) {}

  // POST /tasks - создать задачу. @Body() - JSON из тела запроса
  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  // GET /tasks - получить все задачи
  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  // GET /tasks/5 - получить одну. @Param('id') - часть URL, всегда строка
  // "+id" превращает строку в число
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.findOne(id);
  }

  // PATCH /tasks/5 - частично обновить (прислать можно только изменённые поля)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  // DELETE /tasks/5 - удалить
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.remove(id);
  }
}
