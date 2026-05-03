<?php

use App\Models\BoardItem;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('board_item_attachments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignIdFor(BoardItem::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(User::class, 'uploaded_by')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->string('path');
            $table->string('mime_type');
            $table->unsignedBigInteger('size');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('board_item_attachments');
    }
};
