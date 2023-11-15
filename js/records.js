// Получение содержимого файла JSON
fetch('db.json')
  .then(response => response.json())
  .then(data => {
    const users = data.users;
    const wins = data.wins;

    // Сортировка по количеству побед
    wins.sort((a, b) => b.winsCount - a.winsCount);

    // Получение элемента таблицы рекордов
    const table = document.querySelector('.container');

    // Добавление первых трех победителей
    for (let i = 0; i < 3; i++) {
      const person = document.createElement('div');
      person.className = 'person';

      // Установка изображения в зависимости от места
      if (i === 0) {
        person.innerHTML = `
          <img src="css/image/gold-win.png" alt="" class="person__image">
          <p class="person__text">${users.find(user => user.username === wins[i].username).username}</p>
          <p class="person__wins">${wins[i].winsCount}</p>
        `;
      } else if (i === 1) {
        person.innerHTML = `
          <img src="css/image/silver-win.png" alt="" class="person__image">
          <p class="person__text">${users.find(user => user.username === wins[i].username).username}</p>
          <p class="person__wins">${wins[i].winsCount}</p>
        `;
      } else if (i === 2) {
        person.innerHTML = `
          <img src="css/image/bronze-win.png" alt="" class="person__image">
          <p class="person__text">${users.find(user => user.username === wins[i].username).username}</p>
          <p class="person__wins">${wins[i].winsCount}</p>
        `;
      }

      // Добавление человека в таблицу рекордов
      table.appendChild(person);
    }

    // Добавление остальных победителей
    for (let i = 3; i < wins.length; i++) {
      const person = document.createElement('div');
      person.className = 'person';
      person.innerHTML = `
        <p>${i+1}</p>
        <p class="person__text">${users.find(user => user.username === wins[i].username).username}</p>
        <p class="person__wins">${wins[i].winsCount}</p>
      `;
      table.appendChild(person);
    }
  })
  .catch(error => console.log(error));

 
function ExitSite() {
      localStorage.setItem('settings', JSON.stringify({
            valueBomb: setting.valueBomb,
            area: setting.area,
      }))
}
