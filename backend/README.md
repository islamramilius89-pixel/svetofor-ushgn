# Бэкенд «Светофор УШГН»

NestJS 12 + Prisma 7 + SQLite. Описание API и архитектуры — в [README проекта](../README.md).

```bash
npm install              # также генерирует клиент Prisma
npm run db:deploy        # применить миграции (создаст prisma/dev.db)
npm run db:seed          # тестовые данные и администратор
npm run start:dev        # сервер на http://localhost:4000/api
npm test                 # модульные тесты
npm run test:e2e         # тесты API
```
