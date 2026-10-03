const form = document.querySelector('.new-task-form')
const input = document.querySelector('.task-form__input')
const taskList = document.querySelector('.tasks-list')
const deleteButton = document.querySelector('.tasks-list');
const priorityButtons = document.querySelectorAll('.task-form__priority');
const clearTasksButton = document.querySelector('.clear-tasks');
const allFilterButton = document.querySelector('.task-filters__all');
const activeFilterButton = document.querySelector('.task-filters__active');
const doneFilterButton = document.querySelector('.task-filters__done');
let currentFilter = 'all';

const savedTasks = localStorage.getItem('tasks');

function createTask(text, priority = 'low', checked = false) {
    const task = document.createElement('li');
    const circle = document.createElement('span');
    const safePriority = ['low', 'medium', 'high'].includes(priority) ? priority : 'low';
    circle.className = `circle circle--${safePriority}`;

    // Only trusted, fixed button markup is cloned from the initial task.
    const checkButton = taskButtonTemplates.check.cloneNode(true);
    const deleteButton = taskButtonTemplates.delete.cloneNode(true);
    task.classList.toggle('checked', checked === true);
    checkButton.classList.toggle('checked', checked === true);
    task.append(circle, checkButton, document.createTextNode(text), deleteButton);
    taskList.append(task);
}

const taskButtonTemplates = {
    check: taskList.querySelector('.task-item__check').cloneNode(true),
    delete: taskList.querySelector('.task-item__delete').cloneNode(true),
};

if (savedTasks !== null) {
    taskList.replaceChildren();
    let tasks;
    try {
        tasks = JSON.parse(savedTasks);
    } catch {
        // Migrate old HTML in an inert template, without inserting it into the page.
        const legacy = document.createElement('template');
        legacy.innerHTML = savedTasks;
        tasks = Array.from(legacy.content.querySelectorAll('li'), (task) => ({
            text: Array.from(task.childNodes)
                .filter((node) => node.nodeType === Node.TEXT_NODE)
                .map((node) => node.textContent).join('').trim(),
            priority: ['low', 'medium', 'high'].find((priority) =>
                task.querySelector(`.circle--${priority}`)) || 'low',
            checked: task.classList.contains('checked'),
        }));
    }
    if (Array.isArray(tasks)) {
        tasks.forEach((task) => {
            if (task && typeof task.text === 'string') {
                createTask(task.text, task.priority, task.checked);
            }
        });
    }
    saveTasks();
}

function saveTasks() {
    const tasks = Array.from(taskList.children, (task) => ({
        text: Array.from(task.childNodes)
            .filter((node) => node.nodeType === Node.TEXT_NODE)
            .map((node) => node.textContent).join('').trim(),
        priority: ['low', 'medium', 'high'].find((priority) =>
            task.querySelector(`.circle--${priority}`)) || 'low',
        checked: task.classList.contains('checked'),
    }));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTasksCounter() {
    const allTasks = document.querySelectorAll('.tasks-list li');
    const activeTasks = document.querySelectorAll('.tasks-list li:not(.checked)');
    const doneTasks = document.querySelectorAll('.tasks-list li.checked');

    document.querySelector('.header__tasks').textContent =
        `${activeTasks.length} tasks remaining`;

    allFilterButton.textContent = `All (${allTasks.length})`;
    activeFilterButton.textContent = `Active (${activeTasks.length})`;
    doneFilterButton.textContent = `Done (${doneTasks.length})`;

    allFilterButton.classList.toggle(
        'task-filters__button--selected',
        currentFilter === 'all'
    );
    activeFilterButton.classList.toggle(
        'task-filters__button--selected',
        currentFilter === 'active'
    );
    doneFilterButton.classList.toggle(
        'task-filters__button--selected',
        currentFilter === 'done'
    );

    allTasks.forEach((task) => {
        const isDone = task.classList.contains('checked');

        task.hidden =
            (currentFilter === 'active' && isDone) ||
            (currentFilter === 'done' && !isDone);
    });
}

form.addEventListener('submit', function (event) {
    event.preventDefault();
    const inputValue = input.value.trim();
    if (!inputValue) return;
    const selectedPriority = document.querySelector(
        '.task-form__priority.selected'
    ).dataset.priority;

    createTask(inputValue, selectedPriority);
    saveTasks();
    updateTasksCounter();

})



priorityButtons.forEach(function (button) {
    button.addEventListener('click', function () {

        const selectedButton = document.querySelector('.selected');

        if (selectedButton) {
            selectedButton.classList.remove('selected');
        }

        button.classList.add('selected');
    });
});

document.querySelector('.tasks-list').addEventListener('click', (event) => {


    const checkButton = event.target.closest('.task-item__check');
    if (!checkButton) return;
    checkButton.classList.toggle('checked');

    const taskItem = checkButton.closest('li');
    taskItem.classList.toggle('checked');
    saveTasks();
    updateTasksCounter();
});


taskList.addEventListener("click", (event) => {
    if (event.target.closest(".task-item__delete")) {
        const li = event.target.closest("li");
        li.remove();
        saveTasks();
        updateTasksCounter();
    }
});

clearTasksButton.addEventListener('click', () => {
    const completedTasks = document.querySelectorAll('.tasks-list li.checked');

    completedTasks.forEach((task) => {
        task.remove();
    });

    saveTasks();
    updateTasksCounter();
});

allFilterButton.addEventListener('click', () => {
    currentFilter = 'all';
    updateTasksCounter();
});

activeFilterButton.addEventListener('click', () => {
    currentFilter = 'active';
    updateTasksCounter();
});

doneFilterButton.addEventListener('click', () => {
    currentFilter = 'done';
    updateTasksCounter();
});

updateTasksCounter();
