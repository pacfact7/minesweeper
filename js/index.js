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

function ExitSite() {
   // Сохранение настроек в локальное хранилище перед выходом
   localStorage.setItem(
      "settings",
      JSON.stringify({
         valueBomb: setting.valueBomb, // Сохранение значения переменной "valueBomb"
         area: setting.area, // Сохранение значения переменной "area"
         valueMusic: MusicInBackground.currentTime, // Сохранение текущего времени музыки
      })
   );
}
