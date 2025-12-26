"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { FormCard } from '@/components/auth/FormCard';
import { VerifyLoading } from '@/components/auth/VerifyLoading';
import { VerifySuccess } from '@/components/auth/VerifySuccess';
import { VerifyError } from '@/components/auth/VerifyError';

export function VerifyEmailClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('No verification token provided');
        return;
      }

      try {
        // const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const response = await fetch(`/api/auth/verify-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message || data.error || 'Email verified successfully!');
          setTimeout(() => router.push('/login'), 2000);
        } else {
          setStatus('error');
          setMessage(data.message || data.error || 'Failed to verify email');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred during verification');
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <FormCard
      title="Email Verification"
      description="Verifying your email address"
    >
      <div className="text-center space-y-6">
        {status === 'loading' && <VerifyLoading />}

        {status === 'success' && <VerifySuccess message={message} />}

        {status === 'error' && <VerifyError message={message} />}
      </div>
    </FormCard>
  );
}
