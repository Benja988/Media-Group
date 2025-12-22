import { Suspense } from 'react';
import { VerifyEmailClient } from '@/components/auth/VerifyEmailClient';

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Verifying…</div>}>
      <VerifyEmailClient />
    </Suspense>
  );
}
