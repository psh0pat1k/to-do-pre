let items = [
    "Сделать проектную работу",
    "Полить цветы",
    "Пройти туториал по Реакту",
    "Сделать фронт для своего проекта",
    "Прогуляться по улице в солнечный день",
    "Помыть посуду",
];

const listElement = document.querySelector(".to-do__list");
const formElement = document.querySelector(".to-do__form");
const inputElement = document.querySelector(".to-do__input");

function loadTasks() {
    // Проверяем, есть ли сохраненные задачи в локальном хранилище
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        // Если есть - возвращаем их
        return JSON.parse(savedTasks);
    } else {
        // Если нет - возвращаем стандартный список
        return items;
    }
}

function createItem(item) {
    const template = document.getElementById("to-do__item-template");
    const clone = template.content.querySelector(".to-do__item").cloneNode(true);
    const textElement = clone.querySelector(".to-do__item-text");
    const deleteButton = clone.querySelector(".to-do__item-button_type_delete");
    const duplicateButton = clone.querySelector(".to-do__item-button_type_duplicate");
    const editButton = clone.querySelector(".to-do__item-button_type_edit");
    
    // Устанавливаем текст задачи
    textElement.textContent = item;
    
    // Обработчик для кнопки удаления
    deleteButton.addEventListener('click', () => {
        clone.remove();
        items = getTasksFromDOM();
        saveTasks(items);
    });
    
    // Обработчик для кнопки копирования
    duplicateButton.addEventListener('click', () => {
        const itemName = textElement.textContent;
        const newItem = createItem(itemName);
        listElement.prepend(newItem);
        
        items = getTasksFromDOM();
        saveTasks(items);
    });
    
    // Обработчик для кнопки редактирования
    editButton.addEventListener('click', () => {
        textElement.setAttribute('contenteditable', 'true');
        textElement.focus();
    });
    
    // Обработчик для потери фокуса при редактировании
    textElement.addEventListener('blur', () => {
        textElement.setAttribute('contenteditable', 'false');
        items = getTasksFromDOM();
        saveTasks(items);
    });
    
    // Обработчик для сохранения по нажатию Enter при редактировании
    textElement.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            textElement.setAttribute('contenteditable', 'false');
            items = getTasksFromDOM();
            saveTasks(items);
        }
    });
    
    return clone;
}

function getTasksFromDOM() {
    // Находим все элементы с текстом задач
    const itemsNamesElements = listElement.querySelectorAll(".to-do__item-text");
    const tasks = [];
    
    // Собираем тексты задач в массив
    itemsNamesElements.forEach(element => {
        tasks.push(element.textContent);
    });
    
    return tasks;
}

function saveTasks(tasks) {
    // Сохраняем задачи в локальное хранилище
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Загружаем задачи при старте
items = loadTasks();

// Отображаем задачи на странице
items.forEach(item => {
    const taskElement = createItem(item);
    listElement.append(taskElement);
});

// Обработчик отправки формы
formElement.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Получаем текст из поля ввода
    const taskText = inputElement.value.trim();
    
    // Проверяем, что поле не пустое
    if (taskText) {
        // Создаем элемент задачи
        const taskElement = createItem(taskText);
        
        // Добавляем задачу в начало списка
        listElement.prepend(taskElement);
        
        // Сохраняем обновленный список задач
        items = getTasksFromDOM();
        saveTasks(items);
        
        // Очищаем поле ввода
        inputElement.value = '';
    }
});