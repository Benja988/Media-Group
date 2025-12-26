"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, Mic2, Music, Users, User as UserIcon, Settings, LogOut, X, Headphones } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { ThemeToggle } from '@/components/theme/ThemeToggle'; 
import { useAuth } from '@/context/AuthContext';

export default function SiteNav() {
  const { user, loading, logout, isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (profileDropdownOpen && !event.target.closest('.profile-dropdown')) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [profileDropdownOpen]);

  return (
    <nav className="site-nav sticky top-0 z-50 bg-white/90 dark:bg-primary/90 backdrop-blur-md border-b border-gray-200 dark:border-blue-950">
      <div className="container-width">
        <div className="flex items-center justify-between h-14">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            {!logoError ? (
              <img
                src="/logo.jpg"
                alt="Tetemeko Media Group"
                className="h-10 w-10 object-cover"
                onError={() => setLogoError(true)}
              />
            ) : (
              <Logo className="h-8 w-8 rounded-lg" />
            )}
            <span className="hidden sm:inline text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
              Tetemeko Media Group
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            <NavLink href="/" icon={<Home className="h-4 w-4" />}>Home</NavLink>
            <NavLink href="/stations" icon={<Mic2 className="h-4 w-4" />}>Stations</NavLink>
            <NavLink href="/media" icon={<Music className="h-4 w-4" />}>Media</NavLink>
            <NavLink href="/groups" icon={<Users className="h-4 w-4" />}>Groups</NavLink>
            <Link 
              href="/live" 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-sm font-medium"
            >
              <div className="relative">
                <span className="animate-ping absolute h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
                <span className="relative h-2 w-2 rounded-full bg-red-500"></span>
              </div>
              Live Now
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            {/* Auth Section */}
            {isAuthenticated && user ? (
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  aria-expanded={profileDropdownOpen}
                  aria-haspopup="true"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                    {user.name?.[0]?.toUpperCase() || <UserIcon className="h-4 w-4" />}
                  </div>
                  <span className="hidden md:inline text-sm font-medium">
                    {user.name?.split(' ')[0] || 'Profile'}
                  </span>
                </button>
                
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-semibold">{user.name || 'User'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                    </div>
                    
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <UserIcon className="h-4 w-4" />
                      My Profile
                    </Link>
                    
                    <Link
                      href="/settings"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>

                    {["super_admin", "group_admin", "station_admin"].includes(user.role) && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        Admin Panel
                      </Link>
                    )}

                    <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                    
                    <button
                      onClick={async () => {
                        await logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-red-600 dark:text-red-400"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="px-3 py-1.5 text-sm dark:text-white hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                  Sign In
                </Link>
                <Link 
                  href="/register" 
                  className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg text-sm font-medium transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen}
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`${mobileOpen ? 'flex' : 'hidden'} md:hidden items-center justify-around py-3 border-t border-gray-200 dark:border-gray-800 mt-1`}>
          <MobileNavLink href="/" icon={<Home className="h-5 w-5" />}>Home</MobileNavLink>
          <MobileNavLink href="/stations" icon={<Mic2 className="h-5 w-5" />}>Stations</MobileNavLink>
          <MobileNavLink href="/media" icon={<Music className="h-5 w-5" />}>Media</MobileNavLink>
          <MobileNavLink href="/groups" icon={<Users className="h-5 w-5" />}>Groups</MobileNavLink>
          <MobileNavLink href="/live" icon={<Headphones className="h-5 w-5" />}>Live</MobileNavLink>
          {isAuthenticated && <MobileNavLink href="/profile" icon={<UserIcon className="h-5 w-5" />}>Profile</MobileNavLink>}
        </div>
      </div>
    </nav>
  );
}

// Reusable NavLink components
function NavLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: string }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
    >
      {icon}
      {children}
    </Link>
  );
}

function MobileNavLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: string }) {
  return (
    <Link 
      href={href} 
      className="flex flex-col items-center gap-1 text-xs text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
    >
      {icon}
      {children}
    </Link>
  );
}
