// app/media-group/page.tsx

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  Radio,
  Tv,
  Newspaper,
  Users,
  Calendar,
  ExternalLink,
  Shield,
  Edit,
  Settings,
  Bell,
  Megaphone,
  Building2,
} from 'lucide-react';

// Type definitions based on your MediaGroup model
interface MediaGroup {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  branding?: {
    primaryColor?: string;
    secondaryColor?: string;
    websiteUrl?: string;
  };
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  status: 'active' | 'inactive' | 'archived';
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

async function fetchActiveMediaGroup(): Promise<MediaGroup | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/media-groups?status=active&limit=1`,
      {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch media group: ${response.statusText}`);
    }

    const mediaGroups = await response.json();
    return mediaGroups[0] || null;
  } catch (error) {
    console.error('Error fetching media group:', error);
    return null;
  }
}

export default async function MediaGroupPage() {
  // Fetch the single active media group
  const mediaGroup = await fetchActiveMediaGroup();
  
  if (!mediaGroup) {
    return notFound();
  }

  // Helper function to determine status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Navigation Bar */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {mediaGroup.logoUrl && (
                <div className="relative w-10 h-10">
                  <Image
                    src={mediaGroup.logoUrl}
                    alt={`${mediaGroup.name} Logo`}
                    fill
                    className="object-contain"
                    sizes="40px"
                  />
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {mediaGroup.name}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Media Group</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(mediaGroup.status)}`}>
                {mediaGroup.status.charAt(0).toUpperCase() + mediaGroup.status.slice(1)}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <Shield className="h-4 w-4" />
                Admin Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div 
        className="relative overflow-hidden"
        style={{
          backgroundColor: mediaGroup.branding?.primaryColor || '#2563eb',
          backgroundImage: mediaGroup.branding?.primaryColor && mediaGroup.branding?.secondaryColor 
            ? `linear-gradient(135deg, ${mediaGroup.branding.primaryColor} 0%, ${mediaGroup.branding.secondaryColor} 100%)`
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 md:px-6 py-12 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex flex-col items-center gap-6">
              {mediaGroup.logoUrl && (
                <div className="relative w-32 h-32 md:w-48 md:h-48 bg-white/10 backdrop-blur-sm rounded-full p-4 shadow-2xl">
                  <Image
                    src={mediaGroup.logoUrl}
                    alt={`${mediaGroup.name} Logo`}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 768px) 128px, 192px"
                  />
                </div>
              )}
              
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Building2 className="h-5 w-5 text-white" />
                  <span className="text-white font-medium">Media Group</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
                  {mediaGroup.name}
                </h1>
                
                {mediaGroup.description && (
                  <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
                    {mediaGroup.description}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center mt-8">
              {mediaGroup.branding?.websiteUrl && (
                <a
                  href={mediaGroup.branding.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                >
                  <Globe className="h-5 w-5" />
                  Visit Website
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
              
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
              >
                <Bell className="h-5 w-5" />
                Contact Us
              </Link>
            </div>
          </div>
        </div>
        
        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 text-gray-50 dark:text-gray-900" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 -mt-2 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Established</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {new Date(mediaGroup.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                    </p>
                  </div>
                  <Calendar className="h-10 w-10 text-blue-500" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                      {mediaGroup.status}
                    </p>
                  </div>
                  <div className={`p-2 rounded-full ${mediaGroup.status === 'active' ? 'bg-green-100 dark:bg-green-900' : 'bg-yellow-100 dark:bg-yellow-900'}`}>
                    <Bell className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {new Date(mediaGroup.updatedAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <Edit className="h-10 w-10 text-purple-500" />
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                <Building2 className="h-8 w-8 text-blue-500" />
                About Our Media Group
              </h2>
              
              <div className="space-y-6">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  {mediaGroup.description ? (
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                      {mediaGroup.description}
                    </p>
                  ) : (
                    <div className="text-center py-8">
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 inline-block">
                        <p className="text-gray-500 dark:text-gray-400 italic">
                          No description provided for this media group.
                        </p>
                        <Link
                          href="/admin"
                          className="inline-flex items-center gap-2 mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        >
                          <Settings className="h-4 w-4" />
                          Add description in admin panel
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Media Channels */}
                <div className="mt-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Megaphone className="h-6 w-6 text-blue-500" />
                    Our Media Platforms
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link
                      href="/stations?type=radio"
                      className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl p-6 border border-blue-200 dark:border-blue-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200 dark:bg-blue-800 rounded-full -translate-y-12 translate-x-12 group-hover:scale-125 transition-transform" />
                      <div className="relative z-10">
                        <div className="p-3 bg-blue-500 rounded-xl w-14 h-14 mb-6 group-hover:scale-110 transition-transform">
                          <Radio className="h-8 w-8 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Radio Stations</h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          Live broadcasts, music, and talk shows
                        </p>
                        <span className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium">
                          Explore Stations
                          <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </span>
                      </div>
                    </Link>

                    <Link
                      href="/stations?type=tv"
                      className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-2xl p-6 border border-purple-200 dark:border-purple-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-purple-200 dark:bg-purple-800 rounded-full -translate-y-12 translate-x-12 group-hover:scale-125 transition-transform" />
                      <div className="relative z-10">
                        <div className="p-3 bg-purple-500 rounded-xl w-14 h-14 mb-6 group-hover:scale-110 transition-transform">
                          <Tv className="h-8 w-8 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">TV Channels</h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          Video content, news, and entertainment
                        </p>
                        <span className="inline-flex items-center text-purple-600 dark:text-purple-400 font-medium">
                          Watch Now
                          <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </span>
                      </div>
                    </Link>

                    <Link
                      href="/content"
                      className="group relative overflow-hidden bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-2xl p-6 border border-green-200 dark:border-green-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-green-200 dark:bg-green-800 rounded-full -translate-y-12 translate-x-12 group-hover:scale-125 transition-transform" />
                      <div className="relative z-10">
                        <div className="p-3 bg-green-500 rounded-xl w-14 h-14 mb-6 group-hover:scale-110 transition-transform">
                          <Newspaper className="h-8 w-8 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Digital Content</h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          Articles, news, blogs, and podcasts
                        </p>
                        <span className="inline-flex items-center text-green-600 dark:text-green-400 font-medium">
                          Read More
                          <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Contact Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 pb-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                <Users className="h-6 w-6 text-blue-500" />
                Contact Information
              </h2>
              
              <div className="space-y-6">
                {mediaGroup.contactInfo?.email ? (
                  <div className="flex items-start gap-4 group">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg group-hover:scale-110 transition-transform">
                      <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
                      <a 
                        href={`mailto:${mediaGroup.contactInfo.email}`}
                        className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium break-all"
                      >
                        {mediaGroup.contactInfo.email}
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      No email provided
                    </p>
                  </div>
                )}
                
                {mediaGroup.contactInfo?.phone ? (
                  <div className="flex items-start gap-4 group">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg group-hover:scale-110 transition-transform">
                      <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Phone</p>
                      <a 
                        href={`tel:${mediaGroup.contactInfo.phone}`}
                        className="text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-400 transition-colors font-medium"
                      >
                        {mediaGroup.contactInfo.phone}
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      No phone number provided
                    </p>
                  </div>
                )}
                
                {mediaGroup.contactInfo?.address ? (
                  <div className="flex items-start gap-4 group">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg group-hover:scale-110 transition-transform">
                      <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Address</p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {mediaGroup.contactInfo.address}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      No address provided
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
                <Link
                  href="/admin"
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5 text-gray-500" />
                    <span className="font-medium text-gray-900 dark:text-white">Admin Settings</span>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                
                {mediaGroup.branding?.websiteUrl && (
                  <a
                    href={mediaGroup.branding.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-blue-500" />
                      <span className="font-medium text-blue-700 dark:text-blue-300">Official Website</span>
                    </div>
                    <ExternalLink className="h-4 w-4 text-blue-400" />
                  </a>
                )}
              </div>
            </div>

            {/* Brand Identity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Brand Information
              </h3>
              
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Media Group ID</p>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 font-mono text-gray-900 dark:text-gray-300 text-sm truncate">
                    {mediaGroup._id}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">URL Slug</p>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 font-mono text-gray-900 dark:text-gray-300">
                    {mediaGroup.slug}
                  </div>
                </div>
                
                {(mediaGroup.branding?.primaryColor || mediaGroup.branding?.secondaryColor) && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Brand Colors</p>
                    <div className="flex gap-4">
                      {mediaGroup.branding.primaryColor && (
                        <div className="flex-1">
                          <div 
                            className="h-12 rounded-lg mb-2 border border-gray-200 dark:border-gray-700"
                            style={{ backgroundColor: mediaGroup.branding.primaryColor }}
                          />
                          <p className="text-xs font-medium text-center text-gray-900 dark:text-white">Primary</p>
                          <p className="text-xs text-gray-500 font-mono text-center truncate">
                            {mediaGroup.branding.primaryColor}
                          </p>
                        </div>
                      )}
                      
                      {mediaGroup.branding.secondaryColor && (
                        <div className="flex-1">
                          <div 
                            className="h-12 rounded-lg mb-2 border border-gray-200 dark:border-gray-700"
                            style={{ backgroundColor: mediaGroup.branding.secondaryColor }}
                          />
                          <p className="text-xs font-medium text-center text-gray-900 dark:text-white">Secondary</p>
                          <p className="text-xs text-gray-500 font-mono text-center truncate">
                            {mediaGroup.branding.secondaryColor}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              {mediaGroup.logoUrl && (
                <div className="relative w-8 h-8">
                  <Image
                    src={mediaGroup.logoUrl}
                    alt={`${mediaGroup.name} Logo`}
                    fill
                    className="object-contain"
                    sizes="32px"
                  />
                </div>
              )}
              <div>
                <p className="font-bold text-gray-900 dark:text-white">{mediaGroup.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Media Group</p>
              </div>
            </div>
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>© {new Date().getFullYear()} {mediaGroup.name}. All rights reserved.</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                Admin Panel
              </Link>
              {mediaGroup.branding?.websiteUrl && (
                <a
                  href={mediaGroup.branding.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  Website
                </a>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}