// components/admin/TopNav.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  HelpCircle,
  Moon,
  Sun,
  ChevronDown,
  User,
  LogOut,
  Settings,
  Menu,
  X,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
}

interface TopNavProps {
  onMenuToggle?: () => void;
  showMenuToggle?: boolean;
}

export default function TopNav({ onMenuToggle, showMenuToggle = false }: TopNavProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New user registered',
      description: 'John Doe just signed up',
      time: '5 min ago',
      read: false,
      type: 'info',
    },
    {
      id: '2',
      title: 'Content published',
      description: 'Your article is now live',
      time: '1 hour ago',
      read: false,
      type: 'success',
    },
    {
      id: '3',
      title: 'System update',
      description: 'Maintenance scheduled for tonight',
      time: '2 hours ago',
      read: true,
      type: 'warning',
    },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  
  const pageTitles: Record<string, string> = {
    '/admin': 'Dashboard Overview',
    '/admin/content': 'Content Management',
    '/admin/engagement': 'Engagement Analytics',
    '/admin/stations': 'Radio Stations',
    '/admin/media-groups': 'Media Groups',
    '/admin/users': 'User Management',
    '/admin/settings': 'System Settings',
  };
  
  const getCurrentPageTitle = () => {
    const exactMatch = pageTitles[pathname];
    if (exactMatch) return exactMatch;
    
    // Check for subpaths
    for (const [key, value] of Object.entries(pageTitles)) {
      if (pathname.startsWith(key) && key !== '/admin') {
        return value;
      }
    }
    
    return 'Dashboard';
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleNotificationClick = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };
  
  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
      <div className="px-6 py-2">
        <div className="flex items-center justify-between">
          {/* Left section */}
          <div className="flex items-center gap-4">
            {showMenuToggle && (
              <button
                onClick={onMenuToggle}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}
            
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {getCurrentPageTitle()}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Last updated: Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
          
          {/* Right section */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <div className={clsx(
                'flex items-center transition-all duration-300',
                isSearchOpen ? 'w-64' : 'w-10'
              )}>
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Search"
                >
                  <Search className="h-5 w-5" />
                </button>
                
                {isSearchOpen && (
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search anything..."
                    className="ml-2 px-3 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                    onBlur={() => {
                      if (!searchQuery) {
                        setTimeout(() => setIsSearchOpen(false), 200);
                      }
                    }}
                  />
                )}
              </div>
              
              {/* Search results dropdown */}
              {isSearchOpen && searchQuery && (
                <div className="absolute top-full right-0 mt-2 w-80 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Quick navigation
                    </p>
                  </div>
                  <div className="py-1">
                    {Object.entries(pageTitles)
                      .filter(([_, title]) =>
                        title.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map(([path, title]) => (
                        <a
                          key={path}
                          href={path}
                          className="flex items-center px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                        >
                          <div className="flex-1">
                            <p className="font-medium">{title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{path}</p>
                          </div>
                          <ChevronDown className="h-4 w-4 rotate-90" />
                        </a>
                      ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Theme toggle */}
            <button
              onClick={handleThemeToggle}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            
            {/* Help */}
            <button
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Help"
            >
              <HelpCircle className="h-5 w-5" />
            </button>
            
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
                )}
              </button>
              
              {isNotificationsOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg z-50">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <Bell className="h-12 w-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">
                          No notifications
                        </p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification.id)}
                          className={clsx(
                            'px-4 py-3 border-b border-gray-100 dark:border-gray-800 cursor-pointer transition-colors',
                            !notification.read && 'bg-blue-50/50 dark:bg-blue-900/20',
                            'hover:bg-gray-50 dark:hover:bg-gray-800'
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div className={clsx(
                              'h-2 w-2 rounded-full mt-2 flex-shrink-0',
                              notification.type === 'success' && 'bg-green-500',
                              notification.type === 'warning' && 'bg-yellow-500',
                              notification.type === 'error' && 'bg-red-500',
                              notification.type === 'info' && 'bg-blue-500'
                            )} />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 dark:text-white">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {notification.description}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                {notification.time}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-2" />
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800">
                    <a
                      href="#"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-center block py-2"
                    >
                      View all notifications
                    </a>
                  </div>
                </div>
              )}
            </div>
            
            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="User menu"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">A</span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Admin User
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Administrator
                  </p>
                </div>
                <ChevronDown className={clsx(
                  'h-4 w-4 hidden md:block transition-transform',
                  isProfileOpen && 'rotate-180'
                )} />
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg py-1 z-50">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                    <p className="font-medium text-gray-900 dark:text-white">
                      Admin User
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      admin@example.com
                    </p>
                  </div>
                  
                  <div className="py-1">
                    <a
                      href="/admin/profile"
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </a>
                    <a
                      href="/admin/settings"
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </a>
                  </div>
                  
                  <div className="border-t border-gray-100 dark:border-gray-800 py-1">
                    <button
                      onClick={() => {
                        // Handle logout
                        console.log('Logout');
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}