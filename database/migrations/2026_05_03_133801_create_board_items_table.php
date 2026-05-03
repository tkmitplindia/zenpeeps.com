<?php

use App\Enums\BoardItemPriority;
use App\Models\Board;
use App\Models\BoardColumn;
use App\Models\BoardItem;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('board_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignIdFor(Board::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(BoardColumn::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(User::class, 'created_by')->constrained('users')->cascadeOnDelete();
            $table->unsignedInteger('number');
            $table->unsignedInteger('position');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('priority')->default(BoardItemPriority::Medium->value);
            $table->unsignedInteger('estimated_minutes')->nullable();
            $table->unsignedInteger('tracked_seconds')->default(0);
            $table->dateTime('time_tracker_started_at')->nullable();
            $table->date('due_date')->nullable();
            $table->dateTime('started_at')->nullable();
            $table->dateTime('completed_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['board_id', 'number']);
        });

        Schema::create('board_item_assignees', function (Blueprint $table) {
            $table->foreignIdFor(BoardItem::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(User::class)->constrained()->cascadeOnDelete();
            $table->primary(['board_item_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('board_item_assignees');
        Schema::dropIfExists('board_items');
    }
};
