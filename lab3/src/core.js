/**
 * Напишите функцию, которая проверяет, является ли число целым используя побитовые операторы
 */
function isInteger(n) {
    return (n | 0) === n;
}

/**
 * Напишите функцию, которая возвращает массив четных чисел от 2 до 20 включительно
 */
function even() {
    const arr = [];
    for (let i = 2; i <= 20; i += 2) {
        arr.push(i);
    }
    return arr;
}

/**
 * Напишите функцию, считающую сумму чисел до заданного используя цикл
 */
function sumTo(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}

/**
 * Напишите функцию, считающую сумму чисел до заданного используя рекурсию
 */
function recSumTo(n) {
    if (n === 1) return 1;
    return n + recSumTo(n - 1);
}

/**
 * Напишите функцию, считающую факториал заданного числа
 */
function factorial(n) {
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
}

/**
 * Напишите функцию, которая определяет, является ли число двойкой, возведенной в степень
 */
function isBinary(n) {
    return n > 0 && (n & (n - 1)) === 0;
}

/**
 * Напишите функцию, которая находит N-е число Фибоначчи
 */
function fibonacci(n) {
    if (n <= 2) return 1;

    let a = 1; // F(1)
    let b = 1; // F(2)

    for (let i = 3; i <= n; i++) {
        const c = a + b;
        a = b;
        b = c;
    }

    return b;
}

/** Напишите функцию, которая принимает начальное значение и функцию операции
 * и возвращает функцию - выполняющую эту операцию.
 * Если функция операции (operatorFn) не задана - по умолчанию всегда
 * возвращается начальное значение (initialValue)
 * @param initialValue
 * @param operatorFn - (storedValue, newValue) => {operation}
 * @example
 * const sumFn =  getOperationFn(10, (a,b) => a + b);
 * console.log(sumFn(5)) - 15
 * console.log(sumFn(3)) - 18
 */
function getOperationFn(initialValue, operatorFn) {
    let storedValue = initialValue;

    return newValue => 
        typeof operatorFn === "function" 
        ? (storedValue = operatorFn(storedValue, newValue))
        : storedValue;
}

/**
 * Напишите функцию создания генератора арифметической последовательности.
 * При ее вызове, она возвращает новую функцию генератор - generator().
 * Каждый вызов функции генератора возвращает следующий элемент последовательности.
 * Если начальное значение не передано, то оно равно 0.
 * Если шаг не указан, то по дефолту он равен 1.
 * Генераторов можно создать сколько угодно - они все независимые.
 */
function sequence(start = 0, step = 1) {
    let current = start;

    return function () {
    const result = current;
    current += step;
    return result;
    };
}

/**
 * Напишите функцию deepEqual, которая принимает два значения
 * и возвращает true только в том случае, если они имеют одинаковое значение
 * или являются объектами с одинаковыми свойствами,
 * значения которых также равны при сравнении с рекурсивным вызовом deepEqual.
 * Учитывать специфичные объекты(такие как Date, RegExp и т.п.) не обязательно
 *
 * @param {object} firstObject - первый объект
 * @param {object} secondObject - второй объект
 * @returns {boolean} - true если объекты равны(по содержанию) иначе false
 * @example
 * deepEqual({arr: [22, 33], text: 'text'}, {arr: [22, 33], text: 'text'}) // true
 * deepEqual({arr: [22, 33], text: 'text'}, {arr: [22, 3], text: 'text2'}) // false
 */
function deepEqual(firstObject, secondObject) {
    // Обработка особых случаев
    if (Number.isNaN(firstObject) && Number.isNaN(secondObject)) {
    return true;
}
    if (firstObject === secondObject) return true;

    // Gроверка на тип и пустоту
    if (
        typeof firstObject !== 'object' || firstObject === null ||
        typeof secondObject !== 'object' || secondObject === null
    ) 
    {
        return false;
    }

    // Получение ключей объектов
    const keys1 = Object.keys(firstObject);
    const keys2 = Object.keys(secondObject);

    // Обработка разного количества ключей
    if (keys1.length !== keys2.length) return false;

    // Проверка каждого ключа
    for (let key of keys1) {
        if (!keys2.includes(key)) return false;

        if (!deepEqual(firstObject[key], secondObject[key])) return false;
    }

    return true;
}

module.exports = {
    isInteger,
    even,
    sumTo,
    recSumTo,
    factorial,
    isBinary,
    fibonacci,
    getOperationFn,
    sequence,
    deepEqual,
};
