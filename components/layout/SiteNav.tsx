"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, Mic2, Music, Users, User as UserIcon, 
  Settings, LogOut, X, Headphones, Newspaper, 
  Store, Podcast, ChevronDown, Menu, Radio,
  Sparkles, Zap, Shield, Globe, TrendingUp, Tv
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { useAuth } from '@/context/AuthContext';

// Helper function for conditional class names
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

export default function SiteNav() {
  const { user, loading, logout, isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setProfileDropdownOpen(false);
        setMobileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setProfileDropdownOpen(false);
  }, [pathname]);

  const handleLogout = useCallback(async () => {
    await logout();
    setProfileDropdownOpen(false);
  }, [logout]);

  const authUser = isAuthenticated ? user : null;

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/stations', label: 'Stations', icon: Mic2 },
    { href: '/podcasts', label: 'Podcasts', icon: Podcast },
    { href: '/media', label: 'News', icon: Newspaper },
    { href: '/groups', label: 'MarketPlace', icon: Store },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <nav 
        className={cn(
          "sticky top-0 z-50 transition-all duration-300 ease-out",
          scrolled 
            ? "bg-blue-50/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-blue-200/50 dark:border-gray-800/50 shadow-lg shadow-black/5"
            : "bg-blue-50/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-transparent"
        )}
      >
        <div className="container-width px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center gap-3 group"
              aria-label="Tetemeko Media Group Home"
            >
              <div className="relative">
                {!logoError ? (
                  <img
                    src="/logo.jpg"
                    alt="Tetemeko Media Group"
                    className="h-10 w-10 object-cover ring-2 ring-blue-200 dark:ring-gray-700 group-hover:ring-blue-500/20 transition-all duration-300"
                    onError={() => setLogoError(true)}
                    loading="eager"
                  />
                ) : (
                  <Logo className="h-10 w-10 rounded-xl ring-2 ring-blue-200 dark:ring-gray-700 group-hover:ring-blue-500/20 transition-all duration-300" />
                )}
                <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 dark:from-blue-400 dark:to-blue-300 ring-2 ring-white dark:ring-gray-900" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-blue-600 dark:from-blue-400 dark:to-blue-300">
                  Tetemeko Media Group
                </span>
                <span className="text-xs text-blue-700/80 dark:text-blue-300/80 hidden sm:block">
                  Broadcasting Excellence
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <NavLink
                  key={href}
                  href={href}
                  icon={<Icon className="h-4 w-4" />}
                  active={isActive(href)}
                >
                  {label}
                </NavLink>
              ))}
              
              <Link
                href="/live"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 hover:from-blue-700 hover:via-blue-600 hover:to-blue-700 text-white text-sm font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden"
              >
                <div className="relative flex items-center gap-2">
                  <div className="relative">
                    <span className="animate-ping absolute h-2 w-2 rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative h-2 w-2 rounded-full bg-white"></span>
                  </div>
                  <Radio className="h-4 w-4" />
                  <span>Live Now</span>
                </div>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700" />
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Auth Section */}
              {authUser ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className={cn(
                      "flex items-center gap-2 p-1.5 rounded-xl transition-all duration-300",
                      "hover:bg-blue-100 dark:hover:bg-gray-800/50",
                      "ring-1 ring-blue-200 dark:ring-gray-800 hover:ring-blue-500/30",
                      profileDropdownOpen && "ring-blue-500/50 bg-blue-100 dark:bg-gray-800"
                    )}
                    aria-expanded={profileDropdownOpen}
                    aria-haspopup="true"
                    aria-label="User menu"
                  >
                    <div className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400 flex items-center justify-center text-white font-semibold shadow-md">
                      {authUser.name
                        ? authUser.name.charAt(0).toUpperCase()
                        : <UserIcon className="h-4 w-4" />}
                    </div>
                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                        {authUser.name?.split(" ")[0] ?? "Profile"}
                      </span>
                      <span className="text-xs text-blue-700/80 dark:text-blue-300/80">
                        {authUser.role?.replace('_', ' ') ?? "User"}
                      </span>
                    </div>
                    <ChevronDown className={cn(
                      "h-4 w-4 text-blue-600 dark:text-blue-400 transition-transform duration-200",
                      profileDropdownOpen && "rotate-180"
                    )} />
                  </button>

                  {/* Profile Dropdown */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white dark:bg-gray-900 shadow-2xl border border-blue-200 dark:border-gray-800 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-blue-100 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400 flex items-center justify-center text-white font-semibold">
                            {authUser.name?.charAt(0).toUpperCase() ?? "U"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 truncate">
                              {authUser.name ?? "User"}
                            </p>
                            <p className="text-xs text-blue-700/80 dark:text-blue-300/80 truncate">
                              {authUser.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <DropdownLink
                          href="/profile"
                          icon={<UserIcon className="h-4 w-4" />}
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          My Profile
                        </DropdownLink>
                        
                        <DropdownLink
                          href="/settings"
                          icon={<Settings className="h-4 w-4" />}
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          Settings
                        </DropdownLink>

                        {["super_admin", "group_admin", "station_admin"].includes(authUser.role) && (
                          <DropdownLink
                            href="/admin"
                            icon={<Sparkles className="h-4 w-4" />}
                            onClick={() => setProfileDropdownOpen(false)}
                            className="text-blue-600 dark:text-blue-400 font-medium"
                          >
                            <span className="flex-1">Admin Panel</span>
                            <span className="ml-auto text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30">
                              {authUser.role?.split('_')[0]}
                            </span>
                          </DropdownLink>
                        )}
                      </div>

                      {/* Quick Stats in Dropdown */}
                      <div className="px-4 py-3 border-t border-blue-100 dark:border-gray-800">
                        <h4 className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-2">Broadcast Stats</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-center p-2 rounded-lg bg-blue-50/50 dark:bg-gray-800/50">
                            <div className="text-sm font-bold text-blue-900 dark:text-blue-100">99.9%</div>
                            <div className="text-xs text-blue-700/80 dark:text-blue-300/80">Uptime</div>
                          </div>
                          <div className="text-center p-2 rounded-lg bg-blue-50/50 dark:bg-gray-800/50">
                            <div className="text-sm font-bold text-blue-900 dark:text-blue-100">HD</div>
                            <div className="text-xs text-blue-700/80 dark:text-blue-300/80">Audio Quality</div>
                          </div>
                        </div>
                      </div>

                      {/* Logout Button */}
                      <div className="border-t border-blue-100 dark:border-gray-800 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-medium"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-3">
                  <ThemeToggle />
                  <Link
                    href="/login"
                    className="px-4 py-2 text-blue-800 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100 transition-colors font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 hover:scale-[1.02]"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* Theme Toggle for mobile view when logged in */}
              {authUser && (
                <div className="md:hidden">
                  <ThemeToggle />
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-expanded={mobileOpen}
                aria-label="Toggle menu"
                className={cn(
                  "lg:hidden p-2.5 rounded-xl transition-all duration-300",
                  "hover:bg-blue-100 dark:hover:bg-gray-800/50",
                  mobileOpen && "bg-blue-100 dark:bg-gray-800"
                )}
              >
                {mobileOpen ? (
                  <X className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                ) : (
                  <Menu className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={cn(
        "lg:hidden fixed inset-0 z-50 transition-all duration-300 ease-out",
        mobileOpen ? "visible opacity-100" : "invisible opacity-0"
      )}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
        
        {/* Mobile Navigation Panel */}
        <div className={cn(
          "absolute right-0 top-0 h-full w-full max-w-sm bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-out",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}>
          <div className="flex flex-col h-full p-6 overflow-y-auto">
            {/* Header with close button */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-blue-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {!logoError ? (
                    <img
                      src="/logo.jpg"
                      alt="Tetemeko Media Group"
                      className="h-10 w-10 object-cover ring-2 ring-blue-200 dark:ring-gray-700"
                      onError={() => setLogoError(true)}
                    />
                  ) : (
                    <Logo className="h-10 w-10 rounded-xl ring-2 ring-blue-200 dark:ring-gray-700" />
                  )}
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 dark:from-blue-400 dark:to-blue-300 ring-2 ring-white dark:ring-gray-900" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-blue-600 dark:from-blue-400 dark:to-blue-300">
                    Tetemeko Media
                  </span>
                </div>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </button>
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-blue-100 dark:border-gray-800">
              <span className="text-sm font-medium text-blue-800 dark:text-blue-300">Theme</span>
              <ThemeToggle />
            </div>

            {/* Professional Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-xl border shadow-lg bg-gradient-to-br from-blue-50/80 to-blue-100/80 dark:from-gray-900/80 dark:to-gray-950/80 border-blue-500/30 dark:border-blue-400/20 mb-6">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full blur bg-blue-600/30 dark:bg-blue-500/30" />
                  <Sparkles className="relative h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                  Enterprise Broadcast Platform
                </span>
              </div>
            </div>

            {/* Mobile Nav Links */}
            <div className="space-y-2">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <MobileNavLink
                  key={href}
                  href={href}
                  icon={<Icon className="h-5 w-5" />}
                  active={isActive(href)}
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </MobileNavLink>
              ))}
              
              <MobileNavLink
                href="/live"
                icon={<Radio className="h-5 w-5" />}
                active={isActive('/live')}
                onClick={() => setMobileOpen(false)}
                className="bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400 text-white hover:from-blue-700 hover:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-500"
              >
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <span className="animate-ping absolute h-2 w-2 rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative h-2 w-2 rounded-full bg-white"></span>
                  </div>
                  Live Now
                </div>
              </MobileNavLink>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 p-4 rounded-xl bg-blue-50/50 dark:bg-gray-800/50 border border-blue-200/50 dark:border-gray-700/50">
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-3">Broadcast Features</h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Shield, label: 'Secure', value: 'AES-256' },
                  { icon: TrendingUp, label: 'Analytics', value: 'Real-time' },
                  { icon: Globe, label: 'Global', value: '99.99%' },
                  { icon: Zap, label: 'Quality', value: 'HD Audio' },
                ].map((feature, idx) => (
                  <div key={idx} className="text-center p-2 rounded-lg bg-white/50 dark:bg-gray-900/50">
                    <div className="flex justify-center mb-1">
                      <feature.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-xs font-semibold text-blue-900 dark:text-blue-100">{feature.value}</div>
                    <div className="text-xs text-blue-700/80 dark:text-blue-300/80">{feature.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Auth Section */}
            <div className="mt-auto pt-6 border-t border-blue-100 dark:border-gray-800">
              {authUser ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/50 dark:bg-gray-800/50">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400 flex items-center justify-center text-white font-semibold">
                      {authUser.name?.charAt(0).toUpperCase() ?? "U"}
                    </div>
                    <div>
                      <p className="font-semibold text-blue-900 dark:text-blue-100">{authUser.name}</p>
                      <p className="text-sm text-blue-700/80 dark:text-blue-300/80">{authUser.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/profile"
                      className="px-4 py-3 text-center rounded-lg bg-blue-100 dark:bg-gray-800 hover:bg-blue-200 dark:hover:bg-gray-700 transition-colors text-blue-900 dark:text-blue-100"
                      onClick={() => setMobileOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                      onClickCapture={() => setMobileOpen(false)}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/login"
                    className="block w-full px-6 py-3 text-center rounded-xl border-2 border-blue-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors font-medium text-blue-900 dark:text-blue-100"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="block w-full px-6 py-3 text-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold shadow-lg shadow-blue-500/20 transition-all duration-300"
                    onClick={() => setMobileOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Reusable NavLink components
interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  children: string;
  active?: boolean;
}

function NavLink({ href, icon, children, active = false }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
        active
          ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
          : "text-blue-800 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100 hover:bg-blue-100 dark:hover:bg-gray-800/50"
      )}
    >
      {icon}
      {children}
    </Link>
  );
}

interface MobileNavLinkProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
  className?: string;
  onClick?: () => void;
}

function MobileNavLink({ href, icon, children, active = false, className, onClick }: MobileNavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-colors",
        active
          ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
          : "text-blue-800 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-gray-800/50",
        className
      )}
      onClick={onClick}
    >
      {icon}
      {children}
    </Link>
  );
}

interface DropdownLinkProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}

function DropdownLink({ href, icon, children, onClick, className }: DropdownLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-3 hover:bg-blue-50 dark:hover:bg-gray-800/50 transition-colors text-sm text-blue-900 dark:text-blue-100",
        className
      )}
      onClick={onClick}
    >
      {icon}
      {children}
    </Link>
  );
}