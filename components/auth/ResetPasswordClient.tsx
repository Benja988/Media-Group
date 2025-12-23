'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';

import { FormCard } from '@/components/auth/FormCard';
import { FormInput } from '@/components/auth/FormInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { AlertMessage } from '@/components/auth/AlertMessage';

const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams(); 
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token');
      setTokenValid(false);
      return;
    }
    setTokenValid(true);
  }, [token]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const password = watch('password');

  if (tokenValid === false) {
    return (
      <FormCard title="Invalid Reset Link">
        <AlertCircle className="mx-auto h-8 w-8 text-red-600" />
      </FormCard>
    );
  }

  if (success) {
    return (
      <FormCard title="Password Reset Successful">
        <CheckCircle className="mx-auto h-8 w-8 text-green-600" />
      </FormCard>
    );
  }

  return (
    <FormCard title="Set New Password">
      <form onSubmit={handleSubmit(() => {})} className="space-y-6">
        {error && <AlertMessage type="error" message={error} />}

        <FormInput
          label="New Password"
          type="password"
          error={errors.password?.message}
          {...register('password')}
        />

        <FormInput
          label="Confirm Password"
          type="password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <AuthButton type="submit" loading={loading}>
          <Lock size={18} />
          Reset Password
        </AuthButton>
      </form>
    </FormCard>
  );
}
