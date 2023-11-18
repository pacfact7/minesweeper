// Данный скрипт представляет собой простой JSON-сервер, созданный с использованием библиотеки json-server для Node.js. JSON-сервер предоставляет HTTP API для взаимодействия с файловой базой данных, представленной в формате JSON.

// Импорт необходимых модулей
const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json"); // Подключение файла базы данных db.json
const middlewares = jsonServer.defaults();

// Использование промежуточных обработчиков (middlewares), включая парсер JSON
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Обработчик для запросов PUT на /wins
server.put("/wins", (req, res, next) => {
   const { username, winsCount } = req.body;
   // Обновление информации о победе в базе данных
   const wins = router.db.get("wins").find({ username: username }).value();
   wins.winsCount = winsCount;
   router.db.write();
   res.sendStatus(200); // Отправляем успешный статус ответа
});

// Использование маршрутизатора (router)
server.use(router);

// Запуск сервера на порте 3000
server.listen(3000, () => {
   console.log("JSON Server is running");
});
