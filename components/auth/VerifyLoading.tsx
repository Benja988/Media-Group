"use client";

import { Loader2 } from 'lucide-react';

export function VerifyLoading() {
  return (
    <>
      <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
      <p className="text-gray-600">Verifying your email…</p>
    </>
  );
}

export default VerifyLoading;
