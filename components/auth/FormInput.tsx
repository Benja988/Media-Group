import { forwardRef } from 'react';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: 'mail' | 'lock' | 'user';
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
}

const icons = {
  mail: Mail,
  lock: Lock,
  user: User,
};

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, icon, type = 'text', showPasswordToggle, onTogglePassword, ...props }, ref) => {
    const IconComponent = icon ? icons[icon] : null;

    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="relative">
          {IconComponent && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <IconComponent size={20} />
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={`
              w-full px-4 py-3 rounded-lg border bg-white
              ${icon ? 'pl-11' : 'pl-4'}
              ${showPasswordToggle ? 'pr-11' : 'pr-4'}
              ${error 
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }
              focus:ring-2 focus:ring-opacity-20 focus:outline-none
              transition-all duration-200
              placeholder:text-gray-400
            `}
            {...props}
          />
          {showPasswordToggle && onTogglePassword && (
            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {type === 'password' ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <span>⚠️</span>
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';