<?php

use App\Models\Board;
use App\Models\BoardColumn;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('board_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignIdFor(BoardColumn::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Board::class);
            $table->foreignIdFor(User::class, 'assigned_to_user_id')->nullable();
            $table->unsignedInteger('position');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('priority');
            $table->unsignedInteger('estimated_minutes')->nullable();
            $table->date('due_date')->nullable();
            $table->dateTime('started_at')->nullable();
            $table->dateTime('completed_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('board_items');
    }
};
