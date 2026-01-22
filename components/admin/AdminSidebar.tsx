"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  FileText,
  Mic2,
  Users,
  Settings,
  Plus,
} from 'lucide-react';

const sidebarItems = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: Home,
  },
  {
    name: 'Content',
    href: '/admin/content',
    icon: FileText,
    subItems: [
      { name: 'All Content', href: '/admin/content' },
      { name: 'New Content', href: '/admin/content/new' },
    ],
  },
  {
    name: 'Stations',
    href: '/admin/stations',
    icon: Mic2,
    subItems: [
      {
        name: 'All Stations',
        href: '/admin/stations',
      },
      {
        name: 'Create Station',
        href: '/admin/stations/new',
      },
      {
        name: 'Analytics',
        href: '/admin/stations/analytics',
      },
    ],
  },

  {
    name: 'Media Group',
    href: '/admin/media-groups',
    icon: Mic2,
    subItems: [
      { name: 'All Stations', href: '/admin/media-groups' },
      { name: 'New Station', href: '/admin/media-groups/new' },
    ],
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users,
    subItems: [
      { name: 'All Users', href: '/admin/users' },
      { name: 'New User', href: '/admin/users/new' },
    ],
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Admin Panel
        </h2>
      </div>
      <nav className="px-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.subItems && item.subItems.some(sub => pathname === sub.href));
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
                {item.subItems && isActive && (
                  <ul className="ml-8 mt-1 space-y-1">
                    {item.subItems.map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          href={subItem.href}
                          className={`flex items-center gap-2 px-3 py-1 rounded text-xs transition-colors ${pathname === subItem.href
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                              : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-600'
                            }`}
                        >
                          {subItem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}