<?php

use App\Models\BoardItem;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('board_item_tags', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignIdFor(BoardItem::class)->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->timestamps();

            $table->unique(['board_item_id', 'name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('board_item_tags');
    }
};
