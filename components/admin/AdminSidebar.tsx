"use client";
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  FileText,
  Mic2,
  Users,
  Settings,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Folder,
} from 'lucide-react';
import clsx from 'clsx';


interface SidebarSubItem {
  name: string;
  href: string;
  badge?: string;
}

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  subItems?: SidebarSubItem[];
}


const SIDEBAR_ITEMS: SidebarItem[] = [
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
      { name: 'New Content', href: '/admin/content/new', badge: 'New' },
    ],
  },
  {
    name: 'Engagement',
    href: '/admin/engagement',
    icon: TrendingUp,
    subItems: [
      { name: 'Analytics Dashboard', href: '/admin/engagement' },
      { name: 'User Insights', href: '/admin/engagement/users' },
      { name: 'Content Performance', href: '/admin/engagement/content' },
    ],
  },
  {
    name: 'Stations',
    href: '/admin/stations',
    icon: Mic2,
    subItems: [
      { name: 'All Stations', href: '/admin/stations' },
      { name: 'Create Station', href: '/admin/stations/new' },
      { name: 'Analytics', href: '/admin/stations/analytics' },
    ],
  },
  {
    name: 'Media Group',
    href: '/admin/media-groups',
    icon: Folder,
    subItems: [
      { name: 'Media Groups', href: '/admin/media-groups' },
      { name: 'New Group', href: '/admin/media-groups/new', badge: 'Soon' },
    ],
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users,
    subItems: [
      { name: 'All Users', href: '/admin/users' },
      { name: 'Add User', href: '/admin/users/new' },
    ],
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

interface SubItemProps {
  item: SidebarSubItem;
  isActive: boolean;
  onClick?: () => void;
}


const SubItem: React.FC<SubItemProps> = ({ item, isActive, onClick }) => (
  <li>
    <Link
      href={item.href}
      onClick={onClick}
      className={clsx(
        'flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors',
        'group ml-6 pl-4 border-l-2',
        isActive
          ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-200'
          : 'border-transparent text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50'
      )}
    >
      <span className="truncate">{item.name}</span>
      {item.badge && (
        <span className="px-1.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {item.badge}
        </span>
      )}
    </Link>
  </li>
);

interface SidebarItemProps {
  item: SidebarItem;
  isActive: boolean;
  isExpanded: boolean;
  hasActiveChild: boolean;
  onToggle: () => void;
}

const SidebarItemComponent: React.FC<SidebarItemProps> = ({
  item,
  isActive,
  isExpanded,
  hasActiveChild,
  onToggle,
}) => {
  const Icon = item.icon;
  const shouldShowSubItems = item.subItems && (isExpanded || isActive);
  
  return (
    <li>
      <div className="space-y-1">
        <Link
          href={item.href}
          onClick={(e) => {
            if (item.subItems) {
              e.preventDefault();
              onToggle();
            }
          }}
          className={clsx(
            'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
            'group',
            isActive || hasActiveChild
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
              : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
          )}
          aria-expanded={shouldShowSubItems}
        >
          <div className="flex items-center gap-3 min-w-0">
            <Icon className="h-5 w-5 flex-shrink-0" />
            <span className="truncate">{item.name}</span>
          </div>
          {item.subItems && (
            <ChevronDown
              className={clsx(
                'h-4 w-4 flex-shrink-0 transition-transform duration-200',
                isExpanded ? 'rotate-180' : 'rotate-0'
              )}
            />
          )}
        </Link>
        
        {shouldShowSubItems && item.subItems && (
          <ul className="space-y-1 overflow-hidden animate-in slide-in-from-top-2 duration-200">
            {item.subItems.map((subItem) => (
              <SubItem
                key={subItem.href}
                item={subItem}
                isActive={false} // Would need pathname comparison here
              />
            ))}
          </ul>
        )}
      </div>
    </li>
  );
};

interface AdminSidebarProps {
  className?: string;
}

export default function AdminSidebar({ className }: AdminSidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Calculate active states
  const activeStates = useMemo(() => {
    const states = new Map<string, { isActive: boolean; hasActiveChild: boolean }>();
    
    SIDEBAR_ITEMS.forEach((item) => {
      const isActive = pathname === item.href;
      const hasActiveChild = item.subItems?.some(
        (subItem) => pathname === subItem.href
      ) ?? false;
      
      states.set(item.name, { isActive, hasActiveChild });
      
      // Auto-expand if active or has active child
      if ((isActive || hasActiveChild) && item.subItems) {
        setExpandedItems((prev) => new Set(prev).add(item.name));
      }
    });
    
    return states;
  }, [pathname]);

  const handleToggle = (itemName: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemName)) {
        next.delete(itemName);
      } else {
        next.add(itemName);
      }
      return next;
    });
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
          Admin Panel
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Manage your content and users
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {SIDEBAR_ITEMS.map((item) => {
            const state = activeStates.get(item.name);
            if (!state) return null;
            
            return (
              <SidebarItemComponent
                key={item.name}
                item={item}
                isActive={state.isActive}
                isExpanded={expandedItems.has(item.name)}
                hasActiveChild={state.hasActiveChild}
                onToggle={() => handleToggle(item.name)}
              />
            );
          })}
        </ul>
      </nav>

      {/* Footer/User area (optional) */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              Admin User
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              admin@example.com
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}