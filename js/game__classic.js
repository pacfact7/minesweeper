// Объявление переменных для хранения имени пользователя и пароля
let username;
let password;

// Обработчик события отправки формы регистрации
document.getElementById("registerForm").addEventListener("submit", function (e) {
   e.preventDefault(); // Предотвращение стандартного действия отправки формы

   // Получение введенного имени пользователя и пароля из полей формы
   username = document.getElementById("registerUsername").value;
   password = document.getElementById("registerPassword").value;

   // Отправка данных на сервер для регистрации нового пользователя
   fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
         "Content-Type": "application/json", // Установка заголовка для указания типа содержимого
      },
      body: JSON.stringify({ username, password }), // Преобразование данных в формат JSON и отправка на сервер
   })
      .then((response) => response.json()) // Обработка ответа сервера в формате JSON
      .then((data) => {
         console.log(data); // Вывод ответа сервера в консоль для отладки
         // Скрытие формы после успешной регистрации
         document.querySelector(".main__data").style.display = "none";
      })
      .catch((error) => console.log("Error:", error)); // Обработка ошибок при отправке данных на сервер
});

// Обработчик события отправки формы входа
document.getElementById("loginForm").addEventListener("submit", function (e) {
   e.preventDefault(); // Предотвращение стандартного действия отправки формы

   // Получение введенного имени пользователя и пароля из полей формы
   username = document.getElementById("loginUsername").value;
   password = document.getElementById("loginPassword").value;

   // Отправка данных на сервер для аутентификации пользователя
   fetch(`http://localhost:3000/users?username=${username}&password=${password}`)
      .then((response) => {
         if (!response.ok) {
            throw new Error("Сетевой ответ не был успешным");
         }
         return response.json(); // Обработка ответа сервера в формате JSON
      })
      .then((data) => {
         console.log(data); // Вывод ответа сервера в консоль для отладки
         if (data && data.length > 0) {
            // Пользователь найден, выполняем вход
            console.log("Вход выполнен успешно");
            // Скрытие формы после успешного входа
            document.querySelector(".main__data").style.display = "none";
         } else {
            console.log("Неверное имя пользователя или пароль");
         }
      })
      .catch((error) => console.error("Ошибка:", error)); // Обработка ошибок при отправке данных на сервер
});

// Генерация ячейки для игрового поля
const cellSpan = `<span oncontextmenu="return false" onmousedown="clickMouse(event.target, event)" data-flag="false"
                  data-clue="false" class="block"></span>`;
// Переменная cellSpan содержит HTML-разметку для создания ячейки игрового поля, предотвращает контекстное меню и вызывает функцию clickMouse при щелчке мышью. Ячейка имеет атрибуты data-flag и data-clue, установленные в false, и принадлежит к классу 'block'.

// Получение данных из локального хранилища для настроек
var setting = JSON.parse(localStorage.getItem("settings"));
var fieldClass = document.querySelector(".field-area");
fieldClass.style.gridTemplateRows = `repeat(${setting.area}, 1fr)`;
fieldClass.style.gridTemplateColumns = `repeat(${setting.area}, 1fr)`;
for (let i = 0; i < setting.area * setting.area; i++) {
   fieldClass.innerHTML = cellSpan + fieldClass.innerHTML;
}
// Извлечение настроек игрового поля из локального хранилища, установка размеров сетки игрового поля и создание нужного количества ячеек, добавляя HTML-разметку cellSpan в начало содержимого поля.

// Перемнные для сапера
let endTimer;
let seconds = 0;
let minutes = 0;
let hours = 0;
let cells = document.querySelectorAll(".block");
let field = setting.area;
let idSpan = 0;
let bombs = [];
let colors = [0, "#75c5c6", "#1ec2c1", "#00b6b3", "#00afaa", "#008f8d", "#007e7d", "#006c66", "#005c5a"];
var eventClick;
let timerActive;
let kolBomb = setting.valueBomb;
let remainingBobmbs = kolBomb;
let valueCell = field * field - kolBomb;
let flags = kolBomb;
let checkAirCellMassive = [];
let cellHover;

let onTime = false;
let checkCenter = false;
let loseFirstClick = false;
let regenBombs = false;
let bombActive = false;
let firstclick = false;
let checkActive = false;
let checkBomb2 = false;
let clue = false;
let openingCell = true;

