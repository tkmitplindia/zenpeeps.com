<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->string('priority')->default('medium')->after('position');
            $table->unsignedInteger('estimate_minutes')->nullable()->after('due_date');
            $table->unsignedInteger('elapsed_seconds')->default(0)->after('estimate_minutes');
            $table->timestamp('time_tracker_started_at')->nullable()->after('elapsed_seconds');
            $table->timestamp('completed_at')->nullable()->after('time_tracker_started_at');
        });
    }

    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropColumn([
                'priority',
                'estimate_minutes',
                'elapsed_seconds',
                'time_tracker_started_at',
                'completed_at',
            ]);
        });
    }
};
