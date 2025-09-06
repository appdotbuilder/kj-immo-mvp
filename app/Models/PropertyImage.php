<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\PropertyImage
 *
 * @property int $id
 * @property int $property_id
 * @property string $path
 * @property string|null $alt_text
 * @property int $sort_order
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Property $property
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|PropertyImage newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PropertyImage newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PropertyImage query()
 * @method static \Illuminate\Database\Eloquent\Builder|PropertyImage whereAltText($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PropertyImage whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PropertyImage whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PropertyImage wherePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PropertyImage wherePropertyId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PropertyImage whereSortOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PropertyImage whereUpdatedAt($value)
 * @method static \Database\Factories\PropertyImageFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class PropertyImage extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'property_id',
        'path',
        'alt_text',
        'sort_order',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'property_id' => 'integer',
        'sort_order' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the property that owns the image.
     */
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }
}