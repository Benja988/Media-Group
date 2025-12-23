'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { FormCard } from '@/components/auth/FormCard';
import { FormInput } from '@/components/auth/FormInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { AlertMessage } from '@/components/auth/AlertMessage';

const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      setSuccess('Registration successful! Please check your email to verify your account.');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormCard
      title="Create Account"
      description="Get started with your free account"
      footer={
        <div className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link 
            href="/login" 
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Sign in here
          </Link>
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

        <div className="space-y-1">
          <div className="flex gap-2">
            <div className={`h-1 flex-1 rounded ${password?.length >= 8 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
            <div className={`h-1 flex-1 rounded ${/[A-Z]/.test(password || '') ? 'bg-green-500' : 'bg-gray-200'}`}></div>
            <div className={`h-1 flex-1 rounded ${/[a-z]/.test(password || '') ? 'bg-green-500' : 'bg-gray-200'}`}></div>
            <div className={`h-1 flex-1 rounded ${/\d/.test(password || '') ? 'bg-green-500' : 'bg-gray-200'}`}></div>
          </div>
          <p className="text-xs text-gray-500">
            Password must contain uppercase, lowercase, number, and be at least 8 characters
          </p>
        </div>

        <FormInput
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="••••••••"
          icon="lock"
          showPasswordToggle
          onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="terms"
            className="h-4 w-4 mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            required
          />
          <label htmlFor="terms" className="text-sm text-gray-600">
            I agree to the{' '}
            <Link href="/terms" className="text-blue-600 hover:text-blue-800">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-blue-600 hover:text-blue-800">
              Privacy Policy
            </Link>
          </label>
        </div>

        <AuthButton type="submit" loading={loading}>
          <UserPlus size={18} />
          Create Account
          <ArrowRight size={18} />
        </AuthButton>
      </form>
    </FormCard>
  );
}