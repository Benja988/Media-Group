import { ReactNode } from 'react';

interface FormCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function FormCard({ title, description, children, footer }: FormCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-gray-200">
        <div className="p-6 space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">🔒</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {title}
          </h2>
          {description && (
            <p className="text-gray-600 text-sm">
              {description}
            </p>
          )}
        </div>
        <div className="px-6 pb-6">
          {children}
        </div>
        {footer && (
          <div className="px-6 pb-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}