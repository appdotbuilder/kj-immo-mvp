import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Building, Eye, Clock, CheckCircle, Archive } from 'lucide-react';

interface Property {
    id: number;
    title: string;
    city: string;
    neighborhood: string;
    price: string;
    status: string;
    user: {
        name: string;
    };
    created_at: string;
}

interface Stats {
    total_properties: number;
    pending_properties: number;
    published_properties: number;
    archived_properties: number;
    total_users: number;
    agents: number;
    clients: number;
}

interface Props {
    stats: Stats;
    recentProperties: Property[];
    [key: string]: unknown;
}

export default function AdminDashboard({ stats, recentProperties }: Props) {
    const formatPrice = (price: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
        }).format(parseFloat(price));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'published':
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'pending':
                return <Clock className="h-4 w-4 text-yellow-600" />;
            case 'archived':
                return <Archive className="h-4 w-4 text-gray-600" />;
            default:
                return <Eye className="h-4 w-4 text-blue-600" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'published':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'archived':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-blue-100 text-blue-800';
        }
    };

    return (
        <AppShell>
            <Head title="Admin Dashboard - KJ Immo" />
            
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-2">
                        Manage properties, users, and monitor platform activity
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
                            <Building className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_properties}</div>
                            <p className="text-xs text-muted-foreground">
                                All property listings
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending_properties}</div>
                            <p className="text-xs text-muted-foreground">
                                Awaiting moderation
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Published</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.published_properties}</div>
                            <p className="text-xs text-muted-foreground">
                                Live listings
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_users}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.agents} agents, {stats.clients} clients
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/admin/properties">
                                <Button>
                                    <Building className="mr-2 h-4 w-4" />
                                    Manage Properties
                                </Button>
                            </Link>
                            <Link href="/admin/users">
                                <Button variant="outline">
                                    <Users className="mr-2 h-4 w-4" />
                                    Manage Users
                                </Button>
                            </Link>
                            <Link href="/properties">
                                <Button variant="outline">
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Public Site
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Properties */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Property Submissions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentProperties.map((property) => (
                                <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h4 className="font-semibold text-gray-900">{property.title}</h4>
                                            <Badge 
                                                variant="secondary" 
                                                className={getStatusColor(property.status)}
                                            >
                                                <div className="flex items-center space-x-1">
                                                    {getStatusIcon(property.status)}
                                                    <span className="capitalize">{property.status}</span>
                                                </div>
                                            </Badge>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {property.city}, {property.neighborhood} • {formatPrice(property.price)} • by {property.user.name}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            Listed {formatDate(property.created_at)}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Link href={`/properties/${property.id}`}>
                                            <Button variant="outline" size="sm">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        {property.status === 'pending' && (
                                            <Link href={`/admin/properties`}>
                                                <Button size="sm">
                                                    Review
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))}
                            
                            {recentProperties.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <Building className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                                    <p>No recent property submissions</p>
                                </div>
                            )}
                        </div>
                        
                        {recentProperties.length > 0 && (
                            <div className="mt-6 text-center">
                                <Link href="/admin/properties">
                                    <Button variant="outline">View All Properties</Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}