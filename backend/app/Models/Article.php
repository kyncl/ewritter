<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Builder;

class Article extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'header',
        'content',
    ];

    /**
     * The users that belong to the article.
     * * This defines the many-to-many relationship.
     */
    public function users(): BelongsToMany
    {
        // Laravel will assume the pivot table is 'article_user'
        // and the foreign keys are 'article_id' and 'user_id'
        return $this->belongsToMany(User::class);
    }
}
