// Ждем загрузки всей страницы и элементов DOM
document.addEventListener('DOMContentLoaded', () => {

    // Получаем доступ к элементам DOM
    const taskList = document.getElementById('tasks'); // Список задач (ul)
    const form = document.getElementById('addNewEntryForm'); // Форма добавления новой задачи
    const descriptionInput = document.getElementById('descriptionEntry'); // Поле ввода описания задачи
    const dateInput = document.getElementById('dataEntry'); // Поле ввода даты
    const allTasksTab = document.getElementById('allTasks'); // Вкладка "Все задачи"
    const activeTasksTab = document.getElementById('activeTasks'); // Вкладка "Активные задачи"
    const completedTasksTab = document.getElementById('completedTasks'); // Вкладка "Завершенные задачи"

    // Инициализируем массив задач. Если в localStorage уже есть задачи, загружаем их, иначе создаем пустой массив
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Функция для сохранения массива задач в localStorage
    function saveTasksToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Функция для отображения задач на экране с возможностью фильтрации
    function renderTasks(filter = 'all') {
        taskList.innerHTML = ''; // Очищаем текущий список задач

        // Проходим по всем задачам и применяем фильтр
        tasks
            .filter(task => {
                // Если выбран фильтр "все", возвращаем все задачи
                if (filter === 'all') return true;
                // Если фильтр "активные", возвращаем только незавершенные задачи
                else if (filter === 'active') {
                    return !task.completed
                }
                // Оставшийся вариант - фильтр "завершенные", возвращаем только завершенные задачи
                else {
                    return task.completed
                }
            })
            // Отображаем отфильтрованные задачи
            .forEach((task, index) => {
                const li = document.createElement('li'); // Создаем новый элемент списка (li)
                li.classList.add('task-item'); // Добавляем класс для стилизации
                li.innerHTML = `
                    <label class="custom-checkbox">
                        <!-- Добавляем чекбокс для выполнения задачи -->
                        <input type="checkbox" ${task.completed ? 'checked' : ''} data-index="${index}">
                        <span></span>
                        <!-- Описание задачи. Если задача завершена, добавляем зачеркивание текста -->
                        <div>
                            <p>${task.date}</p>
                            <p ${task.completed ? 'style="text-decoration: line-through;"' : ''}>${task.description}</p>  
                        </div>
                    </label>
                `;
                taskList.appendChild(li); // Добавляем задачу в список
            });
    }

    // Функция для добавления новой задачи
    function addTask(description, date) {
        tasks.push({
            description: description, // Описание задачи
            date: date, // Дата задачи
            completed: false, // Задача по умолчанию считается незавершенной
        });
        saveTasksToLocalStorage(); // Сохраняем обновленный массив задач в localStorage
        renderTasks(); // Перерисовываем список задач
    }

    // Функция для переключения статуса выполнения задачи
    function toggleTaskCompletion(index) {
        tasks[index].completed = !tasks[index].completed; // Меняем статус завершенности задачи
        saveTasksToLocalStorage(); // Сохраняем изменения в localStorage
        renderTasks(); // Перерисовываем задачи
    }

    // Обрабатываем событие отправки формы для добавления новой задачи
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Предотвращаем перезагрузку страницы при отправке формы
        const description = descriptionInput.value; // Получаем значение поля описания
        const date = dateInput.value; // Получаем значение поля даты

        // Проверяем, что поля заполнены
        if (description && date) {
            addTask(description, date); // Добавляем новую задачу
            form.reset(); // Очищаем форму после добавления
        }
    });

    // Обрабатываем событие изменения состояния задачи (чекбокса)
    taskList.addEventListener('change', (e) => {
        if (e.target.matches('input[type="checkbox"]')) {
            const index = e.target.getAttribute('data-index'); // Получаем индекс задачи через атрибут data-index
            toggleTaskCompletion(index); // Меняем статус задачи (выполнено/невыполнено)
        }
    });

    // Обрабатываем переключение вкладки "Все задачи"
    allTasksTab.addEventListener('click', () => {
        renderTasks('all'); // Отображаем все задачи
        setActiveTab(allTasksTab); // Устанавливаем активную вкладку
    });

    // Обрабатываем переключение вкладки "Активные задачи"
    activeTasksTab.addEventListener('click', () => {
        renderTasks('active'); // Отображаем только активные задачи
        setActiveTab(activeTasksTab); // Устанавливаем активную вкладку
    });

    // Обрабатываем переключение вкладки "Завершенные задачи"
    completedTasksTab.addEventListener('click', () => {
        renderTasks('completed'); // Отображаем только завершенные задачи
        setActiveTab(completedTasksTab); // Устанавливаем активную вкладку
    });

    // Функция для выделения активной вкладки
    function setActiveTab(activeTab) {
        [allTasksTab, activeTasksTab, completedTasksTab].forEach(tab => tab.classList.remove('active')); // Убираем класс "active" у всех вкладок
        activeTab.classList.add('active'); // Добавляем класс "active" выбранной вкладке
    }

    // Изначально отображаем все задачи при загрузке страницы
    renderTasks();
});
