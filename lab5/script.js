// Класс для обработки данных пользователя
class UserData {
    // Загрузка базы данных из хранилища браузера или создание пустого массива
    static database = JSON.parse(localStorage.getItem('usersDB')) || [];

    constructor(login, password) {
        this.login = login;
        this.password = password;
        
        // Добавление логина в базу (пароли в открытом виде в хранилище лучше не класть)
        UserData.database.push({ login: this.login });
        
        // Сохранение обновленного списка в LocalStorage
        localStorage.setItem('usersDB', JSON.stringify(UserData.database));
    }

    printData() {
        console.log("=== Локальный объект пользователя создан ===");
        console.log(`Логин: ${this.login}`);
        console.log(`Пароль: ${this.password}`);
        console.log("============================================");
    }

    // Проверка существования пользователя в базе
    static isUserExists(loginToCheck) {
        return UserData.database.some(user => user.login === loginToCheck);
    }
}

// Динамическая валидация
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

// Элементы для вывода текстовых подсказок
const usernameError = document.getElementById('usernameError');
const passwordError = document.getElementById('passwordError');

if (usernameInput && passwordInput) {
    // Проверка логина при вводе
    usernameInput.addEventListener('input', () => {
        if (usernameInput.value.length > 0 && usernameInput.value.length < 3) {
            usernameError.textContent = "Логин слишком короткий (минимум 3 символа)";
            usernameError.style.color = "red";
        } else {
            usernameError.textContent = "";
        }
    });

    // Проверка пароля при вводе
    passwordInput.addEventListener('input', () => {
        if (passwordInput.value.length > 0 && passwordInput.value.length < 6) {
            passwordError.textContent = "Пароль должен быть не менее 6 символов";
            passwordError.style.color = "red";
        } else {
            passwordError.textContent = "";
        }
    });
}

let i = 0;

// Отправка формы и post-запроса
if (loginForm) {
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // отмена перезагрузки страницы

        const loginValue = usernameInput.value;
        const passwordValue = passwordInput.value;

        // Финальная проверка перед отправкой
        if (loginValue.length < 3 || passwordValue.length < 6) {
            alert("Пожалуйста, исправьте ошибки в полях ввода!");
            return;
        }

        // Проверка уникальности в локальной базе
        if (UserData.isUserExists(loginValue)) {
            alert(`Ошибка! Пользователь "${loginValue}" уже авторизован.`);
            return;
        }

        // Создание объекта класса (данные сохранятся в хранилище)
        const newUser = new UserData(loginValue, passwordValue);
        newUser.printData();

        // Асинхронная отправка данных на сервер (POST)
        try {
            const response = await fetch('https://httpbin.org/post', {
                method: 'POST',
                body: JSON.stringify({
                    username: loginValue,
                    password: passwordValue,
                    userId: i++
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });
            
            if (response.ok) {
                const result = await response.json();
                alert("Успешно! Данные отправлены на сервер (POST запрос выполнен)");
                console.log("Ответ от сервера:", result);
            } else {
                throw new Error("Ошибка сервера при POST-запросе");
            }
        } catch (error) {
            console.error("Ошибка при отправке данных:", error);
            alert("Не удалось отправить данные на сервер.");
        }
    });
}

// Отображение списка авторизованных пользователей
function displayAuthorizedUsers() {
    const listElement = document.getElementById('authorizedUsersList');
    
    // Если на этой странице нет элемента списка, выход
    if (!listElement) return;

    const users = UserData.database;
    
    if (users.length > 0) {
        listElement.innerHTML = ''; // Очистка заглушки
        users.forEach(user => {
            const li = document.createElement('li');
            li.textContent = `👤 ${user.login}`;
            li.style.borderBottom = "1px solid #ddd";
            li.style.padding = "5px 0";
            listElement.appendChild(li);
        });
    }
}

// Кнопка очистки списка пользователей
const clearBtn = document.getElementById('clearUsers');
if (clearBtn) {
    clearBtn.addEventListener('click', () => {
        localStorage.removeItem('usersDB');
        location.reload();
    });
}

// Асинхронное получение данных для таблицы
async function loadTableData() {
    const tableBody = document.getElementById('updatesBody');
    const statusText = document.getElementById('loaderStatus');

    // Если на этой странице нет таблицы, просто выход
    if (!tableBody) return;

    if (statusText) statusText.textContent = "Обновление данных...";

    try {
        // Запрос к локальному файлу db.json
        const response = await fetch('db.json');
        
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const data = await response.json();
        
        // Очистка таблицы перед заполнением
        tableBody.innerHTML = '';

        // Заполнение таблицы данными из JSON
        data.updates.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.time}</td>
                <td>${item.status}</td>
            `;
            tableBody.appendChild(row);
        });

        if (statusText) {
            statusText.textContent = `Последнее обновление: ${new Date().toLocaleTimeString()}`;
            statusText.style.color = "green";
        }

    } catch (error) {
        console.error("Ошибка при получении данных таблицы:", error);
        if (statusText) {
            statusText.textContent = "Ошибка загрузки: " + error.message;
            statusText.style.color = "red";
        }
    }
}

// Вызов функций при загрузке скрипта
displayAuthorizedUsers();
loadTableData();

// Периодическое обновление таблицы (раз в 5 минут)
setInterval(loadTableData, 300000);