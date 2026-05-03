<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBoardItemRequest;
use App\Http\Requests\UpdateBoardItemRequest;
use App\Models\BoardItem;

class BoardItemController extends Controller
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
    public function store(StoreBoardItemRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(BoardItem $boardItem)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BoardItem $boardItem)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBoardItemRequest $request, BoardItem $boardItem)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BoardItem $boardItem)
    {
        //
    }
}
