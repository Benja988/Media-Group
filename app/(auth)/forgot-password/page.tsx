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

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to send reset email');
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
        title="Check Your Email"
        description="We've sent password reset instructions to your email"
      >
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Reset Email Sent
            </h3>
            <p className="text-gray-600">
              If an account exists with the email you provided, you will receive password reset instructions shortly.
            </p>
            <p className="text-sm text-gray-500">
              The link will expire in 1 hour.
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
      title="Forgot Password"
      description="Enter your email to receive reset instructions"
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
            We'll send you a link to reset your password
          </p>
        </div>

        <AuthButton type="submit" loading={loading}>
          <Mail size={18} />
          Send Reset Link
        </AuthButton>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="h-5 w-5 text-yellow-600">⚠️</div>
            <div className="text-sm text-yellow-800">
              <strong>Note:</strong> For security reasons, password reset links are valid for 1 hour only.
            </div>
          </div>
        </div>
      </form>
    </FormCard>
  );
}