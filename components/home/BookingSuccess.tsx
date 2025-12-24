import { CheckCircle } from 'lucide-react';

interface BookingSuccessProps {
  renderAsModal: boolean;
  setIsSubmitted: (value: boolean) => void;
  setIsModalOpen?: (value: boolean) => void;
}

export function BookingSuccess({ renderAsModal, setIsSubmitted, setIsModalOpen }: BookingSuccessProps) {
  return (
    <div className="text-center py-12">
      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
      <h3 className="text-2xl font-bold mb-2">Booking Submitted!</h3>
      <p className="text-muted-foreground mb-4">
        Thank you for your booking request. We will send you a confirmation email shortly.
      </p>
      <button
        onClick={() => {
          setIsSubmitted(false);
          if (renderAsModal && setIsModalOpen) {
            setIsModalOpen(false);
          }
        }}
        className="btn-base btn-size-md bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {renderAsModal ? 'Close' : 'Book Another Service'}
      </button>
    </div>
  );
}