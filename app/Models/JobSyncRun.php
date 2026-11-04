<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobSyncRun extends Model
{
    protected $fillable = [
        'source_slug',
        'started_at',
        'finished_at',
        'status',
        'fetched_count',
        'expired_count',
        'error_message',
    ];

    protected function casts(): array
    {
        return [
            'started_at' => 'datetime',
            'finished_at' => 'datetime',
        ];
    }
}
