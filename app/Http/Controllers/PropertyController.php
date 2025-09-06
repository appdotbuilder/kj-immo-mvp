<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePropertyRequest;
use App\Http\Requests\UpdatePropertyRequest;
use App\Models\Property;
use App\Models\PropertyImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PropertyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Property::with(['user', 'images'])
            ->published()
            ->latest();

        // Apply search filters
        if ($request->filled('city')) {
            $query->where('city', 'LIKE', '%' . $request->city . '%');
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        if ($request->filled('min_surface')) {
            $query->where('surface_area', '>=', $request->min_surface);
        }

        if ($request->filled('max_surface')) {
            $query->where('surface_area', '<=', $request->max_surface);
        }

        if ($request->filled('bedrooms')) {
            $query->where('bedrooms', $request->bedrooms);
        }

        $properties = $query->paginate(12);

        return Inertia::render('properties/index', [
            'properties' => $properties,
            'filters' => $request->only(['city', 'min_price', 'max_price', 'min_surface', 'max_surface', 'bedrooms']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('properties/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePropertyRequest $request)
    {
        $property = Property::create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
            'status' => $request->user()->isAdmin() ? 'published' : 'pending',
        ]);

        // Handle image uploads
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('properties', 'public');
                
                PropertyImage::create([
                    'property_id' => $property->id,
                    'path' => $path,
                    'alt_text' => $request->title . ' - Image ' . ($index + 1),
                    'sort_order' => $index,
                ]);
            }
        }

        return redirect()->route('properties.show', $property)
            ->with('success', 'Property listed successfully!' . 
                ($property->status === 'pending' ? ' It will be published after admin approval.' : ''));
    }

    /**
     * Display the specified resource.
     */
    public function show(Property $property)
    {
        $user = auth()->user();
        
        // Check if property can be viewed
        if ($property->status !== 'published') {
            if (!$user) {
                abort(403, 'Property not available.');
            }
            
            if (!$user->isAdmin() && (!$user->isAgent() || $property->user_id !== $user->id)) {
                abort(403, 'Property not available.');
            }
        }

        $property->load(['user', 'images']);

        return Inertia::render('properties/show', [
            'property' => $property,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Property $property)
    {
        $user = auth()->user();
        
        // Check authorization
        if (!$user || (!$user->isAdmin() && (!$user->isAgent() || $property->user_id !== $user->id))) {
            abort(403, 'Unauthorized to edit this property.');
        }
        
        $property->load('images');

        return Inertia::render('properties/edit', [
            'property' => $property,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePropertyRequest $request, Property $property)
    {
        $property->update($request->validated());

        // Handle new image uploads
        if ($request->hasFile('images')) {
            $existingImagesCount = $property->images()->count();
            
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('properties', 'public');
                
                PropertyImage::create([
                    'property_id' => $property->id,
                    'path' => $path,
                    'alt_text' => $request->title . ' - Image ' . ($existingImagesCount + $index + 1),
                    'sort_order' => $existingImagesCount + $index,
                ]);
            }
        }

        return redirect()->route('properties.show', $property)
            ->with('success', 'Property updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Property $property)
    {
        $user = auth()->user();
        
        // Check authorization
        if (!$user || (!$user->isAdmin() && (!$user->isAgent() || $property->user_id !== $user->id))) {
            abort(403, 'Unauthorized to delete this property.');
        }

        // Delete associated images from storage
        foreach ($property->images as $image) {
            Storage::disk('public')->delete($image->path);
        }

        $property->delete();

        return redirect()->route('properties.index')
            ->with('success', 'Property deleted successfully.');
    }
}