let coordsLeftUp = [9, 10, 19];
let coordsRightUp = [10, 11, 21];
let coordsLeftDown = [19, 29, 30];
let coordsRightDown = [21, 30, 31];
let coordsTop = [9, 10, 11, 19, 21];
let coordsBottom = [19, 21, 29, 30, 31];
let coordsLeft = [9, 10, 19, 29, 30];
let coordsRight = [10, 11, 21, 30, 31];
let coordsCenter = [11, 10, 9, 1, -1, 9, -10, -11];

let idCornerCells = [];
let idNotInCenter = [];
let idRightCell = [];
let idLeftCell = [];

let valueBomb;

// Назначение обработчика события на клик по элементу с классом "standart"
document.querySelector(".standart").addEventListener("click", () => {
   // При клике скрывается элемент с классом "modeSelectin" и устанавливается значение для переменной endTimer
   document.querySelector(".modeSelectin").style.display = "none";
   endTimer = 86400; // Установка времени игры
});

// Назначение обработчика события на клик по элементу с классом "onTime"
document.querySelector(".onTime").addEventListener("click", () => {
   // При клике скрывается элемент с классом "modeSelectin", а также устанавливается значение для переменных onTime и endTimer
   document.querySelector(".modeSelectin").style.display = "none";
   onTime = true; // Установка режима игры "по времени"
   endTimer = 300; // Установка времени игры
});

// Функция добавления идентификаторов к элементам span
function addIdInSystem() {
   // Добавление id к элементам span и присвоение класса "hide"
   cells.forEach((elem) => {
      elem.id = idSpan; // Присвоение уникального идентификатора
      elem.classList.add("hide"); // Добавление класса для скрытия ячейки
      idSpan++; // Увеличение счетчика идентификаторов
   });

   // Инициализация массивов с идентификаторами угловых и боковых ячеек
   idSpan = 0; // Сброс счетчика идентификаторов
   idCornerCells.push(idSpan); // Добавление идентификаторов угловых ячеек
   idCornerCells.push(idSpan + (setting.area - 1));
   idCornerCells.push(idSpan + setting.area * setting.area - setting.area);
   idCornerCells.push(idSpan + setting.area * setting.area - 1);
   for (let i = 1; i < setting.area - 1; i++) {
      idLeftCell.push(idSpan + setting.area * i); // Добавление идентификаторов левых боковых ячеек
      idRightCell.push(idSpan + setting.area * (1 + i) - 1); // Добавление идентификаторов правых боковых ячеек
   }
}

addIdInSystem(); // Вызов функции для добавления идентификаторов к элементам span

