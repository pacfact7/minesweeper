// Создание HTML-элемента для ячейки игрового поля
const cellSpan = `<span oncontextmenu="return false" class="block"></span>`;

// Получение настроек из локального хранилища
var setting = JSON.parse(localStorage.getItem("settings"));

// Проверяем, есть ли уже значение в локальном хранилище
if (!setting) {
   // Если значения нет, устанавливаем значение по умолчанию
   var defaultSettings = {
      valueBomb: "3", // Значение по умолчанию для количества мин
      area: "8", // Значение по умолчанию для размера поля
   };
   localStorage.setItem("settings", JSON.stringify(defaultSettings));
   // После установки значения по умолчанию снова получаем его из локального хранилища
   setting = defaultSettings;
}

// Нахождение области игрового поля
var fieldClass = document.querySelector(".field-area");

// Получение элементов формы для настройки игры
var list = document.querySelector(".setting-game-list");
list.value = setting.area;
var valueMiens = document.querySelector(".settings-game__input");
valueMiens.setAttribute("max", `${Math.round((Number(list.value) * Number(list.value)) / 2)}`);
document.querySelector(".settings-game__text > span").textContent = setting.valueBomb;
valueMiens.value = setting.valueBomb;
var maxInput = document.getElementById("maxInput");
const button = document.querySelector(".settings-game__button");

// Инициализация переменных для хранения ячеек и идентификаторов
let cells = []; // Массив для хранения всех ячеек игрового поля
let idSpan = 20; // Начальное значение идентификатора для ячеек

// Функция для создания игрового поля
function FieldArea() {
   fieldClass.textContent = " "; // Очистка содержимого игрового поля
   fieldClass.style.gridTemplateRows = `repeat(${list.value}, 1fr)`; // Установка количества строк в сетке
   fieldClass.style.gridTemplateColumns = `repeat(${list.value}, 1fr)`; // Установка количества столбцов в сетке
   for (let i = 0; i < list.value * list.value; i++) {
      fieldClass.innerHTML = cellSpan + fieldClass.innerHTML; // Добавление ячеек в игровое поле
   }
   idSpan = 20; // Сброс значения идентификатора для следующего использования
   cells = document.querySelectorAll(".block"); // Получение всех ячеек игрового поля
   cells.forEach((elem) => {
      elem.id = idSpan; // Установка идентификаторов для ячеек
      idSpan++;
   });

   valueMiens.setAttribute("max", `${Math.round((Number(list.value) * Number(list.value)) / 2)}`); // Установка максимального значения поля "valueMiens"

   document.querySelector(".settings-game__text > span").textContent = valueMiens.value; // Установка текста для отображения количества мин на игровом поле
}

// Вызов функции для создания игрового поля
FieldArea();

// Функция для генерации массива случайных чисел в заданном диапазоне
function generateArrayRandomNumber(min, max) {
   var totalNumbers = max - min + 1,
      arrayTotalNumbers = [],
      arrayRandomNumbers = [],
      tempRandomNumber;

   // Создание массива чисел в указанном диапазоне
   while (totalNumbers--) {
      arrayTotalNumbers.push(totalNumbers + min);
   }

   // Перемешивание массива и получение случайного порядка чисел
   while (arrayTotalNumbers.length) {
      tempRandomNumber = Math.round(Math.random() * (arrayTotalNumbers.length - 1));
      arrayRandomNumbers.push(arrayTotalNumbers[tempRandomNumber]);
      arrayTotalNumbers.splice(tempRandomNumber, 1);
   }
   return arrayRandomNumbers;
}

// Функция для добавления бомб на игровое поле
function addBombs() {
   // Удаление класса 'bomb' у всех ячеек
   cells.forEach((elem) => {
      elem.classList.remove("bomb");
   });

   // Генерация случайных местоположений для мин и добавление им класса 'bomb'
   bombs = generateArrayRandomNumber(20, list.value * list.value + 20);
   for (let i = 0; i < valueMiens.value; i++) {
      cells.forEach((elem) => {
         if (elem.id == bombs[i]) {
            elem.classList.add("bomb");
         }
      });
   }
}

// Вызов функции добавления бомб при загрузке страницы
addBombs();

// Обновление отображаемого значения максимального количества мин при изменении размера поля
list.addEventListener("change", () => {
   maxInput.textContent = Math.round((Number(list.value) * Number(list.value)) / 2);
   FieldArea(); // Предполагается, что это другая функция для обновления игрового поля
   addBombs(); // Перегенерация мин при изменении размера поля
});

// Обновление отображаемого значения максимального количества мин при изменении количества мин
valueMiens.addEventListener("input", () => {
   maxInput.textContent = Math.round((Number(list.value) * Number(list.value)) / 2);
   document.querySelector(".settings-game__text > span").textContent = valueMiens.value;
   addBombs(); // Перегенерация мин при изменении количества мин
});

// Сохранение настроек игры в локальном хранилище при нажатии кнопки
button.addEventListener("click", () => {
   localStorage.setItem(
      "settings",
      JSON.stringify({
         valueBomb: valueMiens.value,
         area: list.value,
      })
   );
});

// Функция для сохранения настроек перед выходом со страницы
function ExitSite() {
   localStorage.setItem(
      "settings",
      JSON.stringify({
         valueBomb: setting.valueBomb,
         area: setting.area,
      })
   );
}