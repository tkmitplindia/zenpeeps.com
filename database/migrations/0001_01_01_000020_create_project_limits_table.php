<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_limits', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('project_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('subscription_status');
            $table->timestamp('current_period_starts_at');
            $table->timestamp('current_period_ends_at');
            $table->unsignedBigInteger('ai_tokens_included')->default(0);
            $table->unsignedBigInteger('recharge_ai_tokens')->default(0);
            $table->unsignedInteger('recharge_meeting_minutes')->default(0);
            $table->unsignedInteger('recharge_recording_minutes')->default(0);
            $table->unsignedInteger('recharge_transcript_minutes')->default(0);
            $table->unsignedBigInteger('recharge_storage_bytes')->default(0);
            $table->timestamp('trial_tokens_granted_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_limits');
    }
};