// Функция проверки соседних клеток относительно выбранной ячейки
function checkCell(cell) {
   let valueArea = Number(setting.area); // Получение значения размера игрового поля
   let cellId = Number(cell.id); // Получение идентификатора выбранной ячейки
   checkCenter = false; // Флаг для определения, является ли выбранная ячейка центром

   // Проверка соседних клеток для левого верхнего угла
   if (cellId == idSpan) {
      [idSpan + 1, idSpan + valueArea + 1, idSpan + valueArea].forEach((id) => {
         if (cells[id].classList.value == "block hide bomb") {
            valueBomb++; // Увеличение счетчика бомб
            cellHover = 1; // Установка значения для переменной cellHover
         }
      });
      checkCenter = true; // Установка флага, что выбранная ячейка является центром
   }

   // Проверка соседних клеток для правого верхнего угла
   if (cellId == idSpan + setting.area - 1) {
      [idSpan + valueArea - 2, idSpan + valueArea + valueArea - 1, idSpan + valueArea + valueArea - 2].forEach((id) => {
         if (cells[id].classList.value == "block hide bomb") {
            valueBomb++; // Увеличение счетчика бомб
            cellHover = 2; // Установка значения для переменной cellHover
         }
      });
      checkCenter = true; // Установка флага, что выбранная ячейка является центром
   }

   // Проверка соседних клеток для левого нижнего угла
   if (cellId == idSpan + setting.area * setting.area - setting.area) {
      [
         idSpan + valueArea * valueArea - valueArea - valueArea,
         idSpan + valueArea * valueArea - valueArea + 1,
         idSpan + valueArea * valueArea - valueArea - valueArea + 1,
      ].forEach((id) => {
         if (cells[id].classList.value == "block hide bomb") {
            valueBomb++; // Увеличение счетчика бомб
            cellHover = 3; // Установка значения для переменной cellHover
         }
      });
      checkCenter = true; // Установка флага, что выбранная ячейка является центром
   }

   // Проверка соседних клеток для правого нижнего угла
   if (cellId == idSpan + setting.area * setting.area - 1) {
      [
         idSpan + valueArea * valueArea - 2,
         idSpan + valueArea * valueArea - valueArea - 1,
         idSpan + valueArea * valueArea - valueArea - 2,
      ].forEach((id) => {
         if (cells[id].classList.value == "block hide bomb") {
            valueBomb++; // Увеличение счетчика бомб
            cellHover = 4; // Установка значения для переменной cellHover
         }
      });
      checkCenter = true; // Установка флага, что выбранная ячейка является центром
   }

   // Проверка соседних клеток для верхнего ряда
   if (cellId > idSpan && cellId < idSpan + valueArea) {
      // Если выбранная ячейка находится в верхнем ряду, проверяем соседние клетки сверху, справа, слева и по диагонали
      [cellId - 1, cellId + 1, cellId + valueArea, cellId + valueArea - 1, cellId + valueArea + 1].forEach((id) => {
         // Если соседняя клетка содержит бомбу, увеличиваем счетчик бомб и устанавливаем значение cellHover
         if (cells[id].classList.value == "block hide bomb") {
            valueBomb++;
            cellHover = 5;
         }
      });
      checkCenter = true; // Устанавливаем флаг, что выбранная ячейка является центром
   }

   // Проверка соседних клеток для нижнего ряда
   if (cellId < idSpan + valueArea * valueArea - 1 && cellId > idSpan + valueArea * valueArea - valueArea) {
      // Если выбранная ячейка находится в нижнем ряду, проверяем соседние клетки снизу, справа, слева и по диагонали
      [cellId - 1, cellId + 1, cellId - valueArea, cellId - valueArea - 1, cellId - valueArea + 1].forEach((id) => {
         // Если соседняя клетка содержит бомбу, увеличиваем счетчик бомб и устанавливаем значение cellHover
         if (cells[id].classList.value == "block hide bomb") {
            valueBomb++;
            cellHover = 6;
         }
      });
      checkCenter = true; // Устанавливаем флаг, что выбранная ячейка является центром
   }

   // Проверка соседних клеток для правого ряда
   idRightCell.forEach((item) => {
      if (cellId == item) {
         // Если выбранная ячейка находится в правом ряду, проверяем соседние клетки справа, сверху, снизу и по диагонали
         [cellId - 1, cellId + valueArea, cellId + valueArea - 1, cellId - valueArea, cellId - valueArea - 1].forEach(
            (id) => {
               // Если соседняя клетка содержит бомбу, увеличиваем счетчик бомб и устанавливаем значение cellHover
               if (cells[id].classList.value == "block hide bomb") {
                  valueBomb++;
                  cellHover = 7;
               }
            }
         );
         checkCenter = true; // Устанавливаем флаг, что выбранная ячейка является центром
      }
   });

   // Проверка соседних клеток для левого ряда
   idLeftCell.forEach((item) => {
      if (cellId == item) {
         // Если выбранная ячейка находится в левом ряду, проверяем соседние клетки слева, сверху, снизу и по диагонали
         [cellId + 1, cellId - valueArea, cellId - valueArea + 1, cellId + valueArea, cellId + valueArea + 1].forEach(
            (id) => {
               // Если соседняя клетка содержит бомбу, увеличиваем счетчик бомб и устанавливаем значение cellHover
               if (cells[id].classList.value == "block hide bomb") {
                  valueBomb++;
                  cellHover = 8;
               }
            }
         );
         checkCenter = true; // Устанавливаем флаг, что выбранная ячейка является центром
      }
   });

   // Обработка центральной ячейки и её окружения
   if (checkCenter == false) {
      // Проверяем соседние клетки вокруг центральной ячейки
      [
         cellId + 1,
         cellId - 1,
         cellId + valueArea,
         cellId - valueArea,
         cellId + valueArea - 1,
         cellId - valueArea - 1,
         cellId + valueArea + 1,
         cellId - valueArea + 1,
      ].forEach((id) => {
         // Если соседняя клетка содержит бомбу, увеличиваем счетчик бомб и устанавливаем значение cellHover
         if (cells[id].classList.value == "block hide bomb") {
            valueBomb++;
            cellHover = 9;
         }
      });
   }
}

