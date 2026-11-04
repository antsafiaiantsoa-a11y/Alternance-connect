<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_sources', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 50)->unique();
            $table->string('label');
            $table->boolean('enabled')->default(false);
            $table->boolean('available')->default(false);
            $table->text('status_note')->nullable();
            $table->timestamp('last_synced_at')->nullable();
            $table->text('last_error')->nullable();
            $table->timestamps();
        });

        Schema::create('job_offers', function (Blueprint $table) {
            $table->id();
            $table->string('source_provider', 32);
            $table->string('source_label', 120);
            $table->string('source_offer_id', 191);
            $table->string('source_partner_id', 191)->nullable();
            $table->string('company_name')->nullable();
            $table->string('title');
            $table->longText('description')->nullable();
            $table->json('contract_types')->nullable();
            $table->string('city')->nullable();
            $table->string('postal_code', 20)->nullable();
            $table->string('region')->nullable();
            $table->json('rome_codes')->nullable();
            $table->json('skills')->nullable();
            $table->string('education_level')->nullable();
            $table->string('salary')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->date('starts_at')->nullable();
            $table->date('expires_at')->nullable();
            $table->text('original_url')->nullable();
            $table->text('application_url')->nullable();
            $table->string('remote_mode', 20)->nullable();
            $table->string('availability_status', 20)->default('active');
            $table->timestamp('last_synced_at')->nullable();
            $table->timestamps();

            $table->unique(
                ['source_provider', 'source_label', 'source_offer_id'],
                'job_offers_source_identity',
            );
            $table->index(['availability_status', 'published_at']);
            $table->index(['city', 'region']);
            $table->index('expires_at');
        });

        Schema::create('job_sync_runs', function (Blueprint $table) {
            $table->id();
            $table->string('source_slug', 50);
            $table->timestamp('started_at');
            $table->timestamp('finished_at')->nullable();
            $table->string('status', 20)->default('running');
            $table->unsignedInteger('fetched_count')->default(0);
            $table->unsignedInteger('expired_count')->default(0);
            $table->text('error_message')->nullable();
            $table->timestamps();

            $table->index(['source_slug', 'started_at']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_sync_runs');
        Schema::dropIfExists('job_offers');
        Schema::dropIfExists('job_sources');
    }
};
