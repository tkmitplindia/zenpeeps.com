<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskItemRequest;
use App\Http\Requests\UpdateTaskItemRequest;
use App\Models\TaskItem;

class TaskItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskItemRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(TaskItem $taskItem)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TaskItem $taskItem)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskItemRequest $request, TaskItem $taskItem)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TaskItem $taskItem)
    {
        //
    }
}