// Функция для проверки клетки на наличие бомбы и установки соответствующего значения
function checkBomb(cell) {
   valueBomb = 0; // Счетчик бомб вокруг клетки
   checkActive = false; // Флаг активации

   if (cell.classList.value == "field-area") return 0; // Если клетка является пустой, возвращаем 0

   checkCell(cell); // Вызов функции для проверки клетки

   // Вывод значения в зависимости от количества бомб вокруг клетки
   if (cells[Number(cell.id)].classList.value == "block hide bomb") {
      cell.textContent = " "; // Если в клетке есть бомба, выводим пробел
   } else {
      if (valueBomb == 0) {
         cell.textContent = " "; // Если рядом нет бомб, выводим пробел
      } else {
         cell.textContent = valueBomb; // Выводим количество бомб вокруг клетки
         cell.style.color = `${colors[valueBomb]}`; // Устанавливаем цвет текста в зависимости от количества бомб
      }
   }
}

// Функция для обновления расположения бомб на поле
function updateBombs() {
   bombs = generateArrayRandomNumber(0, setting.area * setting.area); // Генерация случайных координат для бомб
   // Размещение бомб на поле
   for (let i = 0; i < kolBomb; i++) {
      cells.forEach((elem) => {
         if (elem.id == bombs[i]) {
            elem.classList.add("bomb"); // Добавляем класс "bomb" к клетке, чтобы обозначить наличие бомбы
         }
      });
   }
   document.querySelector(".information-value-miens > span").textContent = kolBomb; // Обновление информации о количестве бомб на поле
}

// Функция generateArrayRandomNumber генерирует массив случайных чисел в заданном диапазоне
function generateArrayRandomNumber(min, max) {
   var totalNumbers = max - min + 1, // Вычисляем общее количество чисел в диапазоне
      arrayTotalNumbers = [], // Создаем пустой массив для всех чисел в диапазоне
      arrayRandomNumbers = [], // Создаем пустой массив для случайных чисел
      tempRandomNumber;

   // Заполняем массив arrayTotalNumbers числами от min до max
   while (totalNumbers--) {
      arrayTotalNumbers.push(totalNumbers + min);
   }

   // Генерируем случайные числа путем извлечения элементов из arrayTotalNumbers и добавления их в arrayRandomNumbers
   while (arrayTotalNumbers.length) {
      tempRandomNumber = Math.round(Math.random() * (arrayTotalNumbers.length - 1)); // Генерируем случайный индекс
      arrayRandomNumbers.push(arrayTotalNumbers[tempRandomNumber]); // Добавляем случайное число в arrayRandomNumbers
      arrayTotalNumbers.splice(tempRandomNumber, 1); // Удаляем выбранное число из arrayTotalNumbers
   }
   return arrayRandomNumbers; // Возвращаем массив случайных чисел
}

// Функция clearBomb удаляет все метки бомб на клетках и обнуляет текст в клетках
function clearBomb() {
   cells.forEach((elem) => {
      elem.classList.remove("bomb"); // Удаляем класс "bomb" для каждой клетки
      elem.classList.remove("bombActive"); // Удаляем класс "bombActive" для каждой клетки
      elem.textContent = " "; // Устанавливаем текст в клетке равным пробелу
   });
}

