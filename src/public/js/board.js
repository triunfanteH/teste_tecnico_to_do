const modal = document.getElementById('task-modal');
const openBtn = document.getElementById('open-task-modal');
const closeBtn = document.querySelector('.close-btn');
const form = document.getElementById('create-task-form');
const boardContainer = document.querySelector('.board-container');

openBtn.onclick = () => modal.style.display = 'flex';
closeBtn.onclick = () => modal.style.display = 'none';
window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const columnId = data.column_id;
    const tasksInColumn = document.querySelectorAll(`.column[data-column-id="${columnId}"] .task-card`).length;
    data.position = tasksInColumn + 1;

    try {
        const response = await fetch('/api/v1/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const newTask = await response.json();
            addTaskCardToUI(newTask);
            modal.style.display = 'none';
            form.reset();
        } else {
            const errorData = await response.json();
            console.error('Erro ao criar tarefa:', errorData);
            alert('Não foi possível criar a tarefa. Verifique os dados.');
        }
    } catch (error) {
        console.error('Erro de rede:', error);
        alert('Erro de conexão. Tente novamente.');
    }
});

const addColumnBtn = document.getElementById('add-column-btn');
const addColumnForm = document.getElementById('add-column-form');
const saveColumnBtn = document.getElementById('save-column-btn');
const cancelColumnBtn = document.getElementById('cancel-column-btn');
const newColumnNameInput = document.getElementById('new-column-name');
const addColumnContainer = document.querySelector('.add-column-container');

addColumnBtn.addEventListener('click', () => {
    addColumnBtn.style.display = 'none';
    addColumnForm.style.display = 'block';
    newColumnNameInput.focus();
});

cancelColumnBtn.addEventListener('click', () => {
    addColumnForm.style.display = 'none';
    addColumnBtn.style.display = 'block';
    newColumnNameInput.value = '';
});

saveColumnBtn.addEventListener('click', async () => {
    const columnName = newColumnNameInput.value.trim();
    if (!columnName) return;

    const existingColumns = document.querySelectorAll('.column').length;
    const newPosition = existingColumns + 1;
    const data = { name: columnName, position: newPosition };

    try {
        const response = await fetch('/api/v1/columns', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const newColumn = await response.json();
            addColumnToUI(newColumn);
            addOptionToTaskModal(newColumn);
            addOptionToEditTaskModal(newColumn);
            cancelColumnBtn.click();
        } else {
            const errorData = await response.json();
            console.error('Erro ao criar coluna:', errorData);
            alert('Não foi possível criar a coluna.');
        }
    } catch (error) {
        console.error('Erro de rede:', error);
        alert('Erro de conexão ao criar coluna.');
    }
});

const editModal = document.getElementById('edit-task-modal');
const editForm = document.getElementById('edit-task-form');
const closeEditBtn = document.querySelector('.close-edit-btn');
const deleteTaskModalBtn = document.getElementById('delete-task-modal-btn');

closeEditBtn.onclick = () => editModal.style.display = 'none';
window.addEventListener('click', (event) => {
    if (event.target == editModal) {
        editModal.style.display = 'none';
    }
});

editForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const taskId = document.getElementById('edit-task-id').value;
    const formData = new FormData(editForm);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(`/api/v1/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const updatedTask = await response.json();
            updateTaskCardInUI(updatedTask);
            editModal.style.display = 'none';
        } else {
            console.error('Erro ao atualizar tarefa');
            alert('Não foi possível salvar as alterações.');
        }
    } catch (error) {
        console.error('Erro de rede:', error);
    }
});

deleteTaskModalBtn.addEventListener('click', async () => {
    const taskId = document.getElementById('edit-task-id').value;
    if (!confirm('Tem certeza que deseja excluir esta tarefa permanentemente?')) return;

    try {
        const response = await fetch(`/api/v1/tasks/${taskId}`, { method: 'DELETE', headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content') } });
        if (response.status === 204) {
            document.querySelector(`.task-card[data-task-id="${taskId}"]`).remove();
            editModal.style.display = 'none';
        } else {
            alert('Não foi possível excluir a tarefa.');
        }
    } catch (error) {
        console.error('Erro de rede:', error);
    }
});


boardContainer.addEventListener('click', async (event) => {
    const target = event.target;

    if (target.closest('.delete-column-btn')) {
        const columnElement = target.closest('.column');
        const columnId = columnElement.dataset.columnId;
        const taskCount = columnElement.querySelectorAll('.task-card').length;
        if (taskCount > 0) {
            alert('Por favor, remova ou mova todas as tarefas antes de excluir esta coluna.');
            return;
        }
        if (!confirm('Tem certeza que deseja excluir esta coluna?')) return;

        try {
            const response = await fetch(`/api/v1/columns/${columnId}`, { method: 'DELETE', headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content') } });
            if (response.status === 204) {
                columnElement.remove();
                removeOptionFromModals(columnId);
            } else {
                alert('Não foi possível excluir a coluna.');
            }
        } catch (error) {
            console.error('Erro ao excluir coluna:', error);
        }
    }

    else if (target.closest('.delete-task-btn')) {
        const taskCard = target.closest('.task-card');
        const taskId = taskCard.dataset.taskId;
        if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;

        try {
            const response = await fetch(`/api/v1/tasks/${taskId}`, { method: 'DELETE', headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content') } });
            if (response.status === 204) {
                taskCard.remove();
            } else {
                alert('Não foi possível excluir a tarefa.');
            }
        } catch (error) {
            console.error('Erro ao excluir tarefa:', error);
        }
    }

    else if (target.tagName === 'H2' && target.closest('.column-header')) {
        const h2 = target;
        const columnHeader = h2.parentElement;
        const originalName = h2.textContent;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = originalName;
        input.className = 'editing-input';
        columnHeader.replaceChild(input, h2);
        input.focus();

        const finishEditing = async () => {
            const newName = input.value.trim();
            const columnElement = input.closest('.column');
            const columnId = columnElement.dataset.columnId;

            if (!newName || newName === originalName) {
                columnHeader.replaceChild(h2, input);
                return;
            }

            try {
                const response = await fetch(`/api/v1/columns/${columnId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content') },
                    body: JSON.stringify({ name: newName })
                });

                if (response.ok) {
                    const updatedColumn = await response.json();
                    h2.textContent = updatedColumn.name;
                    updateColumnOptionInModals(updatedColumn);
                } else {
                    alert('Não foi possível renomear a coluna.');
                }
            } catch (error) {
                console.error('Erro ao renomear a coluna:', error);
            } finally {
                columnHeader.replaceChild(h2, input);
            }
        };

        input.addEventListener('blur', finishEditing, { once: true });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') input.blur();
            else if (e.key === 'Escape') {
                input.value = originalName;
                input.blur();
            }
        });
    }

    else if (target.closest('.task-card')) {
        const taskCard = target.closest('.task-card');
        const taskId = taskCard.dataset.taskId;

        try {
            const response = await fetch(`/api/v1/tasks/${taskId}`);
            if (!response.ok) throw new Error('Tarefa não encontrada');
            const task = await response.json();

            editForm.querySelector('#edit-task-id').value = task.id;
            editForm.querySelector('#edit-title').value = task.title;
            editForm.querySelector('#edit-description').value = task.description;
            editForm.querySelector('#edit-column_id').value = task.column_id;
            document.getElementById('task-created-at').textContent = formatDateTime(task.created_at);
            document.getElementById('task-updated-at').textContent = formatDateTime(task.updated_at);
            editModal.style.display = 'flex';
        } catch (error) {
            console.error('Erro ao buscar dados da tarefa:', error);
            alert('Não foi possível carregar os detalhes da tarefa.');
        }
    }
});

function addColumnToUI(column) {
    const columnElement = document.createElement('div');
    columnElement.className = 'column';
    columnElement.setAttribute('data-column-id', column.id);
    columnElement.innerHTML = `
        <div class="column-header">
            <h2>${column.name}</h2>
            <button class="delete-column-btn" title="Excluir coluna">&times;</button>
        </div>
        <div class="tasks-container"></div>
    `;
    boardContainer.insertBefore(columnElement, addColumnContainer);
}

function addTaskCardToUI(task) {
    const tasksContainer = document.querySelector(`.column[data-column-id="${task.column_id}"] .tasks-container`);
    if (!tasksContainer) return;

    const taskCard = document.createElement('div');
    taskCard.className = 'task-card';
    taskCard.setAttribute('data-task-id', task.id);
    const descriptionText = task.description || '';
    taskCard.innerHTML = `
        <button class="delete-task-btn" title="Excluir tarefa">&times;</button>
        <h3>${task.title}</h3>
        <p>${descriptionText.length > 30 ? descriptionText.substring(0, 30) + '...' : descriptionText}</p>
    `;
    tasksContainer.appendChild(taskCard);
}

function updateTaskCardInUI(task) {
    const taskCard = document.querySelector(`.task-card[data-task-id="${task.id}"]`);
    if (!taskCard) return;

    taskCard.querySelector('h3').textContent = task.title;
    const descriptionElement = taskCard.querySelector('p');
    const descriptionText = task.description || '';
    descriptionElement.textContent = descriptionText.length > 30 ? descriptionText.substring(0, 30) + '...' : descriptionText;

    const oldColumn = taskCard.closest('.column');
    if (oldColumn.dataset.columnId != task.column_id) {
        const newColumnTasksContainer = document.querySelector(`.column[data-column-id="${task.column_id}"] .tasks-container`);
        if (newColumnTasksContainer) {
            newColumnTasksContainer.appendChild(taskCard);
        }
    }
}

function addOptionToTaskModal(column) {
    const columnSelect = document.getElementById('column_id');
    const newOption = document.createElement('option');
    newOption.value = column.id;
    newOption.textContent = column.name;
    columnSelect.appendChild(newOption);
}

function addOptionToEditTaskModal(column) {
    const columnSelect = document.getElementById('edit-column_id');
    const newOption = document.createElement('option');
    newOption.value = column.id;
    newOption.textContent = column.name;
    columnSelect.appendChild(newOption);
}

function updateColumnOptionInModals(column) {
    const optionsToUpdate = document.querySelectorAll(`select option[value="${column.id}"]`);
    optionsToUpdate.forEach(option => {
        option.textContent = column.name;
    });
}

function removeOptionFromModals(columnId) {
    const optionsToRemove = document.querySelectorAll(`select option[value="${columnId}"]`);
    optionsToRemove.forEach(option => option.remove());
}

function formatDateTime(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleString('pt-BR', options);
}