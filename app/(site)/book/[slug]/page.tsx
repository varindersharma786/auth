import { notFound } from "next/navigation";
import { getTourBySlug } from "@/lib/api";
import { BookingClient } from "@/components/booking/BookingClient";

interface BookingPageProps {
  params: {
    slug: string;
  };
}

export default async function BookingPage({ params }: BookingPageProps) {
  const tour = await getTourBySlug(params.slug).catch(() => null);

  if (!tour) {
    notFound();
  }

  return (
    <div className="container py-8 max-w-7xl mx-auto">
      <BookingClient tour={tour} />
    </div>
  );
}
