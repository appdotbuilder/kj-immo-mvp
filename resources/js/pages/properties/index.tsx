import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Home } from 'lucide-react';

interface Property {
    id: number;
    title: string;
    description: string;
    price: string;
    surface_area: number;
    bedrooms: number;
    city: string;
    neighborhood: string;
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

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    properties: {
        data: Property[];
        links: PaginationLink[];
        meta: {
            total: number;
        };
    };
    filters: SearchFilters;
    [key: string]: unknown;
}

export default function PropertiesIndex({ properties, filters }: Props) {
    const [searchData, setSearchData] = useState<SearchFilters>(filters);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        Object.entries(searchData).forEach(([key, value]) => {
            if (value) params.append(key, String(value));
        });
        router.get('/properties?' + params.toString(), {}, { preserveState: true });
    };

    const formatPrice = (price: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
        }).format(parseFloat(price));
    };

    return (
        <>
            <Head title="Browse Properties - KJ Immo" />
            
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            <Link href="/" className="flex items-center space-x-4">
                                <Home className="h-8 w-8 text-primary" />
                                <h1 className="text-2xl font-bold text-gray-900">KJ Immo</h1>
                            </Link>
                            <div className="flex items-center space-x-4">
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

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Search Form */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center">
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
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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

                    {/* Results */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Properties ({properties.meta.total})
                        </h2>
                        <p className="text-gray-600">
                            Find your perfect property from our listings
                        </p>
                    </div>

                    {/* Property Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {properties.data.map((property) => (
                            <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-muted-foreground">
                                            by {property.user.name}
                                        </span>
                                        <Link href={`/properties/${property.id}`}>
                                            <Button variant="outline" size="sm">
                                                View Details
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {properties.data.length === 0 && (
                        <div className="text-center py-12">
                            <Home className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No properties found
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Try adjusting your search filters to find more properties.
                            </p>
                            <Link href="/">
                                <Button>Back to Home</Button>
                            </Link>
                        </div>
                    )}

                    {/* Pagination */}
                    {properties.links && properties.data.length > 0 && (
                        <div className="flex justify-center space-x-2">
                            {properties.links.map((link, index: number) => (
                                link.url ? (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className={`px-3 py-2 text-sm rounded-md ${
                                            link.active 
                                                ? 'bg-primary text-white' 
                                                : 'bg-white text-gray-700 hover:bg-gray-50 border'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span
                                        key={index}
                                        className="px-3 py-2 text-sm text-gray-400"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                )
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}