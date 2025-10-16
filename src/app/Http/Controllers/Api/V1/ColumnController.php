<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Column;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ColumnController extends Controller
{
    /**
     * Listar todas as colunas com suas tarefas.
     * Endpoint: GET /api/v1/columns
     */
    public function index()
    {
        $columns = Column::with('tasks')->orderBy('position')->get();
        return response()->json($columns);
    }

    /**
     * Criar uma nova coluna.
     * Endpoint: POST /api/v1/columns
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'required|integer',
        ]);

        $column = new Column();
        $column->name = $request->name;
        $column->position = $request->position;
        $column->save();

        return response()->json($column, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     * Endpoint: PUT/PATCH /api/v1/columns/{column}
     */
    public function update(Request $request, Column $column)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $column->update($validatedData);

        return response()->json($column);
    }

    /**
     * Remove the specified resource from storage.
     * Endpoint: DELETE /api/v1/columns/{column}
     */
    public function destroy(Column $column)
    {
        $column->delete();
        return response()->json(null, 204);
    }
}
