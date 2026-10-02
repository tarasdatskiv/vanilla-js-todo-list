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

if (savedTasks) {
    taskList.innerHTML = savedTasks;
}

function saveTasks() {
    localStorage.setItem('tasks', taskList.innerHTML);
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
    const inputValue = input.value;
    const selectedPriority = document.querySelector(
        '.task-form__priority.selected'
    ).dataset.priority;

    const html = `
  <li><span class="circle circle--${selectedPriority}"></span> <button class="task-item__check" type="button"
                    aria-label="Позначити виконаним">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 13l4 4L19 7" stroke="white" stroke-width="2.5" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </button>${inputValue}<button class="task-item__delete" type="button"
                    aria-label="Видалити завдання">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.5"
                            stroke-linecap="round" />
                    </svg>
                </button></li>
    `;
    taskList.innerHTML += html;
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
