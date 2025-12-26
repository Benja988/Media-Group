import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { Slot } from '@radix-ui/react-slot';

interface AuthButtonProps {
  children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'outline' | 'ghost';
  asChild?: boolean;
}

export function AuthButton({
  children,
  type = 'button',
  loading = false,
  disabled = false,
  variant = 'primary',
  asChild = false,
}: AuthButtonProps) {
  const Comp = asChild ? Slot : 'button';

  const baseClasses =
    "w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-base";

  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg',
    outline: 'border-2 border-primary text-primary hover:bg-primary/5',
    ghost: 'border border-border text-foreground hover:bg-muted',
  };

  return (
    <Comp
      type={!asChild ? type : undefined}
      disabled={!asChild ? disabled || loading : undefined}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      <div className="flex items-center justify-center gap-3">
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : children}
      </div>
    </Comp>
  );
}
