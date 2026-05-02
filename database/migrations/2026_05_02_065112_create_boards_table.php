<?php

use App\Enums\BoardStatus;
use App\Models\Board;
use App\Models\Team;
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
        Schema::create('boards', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('status')->default(BoardStatus::Active->value);
            $table->foreignIdFor(Team::class)->cascadeOnDelete();
            $table->foreignIdFor(User::class, 'created_by')->cascadeOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('board_members', function (Blueprint $table) {
            $table->foreignIdFor(Board::class)->cascadeOnDelete();
            $table->foreignIdFor(User::class)->cascadeOnDelete();
            $table->primary(['board_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('boards');
    }
};