// Функция timer запускает таймер и обновляет отображение времени
function timer() {
   let valueTimer = 1; // Инициализируем переменную для отслеживания прошедшего времени
   timerActive = setInterval(() => {
      // Устанавливаем интервал выполнения кода каждую секунду
      if (valueTimer <= endTimer) {
         // Проверяем, не дошло ли время до конечного значения
         if (seconds < 60) {
            // Проверяем, не достигли ли секунды 60
            if (seconds < 10) {
               // Если секунды меньше 10, добавляем ведущий ноль
               document.querySelector(".seconds>div>span").textContent = "0" + seconds; // Обновляем отображение секунд с ведущим нулем
            } else {
               document.querySelector(".seconds>div>span").textContent = seconds; // Обновляем отображение секунд без ведущего нуля
            }
            seconds++; // Увеличиваем значение секунд на 1
            valueTimer++; // Увеличиваем значение прошедшего времени
         } else {
            // Если секунды достигли 60
            seconds = 1; // Сбрасываем секунды в 1
            minutes++; // Увеличиваем значение минут на 1
            if (minutes < 60) {
               // Проверяем, не достигли ли минуты 60
               if (minutes < 10) {
                  // Если минуты меньше 10, добавляем ведущий ноль
                  document.querySelector(".minutes>div>span").textContent = "0" + minutes; // Обновляем отображение минут с ведущим нулем
               } else {
                  document.querySelector(".minutes>div>span").textContent = minutes; // Обновляем отображение минут без ведущего нуля
               }
            } else {
               // Если минуты достигли 60
               seconds = 1; // Сбрасываем секунды в 1
               minutes = 0; // Сбрасываем минуты в 0
               hours++; // Увеличиваем значение часов на 1
               if (hours < 24) {
                  // Проверяем, не достигли ли часы 24
                  if (hours < 10) {
                     // Если часы меньше 10, добавляем ведущий ноль
                     document.querySelector(".minutes>div>span").textContent = "0" + minutes; // Обновляем отображение минут с ведущим нулем
                     document.querySelector(".hours>div>span").textContent = "0" + hours; // Обновляем отображение часов с ведущим нулем
                  } else {
                     document.querySelector(".minutes>div>span").textContent = "0" + minutes; // Обновляем отображение минут с ведущим нулем
                     document.querySelector(".hours>div>span").textContent = hours; // Обновляем отображение часов без ведущего нуля
                  }
               }
            }
         }
      } else {
         // Если время вышло
         if (onTime == true) {
            // Проверяем, установлен ли флаг onTime
            gameover(); // Вызываем функцию завершения игры
            document.querySelector(".field-lose > p").textContent = "Time is over..."; // Обновляем сообщение о проигрыше
            clearInterval(timerActive); // Останавливаем таймер
         }
      }
   }, 1000); // Интервал выполнения кода каждую секунду
}

// Функция PauseTimer останавливает таймер, сбрасывает значения времени и обновляет отображение времени на "00"
function PauseTimer() {
   clearInterval(timerActive); // Останавливаем таймер
   document.querySelector(".seconds>div>span").textContent = "00"; // Обновляем отображение секунд на "00"
   document.querySelector(".minutes>div>span").textContent = "00"; // Обновляем отображение минут на "00"
   document.querySelector(".hours>div>span").textContent = "00"; // Обновляем отображение часов на "00"
   seconds = 1; // Сбрасываем значение секунд в 1
   minutes = 0; // Сбрасываем значение минут в 0
   hours = 0; // Сбрасываем значение часов в 0
}

// Функция restart перезапускает игру, сбрасывая все значения и состояния элементов
function restart() {
   cells.forEach((elem) => {
      // Проходимся по всем ячейкам игрового поля
      elem.classList.add("hide"); // Добавляем класс "hide" для скрытия ячеек
      elem.dataset["flag"] = "false"; // Сбрасываем значение атрибута "flag" в "false"
      elem.dataset["clue"] = "false"; // Сбрасываем значение атрибута "clue" в "false"
   });
   flags = setting.valueBomb; // Восстанавливаем количество флагов
   kolBomb = setting.valueBomb; // Восстанавливаем количество бомб
   valueCell = field * field - kolBomb; // Восстанавливаем значение количества ячеек без бомб
   remainingBombs = kolBomb; // Восстанавливаем количество оставшихся бомб
   clearBomb(); // Очищаем бомбы
   PauseTimer(); // Останавливаем таймер и сбрасываем значения времени
   updateBombs(); // Обновляем отображение количества оставшихся бомб
   document.querySelector(".information-value-mines > span").textContent = kolBomb; // Обновляем отображение количества оставшихся бомб
   document.querySelector(".field-area").style.border = "5px solid rgb(54, 140, 151)"; // Восстанавливаем стиль границы игрового поля
   document.querySelector(".field-lose").style.display = "none"; // Скрываем сообщение о проигрыше
   bombActive = false; // Сбрасываем флаг активности бомбы
   firstClick = false; // Сбрасываем флаг первого клика
   regenBombs = true; // Сбрасываем флаг пересоздания бомб
   clue = false; // Сбрасываем флаг подсказки
   loseFirstClick = false; // Сбрасываем флаг проигрыша при первом клике
}

