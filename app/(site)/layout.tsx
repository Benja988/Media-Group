// app/(site)/layout.tsx

import { ReactNode } from 'react';
import SiteNav from '@/components/layout/SiteNav';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteNav />

      <main className="flex-1">{children}</main>

    </>
  );
}