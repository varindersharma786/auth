import { notFound } from "next/navigation";
import { getTourBySlug } from "@/lib/api";
import TourHero from "@/components/tour/TourHero";
import TourHighlights from "@/components/tour/TourHighlights";
import TourItinerary from "@/components/tour/TourItinerary";
import TourSidebar from "@/components/tour/TourSidebar";
import TourInclusions from "@/components/tour/TourInclusions";

import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { ChevronRight, MapPin } from "lucide-react";
import TourAccommodation from "@/components/tour/TourAccommodation";
import TourExtras from "@/components/tour/TourExtras";
import TourReviews from "@/components/tour/TourReviews";

// Disable caching for this route segment
export const dynamic = "force-dynamic";

interface TourPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function TourPage({ params }: TourPageProps) {
  const { slug, locale } = await params;
  const tour = await getTourBySlug(slug);

  if (!tour) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Navigation - Intrepid Style */}
      <div className="bg-zinc-50 border-b">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <nav className="flex items-center gap-2 text-sm text-zinc-600">
            <Link href={`/${locale}`} className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href={`/${locale}/destinations`} className="hover:text-primary transition-colors">
              Destinations
            </Link>
            <ChevronRight className="h-3 w-3" />
            {tour.destinationId && (
              <>
                <Link href={`/${locale}/destinations/${tour.destinationId}`} className="hover:text-primary transition-colors">
                  {tour.startLocation?.split(",")[1]?.trim() || "Destination"}
                </Link>
                <ChevronRight className="h-3 w-3" />
              </>
            )}
            <span className="text-zinc-900 font-semibold line-clamp-1">{tour.title}</span>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <TourHero tour={tour} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Info Bar - Intrepid Style */}
            <div className="flex flex-wrap gap-6 text-sm py-6 border-y">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-zinc-600">Start:</span>
                <span className="font-semibold">{tour.startLocation}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-zinc-600">End:</span>
                <span className="font-semibold">{tour.endLocation}</span>
              </div>
            </div>

            {/* Navigation Tabs - Intrepid Style */}
            <Tabs defaultValue="overview" className="w-full">
              <div className="sticky top-20 bg-white z-10 pb-4 border-b">
                <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-none">
                  <TabsTrigger 
                    value="overview" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger 
                    value="itinerary"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                  >
                    Itinerary
                  </TabsTrigger>
                  <TabsTrigger 
                    value="inclusions"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                  >
                    Inclusions
                  </TabsTrigger>
                  <TabsTrigger 
                    value="accommodation"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                  >
                    Accommodation
                  </TabsTrigger>
                  <TabsTrigger 
                    value="extras"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                  >
                    Trip Extras
                  </TabsTrigger>
                  <TabsTrigger 
                    value="reviews"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                  >
                    Reviews
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="mt-8">
                <TabsContent value="overview" className="space-y-8">
                  {/* Overview & Highlights */}
                  {tour.overview && (
                    <section>
                      <h2 className="text-2xl font-bold mb-4">Overview</h2>
                      <p className="text-zinc-700 leading-relaxed whitespace-pre-line">{tour.overview}</p>
                    </section>
                  )}
                  
                  <Separator />
                  
                  <section id="highlights" className="scroll-mt-24">
                    <TourHighlights tour={tour} />
                  </section>
                </TabsContent>

                <TabsContent value="itinerary" className="space-y-8">
                  <section id="itinerary" className="scroll-mt-24">
                    <TourItinerary tour={tour} />
                  </section>
                </TabsContent>

                <TabsContent value="inclusions" className="space-y-8">
                  <section id="inclusions" className="scroll-mt-24">
                    <TourInclusions tour={tour} />
                  </section>
                </TabsContent>

                <TabsContent value="accommodation" className="space-y-8">
                  <section id="accommodation" className="scroll-mt-24">
                    <TourAccommodation tour={tour} />
                  </section>
                </TabsContent>

                <TabsContent value="extras" className="space-y-8">
                  <section id="extras" className="scroll-mt-24">
                    <TourExtras tour={tour} />
                  </section>
                </TabsContent>

                <TabsContent value="reviews" className="space-y-8">
                  <section id="reviews" className="scroll-mt-24">
                    <TourReviews tour={tour} />
                  </section>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Sidebar Column - Sticky */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <TourSidebar tour={tour} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
