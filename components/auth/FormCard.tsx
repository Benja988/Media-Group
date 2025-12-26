// components/auth/FormCard.tsx
import { ReactNode } from 'react';
import { Sparkles, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface FormCardProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
  showThemeToggle?: boolean;
}

export function FormCard({
  title,
  description,
  children,
  footer,
  showThemeToggle = true
}: FormCardProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 section-py-lg">
      <div className="container-width max-w-md">
        <div className="mb-8 text-center space-sm">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary rounded-lg blur opacity-20 animate-pulse"></div>
              <div className="relative bg-card p-3 rounded-lg border border-border">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {title}
            </h1>

            {description && (
              <p className="text-muted-foreground text-base">
                {description}
              </p>
            )}
          </div>

        </div>

        <div className="relative">
          <div className="absolute -inset-0.5 bg-primary rounded-xl blur opacity-10"></div>
          <div className="relative card-base card-padding-lg backdrop-blur-sm">
            {showThemeToggle && (
              <button
                onClick={toggleTheme}
                className="absolute top-4 right-4 p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5 text-foreground" />
                ) : (
                  <Sun className="h-5 w-5 text-foreground" />
                )}
              </button>
            )}

            {children}
          </div>
        </div>

        {footer && (
          <div className="mt-8 text-center">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}