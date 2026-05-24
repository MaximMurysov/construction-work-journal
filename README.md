# Журнал работ

**Репозиторий:** https://github.com/MaximMurysov/construction-work-journal

Веб-приложение для учёта выполненных работ на строительном объекте: прораб фиксирует дату, вид работ, объём с единицей измерения и ФИО исполнителя.

## Стек

| Слой | Технология | Почему |
|------|------------|--------|
| Frontend | Next.js 16 + React 19 + TypeScript | Единый fullstack-проект, быстрый старт, типобезопасность |
| Backend | Next.js Route Handlers | REST API без отдельного сервера |
| БД | PostgreSQL 16 | Надёжное хранение связанных данных |
| ORM | Prisma 7 | Миграции, типизированный клиент, seed |
| Инфра | Docker Compose | Одна команда для поднятия Postgres локально |

## Функциональность

- Список записей журнала с фильтрацией и сортировкой по дате
- Добавление записи с валидацией обязательных полей
- Редактирование и удаление записей
- Справочник видов работ (выбор из предзаполненного списка)

## Быстрый старт

### Требования

- Node.js 20+
- Docker Desktop (или Docker Engine + Compose)

### Запуск

```bash
cd construction-work-journal
cp .env.example .env
npm install
npm run setup
npm run dev
```

Приложение будет доступно на [http://localhost:3000](http://localhost:3000).

### Пошагово

1. Поднять PostgreSQL:

```bash
npm run db:up
```

2. Применить миграции и заполнить справочник:

```bash
npx prisma migrate deploy
npm run db:seed
```

3. Запустить dev-сервер:

```bash
npm run dev
```

## API

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/work-types` | Список видов работ |
| GET | `/api/entries?from=&to=&sort=asc\|desc` | Список записей с фильтром/сортировкой |
| POST | `/api/entries` | Создание записи |
| PUT | `/api/entries/:id` | Обновление записи |
| DELETE | `/api/entries/:id` | Удаление записи |

## Структура БД

- `work_types` — справочник видов работ (`name`, `default_unit`)
- `work_entries` — записи журнала, связаны с `work_types`

## Полезные команды

```bash
npm run db:down      # остановить контейнер Postgres
npm run lint         # ESLint
npm run build        # production-сборка
```