// Пересоздание бомб и перезапуск игры при нажатии кнопки
document.querySelector(".information__button").addEventListener("click", () => {
   restart();
});

// Скрытие сообщения о проигрыше при нажатии кнопки
document.querySelector(".field-lose>button").addEventListener("click", () => {
   document.querySelector(".field-lose").style.display = "none";
});

// Функция для проверки и отображения подсказки
function checkClue(number) {
   if (cells[bombs[number]].dataset["flag"] != "true") {
      cells[bombs[number]].dataset["clue"] = true; // Установка атрибута clue в значение true
   } else {
      temp = Math.floor(Math.random() * kolBomb); // Генерация случайного числа
      checkClue(temp); // Рекурсивный вызов функции, если ячейка уже помечена флагом
   }
}

// Обработчик события для кнопки подсказки
document.querySelector(".information__lamp").addEventListener("click", () => {
   if (clue != false) return; // Проверка, использовалась ли уже подсказка
   let temp = Math.floor(Math.random() * kolBomb); // Генерация случайного числа
   checkClue(temp); // Вызов функции для отображения подсказки
   clue = true; // Установка флага подсказки в значение true
   if (firstclick == false) {
      firstclick = true;
      timer(); // Запуск таймера, если это первый клик в игре
   } else {
      firstclick = true;
   }
});

// Функция для обновления количества побед пользователя на сервере
function updateWins(username, winsCount) {
   fetch(`http://localhost:3000/wins`, {
      method: "PUT",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, winsCount }), // Отправка данных в формате JSON
   })
      .then((response) => {
         if (response.ok) {
            console.log("Победа зарегистрирована");
         } else {
            console.error("Ошибка при регистрации победы");
         }
      })
      .catch((error) => console.error("Ошибка:", error));
}

// Функция для обновления количества побед пользователя
// Принимает имя текущего пользователя
function updateWinsCount(currentUser) {
   // Получаем данные о победах с сервера
   fetch("http://localhost:3000/wins")
      .then((response) => response.json())
      .then((data) => {
         // Проверяем, есть ли данные о победах для текущего пользователя
         const userWins = data.find((win) => win.username === currentUser);
         if (userWins) {
            // Если есть данные о победах, получаем текущее количество побед
            const currentWinsCount = userWins.winsCount;
            // Увеличиваем количество побед для текущего пользователя на 1 и вызываем функцию обновления побед
            updateWins(currentUser, currentWinsCount + 1);
         } else {
            // Если у пользователя отсутствуют данные о победах, создаем новую запись
            fetch("http://localhost:3000/wins", {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify({ username: currentUser, winsCount: 1 }),
            })
               .then((response) => {
                  if (response.ok) {
                     console.log("Победа зарегистрирована");
                  } else {
                     console.error("Ошибка при регистрации победы");
                  }
               })
               .catch((error) => console.error("Ошибка:", error));
         }
      })
      .catch((error) => console.error("Ошибка:", error));
}

// Функция вызывается при победе игрока
function win() {
   // Останавливаем таймер
   clearInterval(timerActive);
   // Отображаем сообщение о победе и меняем стиль элементов на экране
   document.querySelector(".field-lose").style.display = "flex";
   document.querySelector(".field-area").style.border = "5px solid rgb(14, 184, 57)";
   document.querySelector(".field-lose").style.background = "rgb(14, 184, 57)";
   document.querySelector(".field-lose > button").style.color = "rgb(14, 184, 57)";
   document.querySelector(".field-lose > p").textContent = "You win";
   bombActive = true;

   // Получаем имя пользователя через аутентификацию (здесь должно быть получение имени пользователя через аутентификацию)
   const currentUser = username;
   // Вызываем функцию обновления количества побед для текущего пользователя
   updateWinsCount(currentUser);
}

