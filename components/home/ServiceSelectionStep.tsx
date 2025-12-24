import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { BookingForm } from './BookingSection';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: any;
  price: string;
}

interface ServiceSelectionStepProps {
  services: Service[];
  selectedService: string;
  register: UseFormRegister<BookingForm>;
  errors: FieldErrors<BookingForm>;
}

export function ServiceSelectionStep({ services, selectedService, register, errors }: ServiceSelectionStepProps) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">Select a Service</h3>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <label
              key={service.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-primary ${
                selectedService === service.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border'
              }`}
            >
              <input
                type="radio"
                value={service.id}
                {...register('service')}
                className="sr-only"
              />
              <div className="flex items-start gap-3">
                <Icon className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h4 className="font-medium">{service.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {service.description}
                  </p>
                  <p className="text-sm font-medium text-primary">
                    {service.price}
                  </p>
                </div>
              </div>
            </label>
          );
        })}
      </div>
      {errors.service && (
        <p className="text-sm text-red-500 mb-4">{errors.service.message}</p>
      )}
    </div>
  );
}