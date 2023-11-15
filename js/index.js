const MusicInBackground = new Audio('../saper/css/music/index.mp3');

if (!localStorage.getItem('settings')) {
      localStorage.setItem('settings', JSON.stringify({
            valueBomb: 1,
            area: 5,
            valueMusic: 0
      }))
}

var setting = JSON.parse(localStorage.getItem('settings'));
if (setting.valueMusic >= 199) {
      valueMusic = 0;
}
MusicInBackground.currentTime = setting.valueMusic;
MusicInBackground.play();

function ExitSite() {
      localStorage.setItem('settings', JSON.stringify({
            valueBomb: setting.valueBomb,
            area: setting.area,
            valueMusic: MusicInBackground.currentTime
      }))
}


let username;
let password;

document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    username = document.getElementById('registerUsername').value;
    password = document.getElementById('registerPassword').value;

    fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // Hide the form after successful registration
        document.querySelector('.main__data').style.display = 'none';
    })
    .catch(error => console.log('Error:', error));
});

document.getElementById('loginForm').addEventListener('submit', function(e) {
      e.preventDefault();
      username = document.getElementById('loginUsername').value;
      password = document.getElementById('loginPassword').value;
  
      fetch(`http://localhost:3000/users?username=${username}&password=${password}`)
      .then(response => {
          if (!response.ok) {
              throw new Error('Сетевой ответ не был успешным');
          }
          return response.json();
      })
      .then(data => {
          console.log(data); // Отладочное сообщение
          if (data && data.length > 0) {
              // Пользователь найден, выполняем вход
              console.log('Вход выполнен успешно');
              // Скрыть форму после успешного входа
              document.querySelector('.main__data').style.display = 'none';
          } else {
              console.log('Неверное имя пользователя или пароль');
          }
      })
      .catch(error => console.error('Ошибка:', error));
  });