// Функция для обработки события проигрыша в игре
function gameover() {
   // Проверяем, был ли первый клик на мину или нет, и устанавливаем соответствующее сообщение
   if (loseFirstClick == false) {
      document.querySelector(".field-lose > p").textContent = "Game over";
   } else {
      document.querySelector(".field-lose > p").textContent = "Ops.. Bomb..";
   }
   // Отображаем все мины на поле
   document.querySelectorAll(".block.hide.bomb").forEach((item) => {
      item.classList.add("bombActive");
   });
   bombActive = true;
   // Изменяем стиль элементов на экране при проигрыше
   document.querySelector(".field-lose").style.display = "flex";
   document.querySelector(".field-lose").style.background = "rgb(192, 53, 53)";
   document.querySelector(".field-lose > button").style.color = "rgb(192, 53, 53)";
   document.querySelector(".field-area").style.border = "5px solid rgb(192, 53, 53)";
   clearInterval(timerActive);
}

// Функция вызывается при клике на ячейку поля
function leftClick(item) {
   // Проверяем, установлен ли флаг на ячейку, и выполняем действия только если флаг не установлен
   if (item.dataset["flag"] == "false") {
      // Перегенерируем расположение мин, если это необходимо
      if (regenBombs == false) {
         updateBombs();
      }
      // Проверяем, был ли это первый клик в игре и обрабатываем соответствующие действия
      if (firstclick == false && item.classList.value != "field-area") {
         // Проверяем, попал ли первый клик на мину и устанавливаем флаг для этого случая
         if (item.classList.value == "block hide bomb") {
            loseFirstClick = true;
         }
         firstclick = true;
         checkBomb(item);
         timer();
      } else if (firstclick == true && item.classList.value != "field-area") {
         checkBomb(item);
      }
      // Уменьшаем счетчик закрытых ячеек, если текущая ячейка была закрыта
      if (item.classList.value == "block hide" && firstclick != false) {
         valueCell--;
      }
      item.classList.remove("hide");
      // Проверяем, была ли открыта ячейка с миной и вызываем функцию проигрыша
      if (item.classList == "block bomb") {
         item.classList.add("bombActive");
         gameover(item);
      }
      // Проверяем, выполнены ли условия для победы и вызываем функцию победы
      if (valueCell == 0 || remainingBobmbs == 0) {
         win();
      }
   }
}

function rightClick(item) {
   firstclick = true; // Устанавливаем флаг первого клика в true
   // Проверяем, установлен ли флаг на ячейку и есть ли доступные флаги, а также проверяем, что ячейка не является открытой
   if (item.dataset["flag"] == "false" && flags > 0 && item.classList.value != "block") {
      // Проверяем, является ли данная ячейка миной, и если да, уменьшаем счетчик оставшихся мин
      if (item.classList.value == "block hide bomb") {
         remainingBobmbs--;
      }
      item.dataset["flag"] = "true"; // Устанавливаем флаг на ячейку
      flags--; // Уменьшаем количество доступных флагов
      kolBomb--; // Уменьшаем количество оставшихся мин
      document.querySelector(".information-value-miens > span").textContent = kolBomb; // Обновляем отображение количества оставшихся мин
   } else if (item.dataset["flag"] == "true" && flags >= 0 && item.classList.value != "block") {
      // Проверяем, является ли данная ячейка миной, и если да, увеличиваем счетчик оставшихся мин
      if (item.classList.value == "block hide bomb") {
         remainingBobmbs++;
      }
      item.dataset["flag"] = "false"; // Снимаем флаг с ячейки
      flags++; // Увеличиваем количество доступных флагов
      kolBomb++; // Увеличиваем количество оставшихся мин
      document.querySelector(".information-value-miens > span").textContent = kolBomb; // Обновляем отображение количества оставшихся мин
   }
   // Проверяем, выполнены ли условия для победы и вызываем функцию победы
   if (valueCell == 0 || remainingBobmbs == 0) {
      win();
   }
}

// Функция обрабатывает клики мышкой
function clickMouse(item, event) {
   // Левый клик
   if (event.button == 0 && bombActive == false) {
      leftClick(item); // Вызываем функцию обработки левого клика
   }
   // Правый клик
   if (event.button == 2 && bombActive == false && firstclick == true) {
      rightClick(item); // Вызываем функцию обработки правого клика
   }

   regenBombs = true; // Перестаем регенерировать бомбы
}

// Обработка нажатия клавиш на клавиатуре
document.addEventListener("keydown", (elem) => {
   if (elem.code == "KeyR") {
      restar(); // При нажатии клавиши R вызываем функцию перезапуска игры
   }
   if (elem.code == "Escape") {
      window.location.href = "index.html"; // При нажатии клавиши Esc перенаправляем на главную страницу
   }
});
