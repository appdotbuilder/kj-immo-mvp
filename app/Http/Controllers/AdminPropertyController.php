<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controller;
use App\Models\Property;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminPropertyController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware(['auth', function ($request, $next) {
            if (!auth()->user() || !auth()->user()->isAdmin()) {
                abort(403, 'Access denied. Admin privileges required.');
            }
            return $next($request);
        }]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Property::with(['user', 'images']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('city')) {
            $query->where('city', 'LIKE', '%' . $request->city . '%');
        }

        $properties = $query->latest()->paginate(20);

        return Inertia::render('admin/properties', [
            'properties' => $properties,
            'filters' => $request->only(['status', 'city']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Property $property)
    {
        $request->validate([
            'status' => 'required|in:pending,published,archived',
        ]);

        $property->update(['status' => $request->status]);

        return back()->with('success', 'Property status updated successfully.');
    }
}