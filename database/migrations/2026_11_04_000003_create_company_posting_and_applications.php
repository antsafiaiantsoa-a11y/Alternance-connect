<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('companies', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('owner_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->string('registration_number', 120);
            $table->char('country_code', 2);
            $table->string('city', 120);
            $table->string('website')->nullable();
            $table->string('contact_email');
            $table->string('verification_status', 20)->default('pending');
            $table->text('verification_note')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->timestamp('privacy_notice_accepted_at')->nullable();
            $table->timestamps();

            $table->foreign('country_code')->references('code')->on('countries')->restrictOnDelete();
            $table->unique(['country_code', 'registration_number'], 'companies_country_registration_unique');
            $table->index(['verification_status', 'created_at']);
        });

        Schema::table('job_offers', function (Blueprint $table): void {
            $table->foreignId('company_id')->nullable()->constrained('companies')->cascadeOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('moderation_status', 20)->default('approved');
            $table->text('moderation_note')->nullable();
            $table->index(['moderation_status', 'availability_status']);
        });

        Schema::create('job_offer_applications', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('job_offer_id')->constrained('job_offers')->cascadeOnDelete();
            $table->foreignId('applicant_id')->constrained('users')->cascadeOnDelete();
            $table->longText('cover_letter');
            $table->string('status', 20)->default('received');
            $table->timestamp('status_updated_at')->nullable();
            $table->timestamp('privacy_notice_accepted_at')->nullable();
            $table->timestamps();

            $table->unique(['job_offer_id', 'applicant_id'], 'job_offer_applications_unique_applicant');
            $table->index(['applicant_id', 'created_at']);
            $table->index(['job_offer_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_offer_applications');
        Schema::table('job_offers', function (Blueprint $table): void {
            $table->dropForeign(['company_id']);
            $table->dropForeign(['created_by']);
            $table->dropIndex(['moderation_status', 'availability_status']);
            $table->dropColumn(['company_id', 'created_by', 'moderation_status', 'moderation_note']);
        });
        Schema::dropIfExists('companies');
    }
};
