import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { BookingForm } from './BookingSection';

interface ContactInfoStepProps {
  register: UseFormRegister<BookingForm>;
  errors: FieldErrors<BookingForm>;
}

export function ContactInfoStep({ register, errors }: ContactInfoStepProps) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Full Name *</label>
          <input
            {...register('name')}
            className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Your full name"
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email *</label>
          <input
            type="email"
            {...register('email')}
            className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Phone *</label>
          <input
            type="tel"
            {...register('phone')}
            className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="+1 (555) 123-4567"
          />
          {errors.phone && (
            <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Company (Optional)</label>
          <input
            {...register('company')}
            className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Your company"
          />
        </div>
      </div>
    </div>
  );
}