import { Suspense } from 'react';
import { ResetPasswordClient } from '@/components/auth/ResetPasswordClient';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading…</div>}>
      <ResetPasswordClient />
    </Suspense>
  );
}
