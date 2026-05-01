<?php

namespace App\Models;

use Database\Factories\ChatroomFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chatroom extends Model
{
    /** @use HasFactory<ChatroomFactory> */
    use HasFactory;
}
