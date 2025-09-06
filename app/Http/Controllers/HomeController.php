<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Display the home page with featured properties.
     */
    public function index(Request $request)
    {
        // Get recent published properties
        $recentProperties = Property::with(['user', 'images'])
            ->published()
            ->latest()
            ->take(6)
            ->get();

        // Apply search filters if provided
        $query = Property::with(['user', 'images'])
            ->published()
            ->latest();

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

        $searchResults = null;
        if ($request->hasAny(['city', 'min_price', 'max_price', 'min_surface', 'max_surface', 'bedrooms'])) {
            $searchResults = $query->paginate(12);
        }

        return Inertia::render('welcome', [
            'recentProperties' => $recentProperties,
            'searchResults' => $searchResults,
            'filters' => $request->only(['city', 'min_price', 'max_price', 'min_surface', 'max_surface', 'bedrooms']),
        ]);
    }
}