# Таблица
> Код фронтенда — [тут](https://github.com/qgncc/table-frontend)
## Установка
1. `git clone https://github.com/qgncc/table`
2. `cd table`
3. `npm i`
4. `node index.js`

Сервер будет запущен на порту `8081`. Можно использовать кастомную бд указава переменные среды `DATABASE_URL=db_url` и `TABLE_NAME=table_name`, тогда сервер будет пытаться обращаться к бд по `db_url` и считывать данные из таблицы `table_name`. Кастомная бд должна иметь поля `date`,`name`,`amount`,`distance`

