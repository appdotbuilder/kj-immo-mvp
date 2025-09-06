<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->decimal('price', 12, 2)->comment('Price in currency');
            $table->integer('surface_area')->comment('Surface area in square meters');
            $table->integer('bedrooms')->comment('Number of bedrooms');
            $table->string('city');
            $table->string('neighborhood');
            $table->enum('status', ['pending', 'published', 'archived'])->default('pending');
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            
            // Indexes for search performance
            $table->index('city');
            $table->index('price');
            $table->index('surface_area');
            $table->index('bedrooms');
            $table->index('status');
            $table->index(['status', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};