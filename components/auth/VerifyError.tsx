"use client";

import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { AuthButton } from './AuthButton';

interface Props {
  message: string;
}

export function VerifyError({ message }: Props) {
  return (
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
  );
}

export default VerifyError;
