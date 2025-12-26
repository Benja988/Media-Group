// components/auth/AlertMessage.tsx
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

interface AlertMessageProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

export function AlertMessage({ type, message }: AlertMessageProps) {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const styles = {
    success: 'bg-green-500/10 border-green-500/20 text-green-600',
    error: 'bg-red-500/10 border-red-500/20 text-red-600',
    warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-600',
    info: 'bg-blue-500/10 border-blue-500/20 text-blue-600',
  };

  const IconComponent = icons[type];

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border ${styles[type]} animate-fade-in`}>
      <IconComponent className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}