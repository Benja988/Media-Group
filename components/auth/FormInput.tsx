// components/auth/FormInput.tsx
import { forwardRef, useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Key, Check, X } from 'lucide-react';
import { UseFormRegisterReturn } from 'react-hook-form';

const icons = {
  mail: Mail,
  lock: Lock,
  user: User,
  key: Key,
};

interface FormInputProps extends UseFormRegisterReturn {
  label: string;
  type: string;
  placeholder: string;
  icon: keyof typeof icons;
  error?: string;
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
  showValidation?: boolean;
  validationRules?: Array<{
    rule: RegExp;
    message: string;
  }>;
  value?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ 
    label, 
    type, 
    placeholder, 
    icon, 
    error, 
    showPasswordToggle, 
    onTogglePassword,
    showValidation,
    validationRules,
    value,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const IconComponent = icons[icon];

    const validateRules = () => {
      if (!showValidation || !validationRules) return [];
      return validationRules.map(rule => ({
        ...rule,
        isValid: rule.rule.test(value || ''),
      }));
    };

    const validations = validateRules();

    return (
      <div className="space-sm">
        <div className="relative">
          <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors ${
            error ? 'text-red-500' : isFocused ? 'text-primary' : 'text-muted-foreground'
          }`}>
            <IconComponent size={18} />
          </div>

          <input
            ref={ref}
            type={type}
            placeholder={placeholder}
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            className={`w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-gray-700/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 ${
              error 
                ? 'border-red-500 dark:border-red-400' 
                : isFocused 
                ? 'border-blue-500 dark:border-blue-400 shadow-[0_0_0_3px_rgba(59,130,246,0.1)]' 
                : 'border-gray-200 dark:border-gray-600'
            } text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
            {...(() => {
              const { onBlur, ...rest } = props;
              return rest;
            })()}
          />

          {showPasswordToggle && (
            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              {type === 'password' ? (
                <Eye size={18} />
              ) : (
                <EyeOff size={18} />
              )}
            </button>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-500 flex items-center gap-2 animate-fade-in">
            <X size={14} />
            {error}
          </p>
        )}

        {showValidation && validations.length > 0 && (
          <div className="space-y-1.5">
            {validations.map((validation, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`p-0.5 rounded ${
                  validation.isValid 
                    ? 'bg-green-500/10' 
                    : 'bg-muted/50'
                }`}>
                  {validation.isValid ? (
                    <Check size={12} className="text-green-500" />
                  ) : (
                    <X size={12} className="text-muted-foreground" />
                  )}
                </div>
                <span className={`text-xs ${
                  validation.isValid 
                    ? 'text-green-600' 
                    : 'text-muted-foreground'
                }`}>
                  {validation.message}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';