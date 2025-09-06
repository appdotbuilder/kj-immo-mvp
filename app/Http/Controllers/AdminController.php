<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controller;
use App\Models\Property;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
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
     * Display the admin dashboard.
     */
    public function index()
    {
        $stats = [
            'total_properties' => Property::count(),
            'pending_properties' => Property::pending()->count(),
            'published_properties' => Property::published()->count(),
            'archived_properties' => Property::archived()->count(),
            'total_users' => User::count(),
            'agents' => User::agents()->count(),
            'clients' => User::clients()->count(),
        ];

        $recentProperties = Property::with(['user', 'images'])
            ->latest()
            ->take(10)
            ->get();

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'recentProperties' => $recentProperties,
        ]);
    }
}