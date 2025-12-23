import { ReactNode } from 'react';
import Link from 'next/link';
import { 
  Radio, 
  Home, 
  Users, 
  Music, 
  Mic2, 
  Headphones, 
  Settings,
  LogOut,
  User,
  Bell,
  Search
} from 'lucide-react';

export default function SiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  const isAuthenticated = false; // You can implement auth check logic here

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center transform group-hover:scale-105 transition-transform">
                <Radio className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  RadioWave
                </h1>
                <p className="text-xs text-gray-400">Broadcast Excellence</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link href="/stations" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                <Mic2 className="h-4 w-4" />
                Stations
              </Link>
              <Link href="/media" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                <Music className="h-4 w-4" />
                Media
              </Link>
              <Link href="/groups" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                <Users className="h-4 w-4" />
                Groups
              </Link>
              <Link href="/live" className="relative">
                <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 transition-all">
                  <Headphones className="h-4 w-4" />
                  Live Now
                  <span className="absolute -top-1 -right-1 h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                </span>
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="hidden md:block relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search stations..."
                  className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-gray-800 transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Auth Actions */}
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <Link href="/profile" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 transition-colors">
                    <User className="h-5 w-5" />
                    <span className="hidden md:inline">Profile</span>
                  </Link>
                  <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 transition-colors text-red-400 hover:text-red-300">
                    <LogOut className="h-5 w-5" />
                    <span className="hidden md:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/login" className="px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors">
                    Sign In
                  </Link>
                  <Link href="/register" className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all">
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900/50 border-t border-gray-800 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                  <Radio className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold">RadioWave</span>
              </div>
              <p className="text-gray-400 text-sm">
                Professional radio broadcasting platform for modern media groups and stations.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="/api" className="hover:text-white transition-colors">API</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
                <li><Link href="/gdpr" className="hover:text-white transition-colors">GDPR Compliance</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>support@radiowave.com</li>
                <li>+1 (555) 123-4567</li>
                <li>123 Broadcast Street</li>
                <li>Media City, MC 12345</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} RadioWave Broadcasting Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}