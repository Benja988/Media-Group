'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';

import { FormCard } from '@/components/auth/FormCard';
import { FormInput } from '@/components/auth/FormInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { AlertMessage } from '@/components/auth/AlertMessage';

const resendVerificationSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ResendVerificationFormData = z.infer<typeof resendVerificationSchema>;

export default function ResendVerificationPage() {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResendVerificationFormData>({
    resolver: zodResolver(resendVerificationSchema),
  });

  const onSubmit = async (data: ResendVerificationFormData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to send verification email');
      }

      setEmailSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <FormCard
        title="Verification Email Sent"
        description="Check your inbox for the verification link"
      >
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Check Your Email
            </h3>
            <p className="text-gray-600">
              We've sent a new verification link to your email address.
            </p>
            <p className="text-sm text-gray-500">
              Please check your inbox and spam folder.
            </p>
          </div>

          <div className="space-y-3 pt-4">
            <AuthButton variant="outline" asChild>
              <Link href="/auth/login">
                <ArrowLeft size={18} />
                Back to Login
              </Link>
            </AuthButton>
          </div>
        </div>
      </FormCard>
    );
  }

  return (
    <FormCard
      title="Resend Verification Email"
      description="Enter your email to receive a new verification link"
      footer={
        <div className="text-center text-sm text-gray-600">
          <Link 
            href="/auth/login" 
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors flex items-center justify-center gap-1"
          >
            <ArrowLeft size={16} />
            Back to login
          </Link>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && <AlertMessage type="error" message={error} />}

        <div className="space-y-2">
          <FormInput
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            icon="mail"
            error={errors.email?.message}
            {...register('email')}
          />
          <p className="text-sm text-gray-500">
            We'll send you a new verification link
          </p>
        </div>

        <AuthButton type="submit" loading={loading}>
          <Mail size={18} />
          Send Verification Link
        </AuthButton>
      </form>
    </FormCard>
  );
}