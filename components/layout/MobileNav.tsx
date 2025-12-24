import Link from 'next/link';
import { Home, Mic2, Music, Users } from 'lucide-react';

export default function MobileNav() {
  return (
    <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="container-width">
        <div className="flex items-center justify-around py-2">
          <Link href="/" className="flex flex-col items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
          <Link href="/stations" className="flex flex-col items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
            <Mic2 className="h-4 w-4" />
            <span>Stations</span>
          </Link>
          <Link href="/media" className="flex flex-col items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
            <Music className="h-4 w-4" />
            <span>Media</span>
          </Link>
          <Link href="/groups" className="flex flex-col items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
            <Users className="h-4 w-4" />
            <span>Groups</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
