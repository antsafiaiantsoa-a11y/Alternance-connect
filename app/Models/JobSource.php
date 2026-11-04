<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobSource extends Model
{
    protected $fillable = [
        'slug',
        'label',
        'enabled',
        'available',
        'status_note',
        'last_synced_at',
        'last_error',
    ];

    protected function casts(): array
    {
        return [
            'enabled' => 'boolean',
            'available' => 'boolean',
            'last_synced_at' => 'datetime',
        ];
    }
}
