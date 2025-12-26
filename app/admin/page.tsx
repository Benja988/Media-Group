// app/admin/page.tsx

import Link from 'next/link';
import { FileText, Users, Radio, BarChart3, Plus, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your media group's content and analytics</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Content</h3>
                        <FileText className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="mt-2">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
                        <p className="text-xs text-gray-500">+0 from last month</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Stations</h3>
                        <Radio className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="mt-2">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
                        <p className="text-xs text-gray-500">+0 from last month</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</h3>
                        <Users className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="mt-2">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
                        <p className="text-xs text-gray-500">+0 from last month</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Views</h3>
                        <TrendingUp className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="mt-2">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
                        <p className="text-xs text-gray-500">+0% from last month</p>
                    </div>
                </div>
            </div>

            {/* Main Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Content Management</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Create, edit, and manage your content across all stations.
                    </p>
                    <Link
                        href="/admin/content"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Manage Content
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Station Management</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Manage your radio and TV stations and their configurations.
                    </p>
                    <Link
                        href="/admin/stations"
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Manage Stations
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Analytics</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        View detailed analytics and performance metrics.
                    </p>
                    <Link
                        href="/admin/analytics"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Analytics
                    </Link>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mt-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">No recent activity to display.</p>
            </div>
        </div>
    );
}