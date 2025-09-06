import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ImagePlus } from 'lucide-react';



export default function CreateProperty() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        price: '',
        surface_area: '',
        bedrooms: '',
        city: '',
        neighborhood: '',
        images: [] as File[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/properties');
    };

    return (
        <AppShell>
            <Head title="Create Property - KJ Immo" />
            
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center mb-4">
                        <Home className="h-8 w-8 text-primary mr-3" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Create New Property Listing
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Add a new property to your listings
                            </p>
                        </div>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Property Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                        Property Title *
                                    </label>
                                    <Input
                                        id="title"
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="e.g., Beautiful Family Home"
                                        className={errors.title ? 'border-red-500' : ''}
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-red-600 mt-1">{errors.title}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                                        Price (€) *
                                    </label>
                                    <Input
                                        id="price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        placeholder="250000"
                                        className={errors.price ? 'border-red-500' : ''}
                                    />
                                    {errors.price && (
                                        <p className="text-sm text-red-600 mt-1">{errors.price}</p>
                                    )}
                                </div>
                            </div>

                            {/* Property Details */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label htmlFor="surface_area" className="block text-sm font-medium text-gray-700 mb-2">
                                        Surface Area (m²) *
                                    </label>
                                    <Input
                                        id="surface_area"
                                        type="number"
                                        min="1"
                                        value={data.surface_area}
                                        onChange={(e) => setData('surface_area', e.target.value)}
                                        placeholder="120"
                                        className={errors.surface_area ? 'border-red-500' : ''}
                                    />
                                    {errors.surface_area && (
                                        <p className="text-sm text-red-600 mt-1">{errors.surface_area}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-2">
                                        Bedrooms *
                                    </label>
                                    <Input
                                        id="bedrooms"
                                        type="number"
                                        min="0"
                                        max="20"
                                        value={data.bedrooms}
                                        onChange={(e) => setData('bedrooms', e.target.value)}
                                        placeholder="3"
                                        className={errors.bedrooms ? 'border-red-500' : ''}
                                    />
                                    {errors.bedrooms && (
                                        <p className="text-sm text-red-600 mt-1">{errors.bedrooms}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                                        City *
                                    </label>
                                    <Input
                                        id="city"
                                        type="text"
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                        placeholder="Brussels"
                                        className={errors.city ? 'border-red-500' : ''}
                                    />
                                    {errors.city && (
                                        <p className="text-sm text-red-600 mt-1">{errors.city}</p>
                                    )}
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-2">
                                    Neighborhood *
                                </label>
                                <Input
                                    id="neighborhood"
                                    type="text"
                                    value={data.neighborhood}
                                    onChange={(e) => setData('neighborhood', e.target.value)}
                                    placeholder="Ixelles"
                                    className={errors.neighborhood ? 'border-red-500' : ''}
                                />
                                {errors.neighborhood && (
                                    <p className="text-sm text-red-600 mt-1">{errors.neighborhood}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    id="description"
                                    rows={6}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Describe the property, its features, and surroundings..."
                                    className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                                        errors.description ? 'border-red-500' : ''
                                    }`}
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                                )}
                            </div>

                            {/* Images */}
                            <div>
                                <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
                                    Property Images (Max 10 images)
                                </label>
                                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                    <div className="text-center">
                                        <ImagePlus className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                            <label
                                                htmlFor="images"
                                                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                            >
                                                <span>Upload files</span>
                                                <input
                                                    id="images"
                                                    name="images"
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    max="10"
                                                    className="sr-only"
                                                    onChange={(e) => setData('images', e.target.files ? Array.from(e.target.files) : [])}
                                                />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs leading-5 text-gray-600">PNG, JPG, JPEG, WebP up to 2MB each</p>
                                    </div>
                                </div>
                                {errors.images && (
                                    <p className="text-sm text-red-600 mt-1">{errors.images}</p>
                                )}
                            </div>

                            {/* Submit */}
                            <div className="flex justify-end space-x-4 pt-6 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                >
                                    {processing ? 'Creating...' : 'Create Property'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}