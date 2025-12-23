"use client";

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { AuthButton } from './AuthButton';

interface Props {
  message: string;
}

export function VerifySuccess({ message }: Props) {
  return (
    <>
      <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <p className="text-gray-600">{message}</p>
      <AuthButton asChild>
        <Link href="/auth/login">Continue to Login</Link>
      </AuthButton>
    </>
  );
}

export default VerifySuccess;
