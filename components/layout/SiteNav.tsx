import Link from 'next/link';
import {
  Radio,
  Home,
  Users,
  Music,
  Mic2,
  Headphones,
  LogOut,
  User,
  Bell,
  Search,
  ChevronRight
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export default function SiteNav() {
  const isAuthenticated = false;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
      <div className="container-width">
        <div className="flex items-center justify-between h-14 md:h-16">
          <Link href="/" className="flex items-center gap-2 md:gap-3 group flex-shrink-0">
            <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center transform group-hover:scale-105 transition-transform">
              <Radio className="h-4 w-4 md:h-6 md:w-6" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                RadioWave
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Broadcast Excellence</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-4 lg:gap-6 flex-1 justify-center">
            <Link href="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm lg:text-base">
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link href="/stations" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm lg:text-base">
              <Mic2 className="h-4 w-4" />
              Stations
            </Link>
            <Link href="/media" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm lg:text-base">
              <Music className="h-4 w-4" />
              Media
            </Link>
            <Link href="/groups" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm lg:text-base">
              <Users className="h-4 w-4" />
              Groups
            </Link>
            <Link href="/live" className="relative ml-2">
              <span className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 transition-all text-sm md:text-base">
                <Headphones className="h-3 w-3 md:h-4 md:w-4" />
                Live Now
                <span className="absolute -top-1 -right-1 h-2 w-2 md:h-3 md:w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-full w-full bg-red-500"></span>
                </span>
              </span>
            </Link>
          </div>

            <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:block relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="search" placeholder="Search..." className="pl-9 pr-4 py-1.5 md:py-2 bg-gray-100 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-40 lg:w-56 text-sm" />
            </div>

            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"><Search className="h-5 w-5" /></button>

            <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link href="/profile" className="flex items-center gap-1 md:gap-2 p-1.5 md:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <User className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="hidden md:inline text-sm">Profile</span>
                </Link>
                <button className="flex items-center gap-1 md:gap-2 p-1.5 md:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300">
                  <LogOut className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="hidden md:inline text-sm">Logout</span>
                </button>
              </div>
              ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm">Sign In</Link>
                <Link href="/register" className="btn-base btn-size-md bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">Get Started</Link>
              </div>
            )}

            {/* Theme toggle */}
            <ThemeToggle />

            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
