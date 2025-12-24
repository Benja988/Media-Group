import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { BookingForm } from './BookingSection';

interface SchedulingStepProps {
  register: UseFormRegister<BookingForm>;
  errors: FieldErrors<BookingForm>;
}

export function SchedulingStep({ register, errors }: SchedulingStepProps) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">Schedule Your Session</h3>
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Preferred Date *</label>
          <input
            type="date"
            {...register('date')}
            className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {errors.date && (
            <p className="text-sm text-red-500 mt-1">{errors.date.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Preferred Time *</label>
          <select
            {...register('time')}
            className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Select time</option>
            <option value="09:00">9:00 AM</option>
            <option value="10:00">10:00 AM</option>
            <option value="11:00">11:00 AM</option>
            <option value="14:00">2:00 PM</option>
            <option value="15:00">3:00 PM</option>
            <option value="16:00">4:00 PM</option>
          </select>
          {errors.time && (
            <p className="text-sm text-red-500 mt-1">{errors.time.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Duration *</label>
          <select
            {...register('duration')}
            className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Select duration</option>
            <option value="1">1 hour</option>
            <option value="2">2 hours</option>
            <option value="4">4 hours</option>
            <option value="8">8 hours</option>
          </select>
          {errors.duration && (
            <p className="text-sm text-red-500 mt-1">{errors.duration.message}</p>
          )}
        </div>
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Additional Message (Optional)</label>
        <textarea
          {...register('message')}
          rows={4}
          className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Tell us about your specific needs..."
        />
      </div>
    </div>
  );
}