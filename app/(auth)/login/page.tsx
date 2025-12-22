'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogIn, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { FormCard } from '@/components/auth/FormCard';
import { FormInput } from '@/components/auth/FormInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { AlertMessage } from '@/components/auth/AlertMessage';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      setSuccess('Login successful! Redirecting...');
      
      // Store tokens if your API returns them
      if (result.accessToken) {
        localStorage.setItem('accessToken', result.accessToken);
      }
      if (result.refreshToken) {
        localStorage.setItem('refreshToken', result.refreshToken);
      }
      
      // Redirect to dashboard after 1 second
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormCard
      title="Welcome Back"
      description="Enter your credentials to access your account"
      footer={
        <div className="text-center space-y-4">
          <div className="text-sm text-gray-600">
            <Link 
              href="/forgot-password" 
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Forgot your password?
            </Link>
          </div>
          <div className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link 
              href="/register" 
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Sign up here
            </Link>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && <AlertMessage type="error" message={error} />}
        {success && <AlertMessage type="success" message={success} />}

        <FormInput
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          icon="mail"
          error={errors.email?.message}
          {...register('email')}
        />

        <FormInput
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          icon="lock"
          showPasswordToggle
          onTogglePassword={() => setShowPassword(!showPassword)}
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Remember me</span>
          </label>
        </div>

        <AuthButton type="submit" loading={loading}>
          <LogIn size={18} />
          Sign In
          <ArrowRight size={18} />
        </AuthButton>
      </form>
    </FormCard>
  );
}