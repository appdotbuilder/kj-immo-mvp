import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Home, Bed, Square, User, ChevronLeft, ChevronRight } from 'lucide-react';

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

interface Props {
    property: Property;
    [key: string]: unknown;
}

export default function PropertyShow({ property }: Props) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const formatPrice = (price: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
        }).format(parseFloat(price));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const nextImage = () => {
        if (property.images.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
        }
    };

    const prevImage = () => {
        if (property.images.length > 0) {
            setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
        }
    };

    return (
        <>
            <Head title={`${property.title} - KJ Immo`} />
            
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

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Breadcrumb */}
                    <nav className="flex mb-6 text-sm">
                        <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
                        <span className="mx-2 text-gray-400">/</span>
                        <Link href="/properties" className="text-gray-500 hover:text-gray-700">Properties</Link>
                        <span className="mx-2 text-gray-400">/</span>
                        <span className="text-gray-900">{property.title}</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            {/* Image Gallery */}
                            <Card className="mb-6 overflow-hidden">
                                <div className="aspect-video bg-gray-200 relative">
                                    {property.images.length > 0 ? (
                                        <>
                                            <img 
                                                src={`/storage/${property.images[currentImageIndex].path}`}
                                                alt={property.images[currentImageIndex].alt_text}
                                                className="w-full h-full object-cover"
                                            />
                                            {property.images.length > 1 && (
                                                <>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90"
                                                        onClick={prevImage}
                                                    >
                                                        <ChevronLeft className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90"
                                                        onClick={nextImage}
                                                    >
                                                        <ChevronRight className="h-4 w-4" />
                                                    </Button>
                                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                                        {property.images.map((_, index) => (
                                                            <button
                                                                key={index}
                                                                className={`w-2 h-2 rounded-full ${
                                                                    index === currentImageIndex 
                                                                        ? 'bg-white' 
                                                                        : 'bg-white/50'
                                                                }`}
                                                                onClick={() => setCurrentImageIndex(index)}
                                                            />
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400">
                                            <Home size={64} />
                                        </div>
                                    )}
                                </div>
                            </Card>

                            {/* Property Details */}
                            <Card>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-3xl mb-2">{property.title}</CardTitle>
                                            <CardDescription className="flex items-center text-base">
                                                <MapPin size={16} className="mr-2" />
                                                {property.city}, {property.neighborhood}
                                            </CardDescription>
                                        </div>
                                        <Badge variant="outline" className="text-xs">
                                            Listed {formatDate(property.created_at)}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-3 gap-4 mb-6">
                                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                                            <div className="text-2xl font-bold text-primary">
                                                {formatPrice(property.price)}
                                            </div>
                                            <div className="text-sm text-gray-600">Price</div>
                                        </div>
                                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                                            <div className="flex items-center justify-center mb-1">
                                                <Square className="h-5 w-5 text-primary mr-1" />
                                                <span className="text-2xl font-bold">{property.surface_area}</span>
                                            </div>
                                            <div className="text-sm text-gray-600">m² Surface</div>
                                        </div>
                                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                                            <div className="flex items-center justify-center mb-1">
                                                <Bed className="h-5 w-5 text-primary mr-1" />
                                                <span className="text-2xl font-bold">{property.bedrooms}</span>
                                            </div>
                                            <div className="text-sm text-gray-600">Bedroom{property.bedrooms !== 1 ? 's' : ''}</div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-3">Description</h3>
                                        <p className="text-gray-700 leading-relaxed">
                                            {property.description}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            {/* Agent Info */}
                            <Card className="mb-6">
                                <CardHeader>
                                    <CardTitle className="text-xl">Contact Agent</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                                            <User className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">{property.user.name}</h4>
                                            <p className="text-sm text-gray-600 capitalize">{property.user.role}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Button className="w-full">
                                            Contact Agent
                                        </Button>
                                        <Button variant="outline" className="w-full">
                                            Schedule Viewing
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Property Summary */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl">Property Summary</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Price</span>
                                            <span className="font-semibold">{formatPrice(property.price)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Surface Area</span>
                                            <span className="font-semibold">{property.surface_area} m²</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Bedrooms</span>
                                            <span className="font-semibold">{property.bedrooms}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Location</span>
                                            <span className="font-semibold">{property.city}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Neighborhood</span>
                                            <span className="font-semibold">{property.neighborhood}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Listed</span>
                                            <span className="font-semibold">{formatDate(property.created_at)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Back to Search */}
                    <div className="mt-8 text-center">
                        <Link href="/properties">
                            <Button variant="outline">
                                ← Back to Properties
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}