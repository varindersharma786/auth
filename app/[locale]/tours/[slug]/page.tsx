import { notFound } from "next/navigation";
import { getTourBySlug } from "@/lib/api";
import TourHero from "@/components/tour/TourHero";
import TourHighlights from "@/components/tour/TourHighlights";
import TourItinerary from "@/components/tour/TourItinerary";
import TourSidebar from "@/components/tour/TourSidebar";
import TourInclusions from "@/components/tour/TourInclusions";
import { Separator } from "@/components/ui/separator";

// Disable caching for this route segment
export const dynamic = "force-dynamic";

interface TourPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function TourPage({ params }: TourPageProps) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);

  if (!tour) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 md:py-12 space-y-12">
        {/* Navigation Breadcrumbs could go here */}

        {/* Hero Section */}
        <TourHero tour={tour} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-12">
            {/* Highlights Section */}
            <section id="highlights" className="scroll-mt-24">
              <TourHighlights tour={tour} />
            </section>

            <Separator />

            {/* Itinerary Section */}
            <section id="itinerary" className="scroll-mt-24">
              <TourItinerary tour={tour} />
            </section>

            <Separator />

            {/* Inclusions / Exclusions */}
            <section id="inclusions" className="scroll-mt-24">
              <TourInclusions tour={tour} />
            </section>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-1">
            <TourSidebar tour={tour} />
          </div>
        </div>
      </main>
    </div>
  );
}
