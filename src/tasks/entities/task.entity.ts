/**
 * task.entity.ts - СУЩНОСТЬ: класс, который TypeORM превращает в ТАБЛИЦУ в PostgreSQL.
 * Класс = таблица, поле класса = колонка, объект класса = одна строка таблицы.
 * Благодаря synchronize: true (app.module.ts) таблица "task" создаётся сама при старте.
 *
 * Отличие от DTO: тут ПОЛНАЯ задача (с id и done), как она хранится в базе.
 * DTO - только то, что клиент имеет право прислать.
 */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// @Entity() - пометка "этот класс - таблица". Имя таблицы по умолчанию: task
@Entity()
export class Task {
  // @PrimaryGeneratedColumn() - первичный ключ с автоинкрементом.
  // Уникальный номер строки; его выдаёт БД сама (1, 2, 3...), поэтому клиент id не шлёт.
  @PrimaryGeneratedColumn()
  id: number;

  // @Column() - обычная колонка. Тип берётся из TypeScript: string -> varchar.
  // Обязательная: пустое значение (NULL) база не примет.
  @Column()
  title: string;

  // Колонка с настройками:
  //   type: 'text'    - длинный текст без ограничения длины (varchar короче)
  //   nullable: true  - можно хранить NULL, то есть описание необязательно
  // "?" в TypeScript и nullable: true друг без друга не работают: "?" - для компилятора,
  // nullable - для базы данных.
  @Column({ type: 'text', nullable: true })
  description?: string;

  // default: false - если при создании не указали done, база сама поставит false.
  // Поэтому клиент не обязан присылать это поле.
  @Column({ default: false })
  done: boolean;
}
