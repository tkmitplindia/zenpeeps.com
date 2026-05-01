<?php

namespace App\Models;

use Database\Factories\TaskItemFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaskItem extends Model
{
    /** @use HasFactory<TaskItemFactory> */
    use HasFactory;
}
