import { ReactNode } from 'react';

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {children}
    </div>
  );
}