'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

import { FormCard } from '@/components/auth/FormCard';
import { AuthButton } from '@/components/auth/AuthButton';

export function VerifyEmailClient() {
  const router = useRouter();
  const searchParams = useSearchParams(); // ✅ now safely suspended
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          setStatus('success');
          setMessage('Email verified successfully! You can now log in.');
        } else {
          const errorData = await response.json();
          setStatus('error');
          setMessage(errorData.message || 'Invalid or expired verification token');
        }
      } catch {
        setStatus('error');
        setMessage('An error occurred during verification');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <FormCard title="Email Verification">
      <div className="text-center space-y-6">
        {status === 'loading' && (
          <>
            <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
            <p className="text-gray-600">Verifying your email…</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-gray-600">{message}</p>
            <AuthButton asChild>
              <Link href="/login">Continue to Login</Link>
            </AuthButton>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-gray-600">{message}</p>

            <div className="space-y-3">
              <AuthButton asChild>
                <Link href="/register">Register Again</Link>
              </AuthButton>
              <AuthButton variant="outline" asChild>
                <Link href="/login">Back to Login</Link>
              </AuthButton>
            </div>
          </>
        )}
      </div>
    </FormCard>
  );
}
