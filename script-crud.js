const taskListContainer = document.querySelector('.app__section-task-list');
const formTask = document.querySelector('.app__form-add-task');
const toggleFormTaskBtn = document.querySelector('.app__button--add-task');
const formLabel = document.querySelector('.app__form-label');
const textarea = document.querySelector('.app__form-textarea');
const cancelFormTaskBtn = document.querySelector('.app__form-footer__button--cancel');
const btnCancelar = document.querySelector('.app__form-footer__button--cancel');
const localStorageTasks = localStorage.getItem('tasks');
const taskActiveDescription = document.querySelector('.app__section-active-task-description');
const btnDeletar = document.querySelector('.app__form-footer__button--delete');
const btnDeletarConcluidas = document.querySelector('#btn-remover-concluidas');
const btnDeletarTodas = document.querySelector('#btn-remover-todas');

let tasks = localStorageTasks ? JSON.parse(localStorageTasks) : [];
let taskSelected = null;
let itemTaskSelected = null;
let taskEdition = null;
let paragraphEdition = null;

const taskSelect = (task, element) => {
    if (task.concluida) {
        return;
    }

    document.querySelectorAll('.app__section-task-list-item-active').forEach(function (button) {
        button.classList.remove('app__section-task-list-item-active');
    });

    if (taskSelect == task) {
        taskActiveDescription.textContent = null;
        itemTaskSelected = null;
        taskSelected = null;
        return;
    }
    
    taskSelected = task;
    itemTaskSelected = element;
    taskActiveDescription.textContent = task.descricao;
    element.classList.add('app__section-task-list-item-active');
}

const clearForm = () => {
    taskEdition = null;
    paragraphEdition = null;
    textarea.value = '';
    formTask.classList.add('hidden');
}

const selectTaskForEdition = (task, element) => {
    if (taskEdition == task) {
        clearForm();
        return;
    }
    formLabel.textContent = 'Editando tarefa';
    taskEdition = task;
    paragraphEdition = element;
    textarea.value = task.descricao;
    formTask.classList.remove('hidden');
}

cancelFormTaskBtn.addEventListener('click', () => {
    formTask.classList.add('hidden');
});

btnCancelar.addEventListener('click', clearForm);

const taskIconSvg = `
<svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24"
    fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#FFF" />
    <path
        d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
        fill="#01080E" />
</svg>
`;

function createTask(task) {
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');
    const svgIcon = document.createElement('svg');
    svgIcon.innerHTML = taskIconSvg;
    const paragraph = document.createElement('p');
    paragraph.classList.add('app__section-task-list-item-description');
    paragraph.textContent = task.descricao;
    const button = document.createElement('button');
    button.classList.add('app_button-edit');
    const editIcon = document.createElement('img');
    editIcon.setAttribute('src', '/imagens/edit.png');
    li.onclick = () => {
        taskSelect(task, li);
    }
    svgIcon.addEventListener('click', (event) => {
        if (task == taskSelected) {
            event.stopPropagation()
            button.setAttribute('disabled', true)
            li.classList.add('app__section-task-list-item-complete')
            taskSelected.concluida = true
            updateLocalStorage()
        }
    });
    if (task.concluida) {
        button.setAttribute('disabled', true);
        li.classList.add('app__section-task-list-item-complete');
    }
    li.appendChild(svgIcon);
    li.appendChild(paragraph);
    li.appendChild(button);
    button.appendChild(editIcon);
    button.addEventListener('click', (event) => {
        event.stopPropagation();
        selectTaskForEdition(task, paragraph);
    });
    return li;
}

tasks.forEach(task => {
    const taskItem = createTask(task);
    taskListContainer.appendChild(taskItem);
});

toggleFormTaskBtn.addEventListener('click', () => {
    formLabel.textContent = 'Adicionando tarefa';
    formTask.classList.toggle('hidden');
});

const updateLocalStorage = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

const removeTasks = (somenteConcluidas) => {
    const seletor = somenteConcluidas ? '.app__section-task-list-item-complete' : '.app__section-task-list-item'
    document.querySelectorAll(seletor).forEach((element) => {
        element.remove();
    });
    tasks = somenteConcluidas ? tasks.filter(t => !t.concluida) : []
    updateLocalStorage()
}

formTask.addEventListener('submit', (evento) => {
    evento.preventDefault();
    if (taskEdition) {
        taskEdition.descricao = textarea.value;
        paragraphEdition.textContent = textarea.value;
    } else {
        const task = {
            descricao: textarea.value,
            concluida: false
        }
        tasks.push(task);
        const taskItem = createTask(task);
        taskListContainer.appendChild(taskItem);
    }
    updateLocalStorage();
    clearForm();
});

btnDeletarConcluidas.addEventListener('click', () => removeTasks(true));
btnDeletarTodas.addEventListener('click', () => removeTasks(false));

document.addEventListener('TarefaFinalizada', function (e) {
    if (taskSelected) {
        taskSelected.concluida = true;
        itemTaskSelected.classList.add('app__section-task-list-item-complete');
        itemTaskSelected.querySelector('button').setAttribute('disabled', true);
        updateLocalStorage();
    }
});