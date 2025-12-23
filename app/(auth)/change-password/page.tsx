'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { FormCard } from '@/components/auth/FormCard';
import { FormInput } from '@/components/auth/FormInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { AlertMessage } from '@/components/auth/AlertMessage';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const newPassword = watch('newPassword');

  const onSubmit = async (data: ChangePasswordFormData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to change password');
      }

      setSuccess('Password changed successfully!');
      reset();
      
      // Optionally, redirect after success
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormCard
      title="Change Password"
      description="Update your account password"
      footer={
        <div className="text-center text-sm text-gray-600">
          <Link 
            href="/dashboard" 
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors flex items-center justify-center gap-1"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && <AlertMessage type="error" message={error} />}
        {success && <AlertMessage type="success" message={success} />}

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-blue-600" />
            <div className="text-sm text-blue-800">
              For security, please enter your current password before setting a new one.
            </div>
          </div>
        </div>

        <FormInput
          label="Current Password"
          type={showCurrentPassword ? 'text' : 'password'}
          placeholder="••••••••"
          icon="lock"
          showPasswordToggle
          onTogglePassword={() => setShowCurrentPassword(!showCurrentPassword)}
          error={errors.currentPassword?.message}
          {...register('currentPassword')}
        />

        <FormInput
          label="New Password"
          type={showNewPassword ? 'text' : 'password'}
          placeholder="••••••••"
          icon="lock"
          showPasswordToggle
          onTogglePassword={() => setShowNewPassword(!showNewPassword)}
          error={errors.newPassword?.message}
          {...register('newPassword')}
        />

        <div className="space-y-1">
          <div className="flex gap-2">
            <div className={`h-1 flex-1 rounded ${newPassword?.length >= 8 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
            <div className={`h-1 flex-1 rounded ${/[A-Z]/.test(newPassword || '') ? 'bg-green-500' : 'bg-gray-200'}`}></div>
            <div className={`h-1 flex-1 rounded ${/[a-z]/.test(newPassword || '') ? 'bg-green-500' : 'bg-gray-200'}`}></div>
            <div className={`h-1 flex-1 rounded ${/\d/.test(newPassword || '') ? 'bg-green-500' : 'bg-gray-200'}`}></div>
          </div>
          <p className="text-xs text-gray-500">
            Password must contain uppercase, lowercase, number, and be at least 8 characters
          </p>
        </div>

        <FormInput
          label="Confirm New Password"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="••••••••"
          icon="lock"
          showPasswordToggle
          onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <AuthButton type="submit" loading={loading}>
          <Lock size={18} />
          Update Password
        </AuthButton>
      </form>
    </FormCard>
  );
}