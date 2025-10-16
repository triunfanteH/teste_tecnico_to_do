<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
    <title>To-Do Kanban</title>
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
</head>

<body>

    <header>
        <h1>Quadro de Tarefas</h1>
        <button id="open-task-modal" class="create-task-btn">Criar Tarefa</button>
    </header>

    <main class="board-container">
        @foreach ($columns as $column)
        <div class="column" data-column-id="{{ $column->id }}">
            <div class="column-header">
                <h2>{{ $column->name }}</h2>
                <button class="delete-column-btn" title="Excluir coluna">&times;</button>
            </div>
            <div class="tasks-container">
                @foreach ($column->tasks as $task)
                <div class="task-card" data-task-id="{{ $task->id }}">
                    <button class="delete-task-btn" title="Excluir tarefa">&times;</button>
                    <h3>{{ $task->title }}</h3>
                    <p>{{ Str::limit($task->description, 30) }}</p>
                </div>
                @endforeach
            </div>
        </div>
        @endforeach
        <div class="add-column-container">
            <div id="add-column-form" style="display: none;">
                <input type="text" id="new-column-name" placeholder="Digite o nome da coluna...">
                <div class="form-actions">
                    <button id="save-column-btn" class="submit-btn">Adicionar</button>
                    <button id="cancel-column-btn" class="cancel-btn">&times;</button>
                </div>
            </div>

            <button id="add-column-btn" class="add-column-btn">+ Adicionar coluna</button>
        </div>
    </main>
    <div id="task-modal" class="modal">
        <div class="modal-content">
            <span class="close-btn">&times;</span>
            <h2>Criar Nova Tarefa</h2>
            <form id="create-task-form">
                @csrf

                <div class="form-group">
                    <label for="title">Título</label>
                    <input type="text" id="title" name="title" required>
                </div>
                <div class="form-group">
                    <label for="description">Descrição</label>
                    <textarea id="description" name="description" rows="4"></textarea>
                </div>
                <div class="form-group">
                    <label for="column_id">Coluna</label>
                    <select id="column_id" name="column_id" required>
                        @foreach ($columns as $column)
                        <option value="{{ $column->id }}">{{ $column->name }}</option>
                        @endforeach
                    </select>
                </div>
                <button type="submit" class="submit-btn">Salvar Tarefa</button>
            </form>
        </div>
    </div>
    <div id="edit-task-modal" class="modal">
        <div class="modal-content">
            <span class="close-edit-btn">&times;</span>
            <h2>Editar Tarefa</h2>
            <form id="edit-task-form">
                <input type="hidden" id="edit-task-id" name="id">

                <div class="form-group">
                    <label for="edit-title">Título</label>
                    <input type="text" id="edit-title" name="title" required>
                </div>

                <div class="form-group">
                    <label for="edit-description">Descrição</label>
                    <textarea id="edit-description" name="description" rows="4"></textarea>
                </div>

                <div class="form-group">
                    <label for="edit-column_id">Status (Coluna)</label>
                    <select id="edit-column_id" name="column_id" required>
                        @foreach ($columns as $column)
                        <option value="{{ $column->id }}">{{ $column->name }}</option>
                        @endforeach
                    </select>
                </div>

                <div class="task-dates">
                    <p><strong>Criado em:</strong> <span id="task-created-at"></span></p>
                    <p><strong>Última atualização:</strong> <span id="task-updated-at"></span></p>
                </div>

                <div class="modal-actions">
                    <button type="submit" class="submit-btn">Salvar Alterações</button>
                    <button type="button" id="delete-task-modal-btn" class="delete-btn-modal">Excluir Tarefa</button>
                </div>
            </form>
        </div>
    </div>
    <script src="{{ asset('js/board.js') }}"></script>

</body>

</html>