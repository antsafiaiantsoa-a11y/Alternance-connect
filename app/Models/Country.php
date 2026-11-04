<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    protected $primaryKey = 'code';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'code',
        'name_fr',
        'name_en',
        'name_de',
        'eu_member',
        'enabled_for_search',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'eu_member' => 'boolean',
            'enabled_for_search' => 'boolean',
        ];
    }
}
