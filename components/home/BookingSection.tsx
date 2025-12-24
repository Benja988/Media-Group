"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronRight, Calendar, Users, Mic, CheckCircle, ArrowLeft, X } from 'lucide-react';
import { ProgressIndicator } from './ProgressIndicator';
import { ServiceSelectionStep } from './ServiceSelectionStep';
import { ContactInfoStep } from './ContactInfoStep';
import { SchedulingStep } from './SchedulingStep';
import { NavigationButtons } from './NavigationButtons';
import { BookingSuccess } from './BookingSuccess';

const bookingSchema = z.object({
  service: z.enum(['studio-booking', 'equipment-rental', 'consultation', 'training']),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  company: z.string().optional(),
  date: z.string().min(1, 'Please select a date'),
  time: z.string().min(1, 'Please select a time'),
  duration: z.string().min(1, 'Please select duration'),
  message: z.string().optional(),
});

export type BookingForm = z.infer<typeof bookingSchema>;

const services = [
  {
    id: 'studio-booking',
    title: 'Studio Booking',
    description: 'Book our professional recording studio',
    icon: Mic,
    price: 'From $50/hour'
  },
  {
    id: 'equipment-rental',
    title: 'Equipment Rental',
    description: 'Rent professional audio equipment',
    icon: Users,
    price: 'From $25/day'
  },
  {
    id: 'consultation',
    title: 'Consultation',
    description: 'Get expert advice on your broadcast setup',
    icon: Calendar,
    price: '$150/session'
  },
  {
    id: 'training',
    title: 'Training Session',
    description: 'Learn professional broadcasting techniques',
    icon: CheckCircle,
    price: '$200/session'
  }
];

export function BookingSection({ renderAsModal = true }: { renderAsModal?: boolean }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
  });

  const selectedService = watch('service');

  const onSubmit = async (data: BookingForm) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSubmitted(true);
        reset();
        setCurrentStep(1);
        setIsModalOpen(false);
      } else {
        throw new Error('Failed to submit booking');
      }
    } catch (error) {
      console.error('Booking submission error:', error);
      alert('Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (renderAsModal && !isModalOpen) {
    return (
      <button
        onClick={() => setIsModalOpen(true)}
        className="btn-base btn-size-lg bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Book Services
      </button>
    );
  }

  if (renderAsModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-background p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          >
            <X className="h-6 w-6" />
          </button>
          {isSubmitted ? (
            <BookingSuccess
              renderAsModal={true}
              setIsSubmitted={setIsSubmitted}
              setIsModalOpen={setIsModalOpen}
            />
          ) : (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Book Your Broadcasting Service</h2>
                <p className="text-lg text-muted-foreground">
                  Professional broadcasting solutions tailored to your needs
                </p>
              </div>

              <ProgressIndicator currentStep={currentStep} />

              <div className="card-base card-padding-lg">
                <form onSubmit={handleSubmit(onSubmit)}>
                  {currentStep === 1 && (
                    <ServiceSelectionStep
                      services={services}
                      selectedService={selectedService}
                      register={register}
                      errors={errors}
                    />
                  )}

                  {currentStep === 2 && (
                    <ContactInfoStep register={register} errors={errors} />
                  )}

                  {currentStep === 3 && (
                    <SchedulingStep register={register} errors={errors} />
                  )}

                  <NavigationButtons
                    currentStep={currentStep}
                    nextStep={nextStep}
                    prevStep={prevStep}
                    selectedService={selectedService}
                    isSubmitting={isSubmitting}
                  />
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div>
        {isSubmitted ? (
          <BookingSuccess
            renderAsModal={false}
            setIsSubmitted={setIsSubmitted}
          />
        ) : (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Book Your Broadcasting Service</h2>
              <p className="text-lg text-muted-foreground">
                Professional broadcasting solutions tailored to your needs
              </p>
            </div>

            <ProgressIndicator currentStep={currentStep} />

            <div className="card-base card-padding-lg">
              <form onSubmit={handleSubmit(onSubmit)}>
                {currentStep === 1 && (
                  <ServiceSelectionStep
                    services={services}
                    selectedService={selectedService}
                    register={register}
                    errors={errors}
                  />
                )}

                {currentStep === 2 && (
                  <ContactInfoStep register={register} errors={errors} />
                )}

                {currentStep === 3 && (
                  <SchedulingStep register={register} errors={errors} />
                )}

                <NavigationButtons
                  currentStep={currentStep}
                  nextStep={nextStep}
                  prevStep={prevStep}
                  selectedService={selectedService}
                  isSubmitting={isSubmitting}
                />
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }
}