import { BookingSection } from '@/components/home/BookingSection';

export default function BookingPage() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container-width">
        <div className="max-w-4xl mx-auto">
          <BookingSection renderAsModal={false} />
        </div>
      </div>
    </section>
  );
}