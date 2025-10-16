<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Task;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Task::all();
    }

    /**
     * Criar uma nova tarefa.
     * Endpoint: POST /api/v1/tasks
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'position' => 'required|integer',
            'column_id' => 'required|exists:columns,id',
        ]);

        $task = new Task();
        $task->title = $request->title;
        $task->description = $request->description;
        $task->position = $request->position;
        $task->column_id = $request->column_id;
        $task->save();

        return response()->json($task, 201);
    }

    /**
     * Display the specified resource.
     * Endpoint: GET /api/v1/tasks/{task}
     */
    public function show(Task $task)
    {
        return response()->json($task);
    }

    /**
     * Atualizar uma tarefa existente.
     * Endpoint: PUT/PATCH /api/v1/tasks/{task}
     */
    public function update(Request $request, Task $task)
    {
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'position' => 'sometimes|required|integer',
            'column_id' => 'sometimes|required|exists:columns,id',
        ]);

        $task->update($request->except('id'));

        return response()->json($task);
    }

    /**
     * Deletar uma tarefa.
     * Endpoint: DELETE /api/v1/tasks/{task}
     */
    public function destroy(Task $task)
    {
        $task->delete();
        return response()->json(null, 204);
    }
}
