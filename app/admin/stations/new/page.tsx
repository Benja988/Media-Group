// app/admin/stations/new/page.tsx

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Radio, Tv, Upload } from 'lucide-react';

export default function NewStationPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: 'radio',
        frequency: '',
        region: '',
        logoUrl: '',
        description: '',
        status: 'active',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // For demo purposes, using a hardcoded mediaGroupId
            // In production, this should come from the authenticated user's context
            const stationData = {
                ...formData,
                mediaGroupId: '507f1f77bcf86cd799439011', // Example ObjectId
            };

            const response = await fetch('/api/stations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(stationData),
            });

            if (response.ok) {
                router.push('/admin/stations');
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to create station');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <div className="p-6">
            <div className="mb-8">
                <Link
                    href="/admin/stations"
                    className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Stations
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Station</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Add a new radio or TV station to your network</p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-4xl">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div className="space-y-6">
                            {/* Station Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Station Type *
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, type: 'radio' }))}
                                        className={`flex items-center justify-center gap-3 p-4 border-2 rounded-lg transition-all ${
                                            formData.type === 'radio'
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                                : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 text-gray-700 dark:text-gray-300'
                                        }`}
                                    >
                                        <Radio className="h-5 w-5" />
                                        <span className="font-medium">Radio</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, type: 'tv' }))}
                                        className={`flex items-center justify-center gap-3 p-4 border-2 rounded-lg transition-all ${
                                            formData.type === 'tv'
                                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                                                : 'border-gray-300 dark:border-gray-600 hover:border-purple-400 text-gray-700 dark:text-gray-300'
                                        }`}
                                    >
                                        <Tv className="h-5 w-5" />
                                        <span className="font-medium">TV</span>
                                    </button>
                                </div>
                            </div>

                            {/* Station Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Station Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    placeholder="Enter station name"
                                    required
                                />
                            </div>

                            {/* Frequency */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Frequency {formData.type === 'radio' ? '*' : '(Optional)'}
                                </label>
                                <input
                                    type="text"
                                    name="frequency"
                                    value={formData.frequency}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    placeholder={formData.type === 'radio' ? 'e.g., 95.5 FM' : 'e.g., Channel 5'}
                                    required={formData.type === 'radio'}
                                />
                            </div>

                            {/* Region */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Region
                                </label>
                                <input
                                    type="text"
                                    name="region"
                                    value={formData.region}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    placeholder="e.g., Nairobi, Kenya"
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Logo URL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Logo URL
                                </label>
                                <div className="flex gap-3">
                                    <input
                                        type="url"
                                        name="logoUrl"
                                        value={formData.logoUrl}
                                        onChange={handleChange}
                                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        placeholder="https://example.com/logo.png"
                                    />
                                    <button
                                        type="button"
                                        className="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                        title="Upload Logo"
                                    >
                                        <Upload className="h-5 w-5" />
                                    </button>
                                </div>
                                {formData.logoUrl && (
                                    <div className="mt-3">
                                        <img
                                            src={formData.logoUrl}
                                            alt="Logo preview"
                                            className="w-16 h-16 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={6}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                                    placeholder="Describe your station..."
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {formData.description.length}/500 characters
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preview</h3>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-lg ${
                                    formData.type === 'radio'
                                        ? 'bg-blue-100 dark:bg-blue-900'
                                        : 'bg-purple-100 dark:bg-purple-900'
                                }`}>
                                    {formData.type === 'radio' ? (
                                        <Radio className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    ) : (
                                        <Tv className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">
                                        {formData.name || 'Station Name'}
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {formData.frequency || 'Frequency'} • {formData.region || 'Region'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 mt-8">
                    <Link
                        href="/admin/stations"
                        className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading || !formData.name.trim()}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                        <Save className="h-5 w-5" />
                        {loading ? 'Creating...' : 'Create Station'}
                    </button>
                </div>
            </form>
        </div>
    );
}