<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /** @var array<int, array{code: string, name_fr: string, name_en: string, name_de: string, eu_member: bool}> */
    private array $countries = [
        ['code' => 'AL', 'name_fr' => 'Albanie', 'name_en' => 'Albania', 'name_de' => 'Albanien', 'eu_member' => false],
        ['code' => 'AD', 'name_fr' => 'Andorre', 'name_en' => 'Andorra', 'name_de' => 'Andorra', 'eu_member' => false],
        ['code' => 'AM', 'name_fr' => 'Arménie', 'name_en' => 'Armenia', 'name_de' => 'Armenien', 'eu_member' => false],
        ['code' => 'AT', 'name_fr' => 'Autriche', 'name_en' => 'Austria', 'name_de' => 'Österreich', 'eu_member' => true],
        ['code' => 'AZ', 'name_fr' => 'Azerbaïdjan', 'name_en' => 'Azerbaijan', 'name_de' => 'Aserbaidschan', 'eu_member' => false],
        ['code' => 'BY', 'name_fr' => 'Biélorussie', 'name_en' => 'Belarus', 'name_de' => 'Belarus', 'eu_member' => false],
        ['code' => 'BE', 'name_fr' => 'Belgique', 'name_en' => 'Belgium', 'name_de' => 'Belgien', 'eu_member' => true],
        ['code' => 'BA', 'name_fr' => 'Bosnie-Herzégovine', 'name_en' => 'Bosnia and Herzegovina', 'name_de' => 'Bosnien und Herzegowina', 'eu_member' => false],
        ['code' => 'BG', 'name_fr' => 'Bulgarie', 'name_en' => 'Bulgaria', 'name_de' => 'Bulgarien', 'eu_member' => true],
        ['code' => 'HR', 'name_fr' => 'Croatie', 'name_en' => 'Croatia', 'name_de' => 'Kroatien', 'eu_member' => true],
        ['code' => 'CY', 'name_fr' => 'Chypre', 'name_en' => 'Cyprus', 'name_de' => 'Zypern', 'eu_member' => true],
        ['code' => 'CZ', 'name_fr' => 'Tchéquie', 'name_en' => 'Czechia', 'name_de' => 'Tschechien', 'eu_member' => true],
        ['code' => 'DK', 'name_fr' => 'Danemark', 'name_en' => 'Denmark', 'name_de' => 'Dänemark', 'eu_member' => true],
        ['code' => 'EE', 'name_fr' => 'Estonie', 'name_en' => 'Estonia', 'name_de' => 'Estland', 'eu_member' => true],
        ['code' => 'FI', 'name_fr' => 'Finlande', 'name_en' => 'Finland', 'name_de' => 'Finnland', 'eu_member' => true],
        ['code' => 'FR', 'name_fr' => 'France', 'name_en' => 'France', 'name_de' => 'Frankreich', 'eu_member' => true],
        ['code' => 'GE', 'name_fr' => 'Géorgie', 'name_en' => 'Georgia', 'name_de' => 'Georgien', 'eu_member' => false],
        ['code' => 'DE', 'name_fr' => 'Allemagne', 'name_en' => 'Germany', 'name_de' => 'Deutschland', 'eu_member' => true],
        ['code' => 'GR', 'name_fr' => 'Grèce', 'name_en' => 'Greece', 'name_de' => 'Griechenland', 'eu_member' => true],
        ['code' => 'HU', 'name_fr' => 'Hongrie', 'name_en' => 'Hungary', 'name_de' => 'Ungarn', 'eu_member' => true],
        ['code' => 'IS', 'name_fr' => 'Islande', 'name_en' => 'Iceland', 'name_de' => 'Island', 'eu_member' => false],
        ['code' => 'IE', 'name_fr' => 'Irlande', 'name_en' => 'Ireland', 'name_de' => 'Irland', 'eu_member' => true],
        ['code' => 'IT', 'name_fr' => 'Italie', 'name_en' => 'Italy', 'name_de' => 'Italien', 'eu_member' => true],
        ['code' => 'XK', 'name_fr' => 'Kosovo', 'name_en' => 'Kosovo', 'name_de' => 'Kosovo', 'eu_member' => false],
        ['code' => 'LV', 'name_fr' => 'Lettonie', 'name_en' => 'Latvia', 'name_de' => 'Lettland', 'eu_member' => true],
        ['code' => 'LI', 'name_fr' => 'Liechtenstein', 'name_en' => 'Liechtenstein', 'name_de' => 'Liechtenstein', 'eu_member' => false],
        ['code' => 'LT', 'name_fr' => 'Lituanie', 'name_en' => 'Lithuania', 'name_de' => 'Litauen', 'eu_member' => true],
        ['code' => 'LU', 'name_fr' => 'Luxembourg', 'name_en' => 'Luxembourg', 'name_de' => 'Luxemburg', 'eu_member' => true],
        ['code' => 'MT', 'name_fr' => 'Malte', 'name_en' => 'Malta', 'name_de' => 'Malta', 'eu_member' => true],
        ['code' => 'MD', 'name_fr' => 'Moldavie', 'name_en' => 'Moldova', 'name_de' => 'Moldau', 'eu_member' => false],
        ['code' => 'MC', 'name_fr' => 'Monaco', 'name_en' => 'Monaco', 'name_de' => 'Monaco', 'eu_member' => false],
        ['code' => 'ME', 'name_fr' => 'Monténégro', 'name_en' => 'Montenegro', 'name_de' => 'Montenegro', 'eu_member' => false],
        ['code' => 'NL', 'name_fr' => 'Pays-Bas', 'name_en' => 'Netherlands', 'name_de' => 'Niederlande', 'eu_member' => true],
        ['code' => 'MK', 'name_fr' => 'Macédoine du Nord', 'name_en' => 'North Macedonia', 'name_de' => 'Nordmazedonien', 'eu_member' => false],
        ['code' => 'NO', 'name_fr' => 'Norvège', 'name_en' => 'Norway', 'name_de' => 'Norwegen', 'eu_member' => false],
        ['code' => 'PL', 'name_fr' => 'Pologne', 'name_en' => 'Poland', 'name_de' => 'Polen', 'eu_member' => true],
        ['code' => 'PT', 'name_fr' => 'Portugal', 'name_en' => 'Portugal', 'name_de' => 'Portugal', 'eu_member' => true],
        ['code' => 'RO', 'name_fr' => 'Roumanie', 'name_en' => 'Romania', 'name_de' => 'Rumänien', 'eu_member' => true],
        ['code' => 'RU', 'name_fr' => 'Russie', 'name_en' => 'Russia', 'name_de' => 'Russland', 'eu_member' => false],
        ['code' => 'SM', 'name_fr' => 'Saint-Marin', 'name_en' => 'San Marino', 'name_de' => 'San Marino', 'eu_member' => false],
        ['code' => 'RS', 'name_fr' => 'Serbie', 'name_en' => 'Serbia', 'name_de' => 'Serbien', 'eu_member' => false],
        ['code' => 'SK', 'name_fr' => 'Slovaquie', 'name_en' => 'Slovakia', 'name_de' => 'Slowakei', 'eu_member' => true],
        ['code' => 'SI', 'name_fr' => 'Slovénie', 'name_en' => 'Slovenia', 'name_de' => 'Slowenien', 'eu_member' => true],
        ['code' => 'ES', 'name_fr' => 'Espagne', 'name_en' => 'Spain', 'name_de' => 'Spanien', 'eu_member' => true],
        ['code' => 'SE', 'name_fr' => 'Suède', 'name_en' => 'Sweden', 'name_de' => 'Schweden', 'eu_member' => true],
        ['code' => 'CH', 'name_fr' => 'Suisse', 'name_en' => 'Switzerland', 'name_de' => 'Schweiz', 'eu_member' => false],
        ['code' => 'TR', 'name_fr' => 'Turquie', 'name_en' => 'Türkiye', 'name_de' => 'Türkei', 'eu_member' => false],
        ['code' => 'UA', 'name_fr' => 'Ukraine', 'name_en' => 'Ukraine', 'name_de' => 'Ukraine', 'eu_member' => false],
        ['code' => 'GB', 'name_fr' => 'Royaume-Uni', 'name_en' => 'United Kingdom', 'name_de' => 'Vereinigtes Königreich', 'eu_member' => false],
        ['code' => 'VA', 'name_fr' => 'Vatican', 'name_en' => 'Vatican City', 'name_de' => 'Vatikanstadt', 'eu_member' => false],
    ];

    public function up(): void
    {
        Schema::create('countries', function (Blueprint $table): void {
            $table->char('code', 2)->primary();
            $table->string('name_fr');
            $table->string('name_en');
            $table->string('name_de');
            $table->boolean('eu_member')->default(false);
            $table->boolean('enabled_for_search')->default(false);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
            $table->index(['enabled_for_search', 'name_fr']);
        });

        $now = now();
        $rows = [];
        foreach ($this->countries as $order => $country) {
            $rows[] = [...$country,
                'enabled_for_search' => $country['code'] === 'FR',
                'sort_order' => $order,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }
        DB::table('countries')->insert($rows);

        Schema::table('job_offers', function (Blueprint $table): void {
            $table->char('country_code', 2)->nullable();
            $table->string('address_line')->nullable();
            $table->string('sector')->nullable();
            $table->string('training_name')->nullable();
            $table->decimal('salary_min', 12, 2)->nullable();
            $table->decimal('salary_max', 12, 2)->nullable();
            $table->char('currency', 3)->nullable();
            $table->unsignedSmallInteger('duration_months')->nullable();
            $table->json('required_languages')->nullable();
            $table->text('attribution_text')->nullable();
            $table->text('reuse_license')->nullable();
            $table->char('dedupe_hash', 64)->nullable()->index();
            $table->foreign('country_code')->references('code')->on('countries')->nullOnDelete();
            $table->index(['country_code', 'availability_status']);
        });

        DB::table('job_offers')->where('source_provider', 'lba')->update(['country_code' => 'FR']);
    }

    public function down(): void
    {
        Schema::table('job_offers', function (Blueprint $table): void {
            $table->dropForeign(['country_code']);
            $table->dropIndex(['country_code', 'availability_status']);
            $table->dropIndex(['dedupe_hash']);
            $table->dropColumn([
                'country_code', 'address_line', 'sector', 'training_name', 'salary_min', 'salary_max',
                'currency', 'duration_months', 'required_languages', 'attribution_text', 'reuse_license', 'dedupe_hash',
            ]);
        });
        Schema::dropIfExists('countries');
    }
};
