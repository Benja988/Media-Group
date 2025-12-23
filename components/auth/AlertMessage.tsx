import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { useState } from 'react';

interface AlertMessageProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  closable?: boolean;
}

export function AlertMessage({ type, message, closable = true }: AlertMessageProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertCircle,
  };

  const styles = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  };

  const Icon = icons[type];

  return (
    <div className={`rounded-lg border p-4 ${styles[type]}`}>
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm">{message}</p>
        </div>
        {closable && (
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}