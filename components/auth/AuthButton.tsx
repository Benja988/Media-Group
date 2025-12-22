import { ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { Loader2 } from 'lucide-react';

interface AuthButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  asChild?: boolean;
}

export function AuthButton({
  children,
  loading,
  variant = 'primary',
  fullWidth = true,
  asChild = false,
  ...props
}: AuthButtonProps) {
  const Comp = asChild ? Slot : 'button';

  const baseClasses = `
    px-4 py-3 rounded-lg font-medium transition-all duration-200
    flex items-center justify-center gap-2
    ${fullWidth ? 'w-full' : ''}
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-offset-2
  `;

  const variants = {
    primary:
      'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 focus:ring-blue-500',
    secondary:
      'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-500',
    outline:
      'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
  };

  return (
    <Comp
      className={`${baseClasses} ${variants[variant]}`}
      disabled={!asChild && loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </Comp>
  );
}
