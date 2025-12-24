"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Home, Mic2, Music, Users, Search, User, Bell, Headphones, X } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export default function SiteNav() {
  const isAuthenticated = false;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

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
            {/* Search */}
            {/* <div className="hidden md:flex items-center">
              <Search className="h-4 w-4 text-gray-400 mr-2" />
              <input 
                type="search" 
                placeholder="Search..." 
                className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 w-40"
              />
            </div> 
            
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              <Bell className="h-5 w-5" />
            </button>*/}
            
            <ThemeToggle />
            
            {/* Auth */}
            {isAuthenticated ? (
              <Link href="/profile" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <User className="h-5 w-5" />
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="px-3 py-1.5 text-sm dark:text-white">Sign In</Link>
                <Link 
                  href="/register" 
                  className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg text-sm"
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
              {mobileOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation (toggle on small screens) */}
        <div className={`${mobileOpen ? 'flex' : 'hidden'} md:hidden items-center justify-around py-3 border-t border-gray-200 dark:border-gray-800 mt-1`}>
          <MobileNavLink href="/" icon={<Home className="h-5 w-5" />}>Home</MobileNavLink>
          <MobileNavLink href="/stations" icon={<Mic2 className="h-5 w-5" />}>Stations</MobileNavLink>
          <MobileNavLink href="/media" icon={<Music className="h-5 w-5" />}>Media</MobileNavLink>
          <MobileNavLink href="/groups" icon={<Users className="h-5 w-5" />}>Groups</MobileNavLink>
          <MobileNavLink href="/live" icon={<Headphones className="h-5 w-5" />}>Live</MobileNavLink>
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