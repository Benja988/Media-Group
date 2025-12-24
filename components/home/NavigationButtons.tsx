import { ChevronRight, ArrowLeft } from 'lucide-react';

interface NavigationButtonsProps {
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  selectedService: string;
  isSubmitting: boolean;
  onSubmit?: () => void;
}

export function NavigationButtons({
  currentStep,
  nextStep,
  prevStep,
  selectedService,
  isSubmitting,
  onSubmit
}: NavigationButtonsProps) {
  return (
    <div className="flex justify-between">
      <button
        type="button"
        onClick={prevStep}
        disabled={currentStep === 1}
        className="btn-base btn-size-md border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Previous
      </button>

      {currentStep < 3 ? (
        <button
          type="button"
          onClick={nextStep}
          disabled={!selectedService && currentStep === 1}
          className="btn-base btn-size-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </button>
      ) : (
        <button
          type="submit"
          disabled={isSubmitting}
          onClick={onSubmit}
          className="btn-base btn-size-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Booking'}
          <ChevronRight className="h-4 w-4 ml-2" />
        </button>
      )}
    </div>
  );
}