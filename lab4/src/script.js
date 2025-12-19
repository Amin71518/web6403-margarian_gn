// 1. Создание класса (ООП)
class UserData {
    // общий массив для хранения экземпляров
    static database = [];

    // Конструктор: создает объект на основе переданных данных
    constructor(login, password, isAgreed) {
        this.login = login;
        this.password = password;

        UserData.database.push(this);
    }

    // Метод форматированного вывода в консоль
    printData() {
        console.log("=== Запрос об авторизации ===");
        console.log(`Логин пользователя: ${this.login}`);
        console.log(`Пароль пользователя: ${this.password}`);
        console.log("=============================");
    }

    // проверка на повтореный вход одного пользователя
    static isUserExists(loginToCheck) {
        return UserData.database.some(user => user.login === loginToCheck);
    }
}

// Поиск формы ввода из html по его id
const loginForm = document.getElementById('loginForm');

//  Cлушатель события 'submit' - нажатия кнопки Войти в форме ввода loginForm
loginForm.addEventListener('submit', function(event) {
    // Отмена перезагрузки страницы - данные из полей не стираются, консоль не стирается
    event.preventDefault();

    // Получение значений из полей ввода по id элементов html
    const loginValue = document.getElementById('username').value;
    const passwordValue = document.getElementById('password').value;

    if (UserData.isUserExists(loginValue)) {
        alert(`Ошибка! Пользователь с логином "${loginValue}" уже авторизован.`);
        
        // Очистка полей
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        
        return;
    }

    // Создание объекта класса
    const newUser = new UserData(loginValue, passwordValue);

    // Вызов метода вывода
    newUser.printData();
});