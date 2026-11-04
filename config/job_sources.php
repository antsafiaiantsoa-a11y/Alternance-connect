<?php

return [
    'admins' => array_values(array_filter(array_map(
        static fn (string $email): string => strtolower(trim($email)),
        explode(',', (string) env('OFFERS_ADMIN_EMAILS', '')),
    ))),

    'lba' => [
        'enabled' => (bool) env('LBA_ENABLED', true),
        'base_url' => rtrim((string) env('LBA_API_BASE_URL', 'https://api.apprentissage.beta.gouv.fr/api'), '/'),
        'api_key' => (string) env('LBA_API_KEY', ''),
        'non_profit_use_confirmed' => (bool) env('LBA_NON_PROFIT_USE', false),
    ],

];
