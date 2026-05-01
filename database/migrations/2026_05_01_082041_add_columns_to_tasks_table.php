<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // No-op: the original tasks migration was updated to include the full schema.
        // This migration exists only because the original ran against the real DB with the empty schema.
    }

    public function down(): void
    {
        //
    }
};
