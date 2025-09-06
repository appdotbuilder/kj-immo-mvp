import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Home, Users, Shield } from 'lucide-react';

interface Property {
    id: number;
    title: string;
    description: string;
    price: string;
    surface_area: number;
    bedrooms: number;
    city: string;
    neighborhood: string;
    status: string;
    user: {
        id: number;
        name: string;
        role: string;
    };
    images: Array<{
        id: number;
        path: string;
        alt_text: string;
    }>;
    created_at: string;
}

interface SearchFilters {
    city?: string;
    min_price?: string;
    max_price?: string;
    min_surface?: string;
    max_surface?: string;
    bedrooms?: string;
    [key: string]: unknown;
}

interface Props {
    recentProperties: Property[];
    searchResults?: {
        data: Property[];
        links: unknown;
        meta: unknown;
    };
    filters: SearchFilters;
    [key: string]: unknown;
}

export default function Welcome({ recentProperties, searchResults, filters }: Props) {
    const [searchData, setSearchData] = useState<SearchFilters>(filters);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        Object.entries(searchData).forEach(([key, value]) => {
            if (value) params.append(key, String(value));
        });
        router.get('/?' + params.toString(), {}, { preserveState: true });
    };

    const formatPrice = (price: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
        }).format(parseFloat(price));
    };

    const PropertyCard = ({ property }: { property: Property }) => (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gray-200 relative">
                {property.images.length > 0 ? (
                    <img 
                        src={`/storage/${property.images[0].path}`}
                        alt={property.images[0].alt_text}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        <Home size={48} />
                    </div>
                )}
                <Badge className="absolute top-2 right-2">
                    {property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}
                </Badge>
            </div>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg line-clamp-1">{property.title}</CardTitle>
                <CardDescription className="flex items-center text-sm">
                    <MapPin size={14} className="mr-1" />
                    {property.city}, {property.neighborhood}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-bold text-primary">
                        {formatPrice(property.price)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                        {property.surface_area} m²
                    </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {property.description}
                </p>
                <Link href={`/properties/${property.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                        View Details
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );

    return (
        <>
            <Head title="KJ Immo - Find Your Dream Property" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                {/* Header */}
                <header className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            <div className="flex items-center space-x-4">
                                <Home className="h-8 w-8 text-primary" />
                                <h1 className="text-2xl font-bold text-gray-900">KJ Immo</h1>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Link href="/properties" className="text-gray-600 hover:text-primary">
                                    Browse Properties
                                </Link>
                                <Link href="/login">
                                    <Button variant="outline" size="sm">Log In</Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="sm">Get Started</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            🏡 Find Your Dream Property
                        </h2>
                        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                            Discover the perfect home with our comprehensive real estate platform. 
                            Search, explore, and connect with trusted agents.
                        </p>

                        {/* Search Form */}
                        <Card className="max-w-4xl mx-auto">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-center">
                                    <Search className="mr-2" />
                                    Search Properties
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                    <Input
                                        placeholder="City"
                                        value={searchData.city || ''}
                                        onChange={(e) => setSearchData({ ...searchData, city: e.target.value })}
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Min Price"
                                        value={searchData.min_price || ''}
                                        onChange={(e) => setSearchData({ ...searchData, min_price: e.target.value })}
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Max Price"
                                        value={searchData.max_price || ''}
                                        onChange={(e) => setSearchData({ ...searchData, max_price: e.target.value })}
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Min Surface"
                                        value={searchData.min_surface || ''}
                                        onChange={(e) => setSearchData({ ...searchData, min_surface: e.target.value })}
                                    />
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                        value={searchData.bedrooms || ''}
                                        onChange={(e) => setSearchData({ ...searchData, bedrooms: e.target.value })}
                                    >
                                        <option value="">Any bedrooms</option>
                                        <option value="1">1 bedroom</option>
                                        <option value="2">2 bedrooms</option>
                                        <option value="3">3 bedrooms</option>
                                        <option value="4">4+ bedrooms</option>
                                    </select>
                                    <Button type="submit" className="w-full">
                                        Search
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">
                                Why Choose KJ Immo? 🌟
                            </h3>
                            <p className="text-xl text-gray-600">
                                Your trusted partner in real estate
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="text-primary" size={32} />
                                </div>
                                <h4 className="text-xl font-semibold mb-2">Smart Search</h4>
                                <p className="text-gray-600">
                                    Advanced filters to find exactly what you're looking for
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="text-primary" size={32} />
                                </div>
                                <h4 className="text-xl font-semibold mb-2">Trusted Agents</h4>
                                <p className="text-gray-600">
                                    Connect with verified real estate professionals
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Shield className="text-primary" size={32} />
                                </div>
                                <h4 className="text-xl font-semibold mb-2">Secure Platform</h4>
                                <p className="text-gray-600">
                                    Safe and secure transactions with admin moderation
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Search Results or Recent Properties */}
                <section className="py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                            {searchResults ? '🔍 Search Results' : '🆕 Recent Properties'}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(searchResults?.data || recentProperties).map((property) => (
                                <PropertyCard key={property.id} property={property} />
                            ))}
                        </div>

                        {(searchResults?.data || recentProperties).length === 0 && (
                            <div className="text-center py-12">
                                <Home className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <h4 className="text-lg font-medium text-gray-900 mb-2">
                                    {searchResults ? 'No properties found' : 'No properties available'}
                                </h4>
                                <p className="text-gray-600">
                                    {searchResults ? 'Try adjusting your search filters' : 'Check back soon for new listings'}
                                </p>
                            </div>
                        )}

                        {!searchResults && recentProperties.length > 0 && (
                            <div className="text-center mt-8">
                                <Link href="/properties">
                                    <Button size="lg">View All Properties</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 bg-primary text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h3 className="text-3xl font-bold mb-4">Ready to Get Started? 🚀</h3>
                        <p className="text-xl mb-8 opacity-90">
                            Join thousands of users who trust KJ Immo for their real estate needs
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/register">
                                <Button size="lg" variant="secondary">
                                    Register as Client
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
                                    Become an Agent
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="flex items-center justify-center space-x-2 mb-4">
                            <Home className="h-6 w-6" />
                            <span className="text-lg font-semibold">KJ Immo</span>
                        </div>
                        <p className="text-gray-400">
                            © 2024 KJ Immo. Find your dream property with confidence.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}