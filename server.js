const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Обработчик для запросов PUT на /wins
server.put('/wins', (req, res, next) => {
  const { username, winsCount } = req.body;
  // Обновление информации о победе в базе данных
  const wins = router.db.get('wins').find({ username: username }).value();
  wins.winsCount = winsCount;
  router.db.write();

  res.sendStatus(200); // Отправляем успешный статус ответа
});

server.use(router);

server.listen(3000, () => {
  console.log('JSON Server is running');
});