import { ReactNode } from 'react';
import SiteNav from '@/components/layout/SiteNav';
import SiteFooter from '@/components/layout/SiteFooter';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteNav />

      <main className="flex-1">{children}</main>

      {/* <SiteFooter /> */}
    </>
  );
}