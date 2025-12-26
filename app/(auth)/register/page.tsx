// app/auth/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus, ArrowRight, CheckCircle } from 'lucide-react';
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
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const passwordRules = [
  { rule: /^.{8,}$/, message: 'At least 8 characters' },
  { rule: /[A-Z]/, message: 'One uppercase letter' },
  { rule: /[a-z]/, message: 'One lowercase letter' },
  { rule: /\d/, message: 'One number' },
  { rule: /[^A-Za-z0-9]/, message: 'One special character' },
];

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    if (!acceptedTerms) {
      setError('Please accept the terms and conditions');
      return;
    }

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

      let result: any = null;

      try {
        result = await response.json();
      } catch {
        // response body was empty
      }

      if (!response.ok) {
        throw new Error(result?.error || result?.message || 'Registration failed');
      }


      setSuccess('Registration successful! Please check your email to verify your account.');

      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    passwordRules.forEach(rule => {
      if (rule.rule.test(password)) strength += 20;
    });
    return strength;
  };

  const getStrengthColor = (strength: number) => {
    if (strength < 40) return 'bg-red-500';
    if (strength < 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const strength = getPasswordStrength();

  return (
    <FormCard
      title="Create Account"
      description="Join us today – it's free!"
      footer={
        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Sign in here
          </Link>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-md">
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

        <div className="space-sm">
          <FormInput
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            icon="lock"
            showPasswordToggle
            showValidation
            validationRules={passwordRules}
            value={password}
            onTogglePassword={() => setShowPassword(!showPassword)}
            error={errors.password?.message}
            {...register('password')}
          />

          {password && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Password strength</span>
                <span className={`font-medium ${strength < 40 ? 'text-red-500' :
                    strength < 80 ? 'text-yellow-500' : 'text-green-500'
                  }`}>
                  {strength < 40 ? 'Weak' : strength < 80 ? 'Good' : 'Strong'}
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${getStrengthColor(strength)}`}
                  style={{ width: `${strength}%` }}
                />
              </div>
            </div>
          )}
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

        <div className="space-sm">
          <div className="flex items-start gap-3 group cursor-pointer" onClick={() => setAcceptedTerms(!acceptedTerms)}>
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded border transition-all duration-200 flex items-center justify-center ${acceptedTerms
                  ? 'bg-primary border-primary'
                  : 'bg-card border-border group-hover:border-primary'
                }`}>
                {acceptedTerms && (
                  <CheckCircle size={14} className="text-primary-foreground" />
                )}
              </div>
            </div>
            <label htmlFor="terms" className="text-sm text-foreground cursor-pointer leading-tight">
              I agree to the{' '}
              <Link
                href="/terms"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href="/privacy"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Privacy Policy
              </Link>
            </label>
          </div>

          <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-1 rounded">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  By creating an account, you'll get access to exclusive features and personalized content.
                </p>
              </div>
            </div>
          </div>
        </div>

        <AuthButton type="submit" loading={loading} disabled={!isValid || !acceptedTerms}>
          <UserPlus size={18} />
          Create Account
          <ArrowRight size={18} />
        </AuthButton>
      </form>
    </FormCard>
  );
}