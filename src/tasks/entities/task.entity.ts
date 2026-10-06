/**
 * task.entity.ts - СУЩНОСТЬ: как задача выглядит и хранится внутри приложения.
 * Пока это просто тип (как interface на фронте).
 * Позже, с ORM, добавим декораторы (@Entity, @Column), и этот класс
 * станет таблицей в базе данных.
 * Отличие от DTO: тут ПОЛНАЯ задача (с id и done), DTO - только то, что шлёт клиент.
 */
export class Task {
  id: number;
  title: string;
  description?: string;
  done: boolean;
}
