<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_usages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('project_id')->constrained()->cascadeOnDelete();
            $table->string('type');
            $table->unsignedBigInteger('amount');
            $table->string('description')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['project_id', 'type', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_usages');
    }
};
