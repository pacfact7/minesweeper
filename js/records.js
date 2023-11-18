// Получение содержимого файла JSON
fetch('db.json')
  .then(response => response.json())
  .then(data => {
    const users = data.users; // Получение списка пользователей из данных
    const wins = data.wins; // Получение списка побед из данных

    // Сортировка по количеству побед
    wins.sort((a, b) => b.winsCount - a.winsCount); // Сортировка списка побед по убыванию количества побед

    // Получение элемента таблицы рекордов
    const table = document.querySelector('.container');

    // Добавление первых трех победителей
    for (let i = 0; i < 3; i++) {
      const person = document.createElement('div'); // Создание элемента для отображения информации о победителе
      person.className = 'person'; // Назначение класса элементу

      // Установка изображения в зависимости от места
      if (i === 0) {
        person.innerHTML = `
          <img src="css/image/gold-win.png" alt="" class="person__image"> <!-- Добавление изображения золотого призера -->
          <p class="person__text">${users.find(user => user.username === wins[i].username).username}</p> <!-- Отображение имени победителя -->
          <p class="person__wins">${wins[i].winsCount}</p> <!-- Отображение количества побед -->
        `;
      } else if (i === 1) {
        person.innerHTML = `
          <img src="css/image/silver-win.png" alt="" class="person__image"> <!-- Добавление изображения серебряного призера -->
          <p class="person__text">${users.find(user => user.username === wins[i].username).username}</p> <!-- Отображение имени победителя -->
          <p class="person__wins">${wins[i].winsCount}</p> <!-- Отображение количества побед -->
        `;
      } else if (i === 2) {
        person.innerHTML = `
          <img src="css/image/bronze-win.png" alt="" class="person__image"> <!-- Добавление изображения бронзового призера -->
          <p class="person__text">${users.find(user => user.username === wins[i].username).username}</p> <!-- Отображение имени победителя -->
          <p class="person__wins">${wins[i].winsCount}</p> <!-- Отображение количества побед -->
        `;
      }

      // Добавление человека в таблицу рекордов
      table.appendChild(person); // Добавление информации о победителе в таблицу
    }

    // Добавление остальных победителей
    for (let i = 3; i < wins.length; i++) {
      const person = document.createElement('div'); // Создание элемента для отображения информации о победителе
      person.className = 'person'; // Назначение класса элементу
      person.innerHTML = `
        <p>${i+1}</p> <!-- Отображение места в общем рейтинге -->
        <p class="person__text">${users.find(user => user.username === wins[i].username).username}</p> <!-- Отображение имени победителя -->
        <p class="person__wins">${wins[i].winsCount}</p> <!-- Отображение количества побед -->
      `;
      table.appendChild(person); // Добавление информации о победителе в таблицу
    }
  })
  .catch(error => console.log(error)); // Обработка ошибок при получении данных


  function ExitSite() {
    // Сохранение настроек в локальное хранилище перед выходом
    localStorage.setItem('settings', JSON.stringify({
      valueBomb: setting.valueBomb, // Сохранение значения переменной "valueBomb"
      area: setting.area, // Сохранение значения переменной "area"
    }))
  }
