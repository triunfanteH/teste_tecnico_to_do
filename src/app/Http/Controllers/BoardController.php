<?php

namespace App\Http\Controllers;

use App\Models\Column;
use Illuminate\Http\Request;

class BoardController extends Controller
{
    public function index()
    {
        $columns = Column::with('tasks')->orderBy('position')->get();
        return view('board', ['columns' => $columns]);
    }
}