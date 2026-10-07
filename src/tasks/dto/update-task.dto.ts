/**
 * update-task.dto.ts - DTO для изменения задачи (PATCH /tasks/:id).
 * PartialType берёт все поля CreateTaskDto и делает их необязательными,
 * чтобы можно было прислать только то, что меняем, например {"done": true}.
 * Плюс добавляем поле done, которого при создании быть не должно.
 */
import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsBoolean()
  @IsOptional()
  done?: boolean;
}
