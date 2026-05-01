<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('fake_payments', function (Blueprint $table) {
            $table->foreignUuid('project_id')->after('id')->constrained()->cascadeOnDelete();
            $table->string('pack_key')->after('project_id');
            $table->unsignedInteger('amount_cents')->after('pack_key');
        });
    }

    public function down(): void
    {
        Schema::table('fake_payments', function (Blueprint $table) {
            $table->dropForeign(['project_id']);
            $table->dropColumn(['project_id', 'pack_key', 'amount_cents']);
        });
    }
};
