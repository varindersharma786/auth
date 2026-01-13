"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TourCard } from "@/components/search/TourCard";

export default function DestinationDetailPage() {
  const { slug } = useParams();
  const [destination, setDestination] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchDestination = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
          }/api/destinations/slug/${slug}`
        );
        const data = await response.json();
        setDestination(data);
      } catch (error) {
        console.error("Error fetching destination:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDestination();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pb-20">
        <Skeleton className="h-[400px] w-full" />
        <div className="container mx-auto px-4 max-w-7xl mt-12 space-y-12">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-80 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Destination not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero */}
      <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
        <Image
          src={
            destination.bannerImage ||
            destination.image ||
            "/placeholder-destination.jpg"
          }
          alt={destination.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight">
            {destination.name} tours & Holidays
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl mt-16">
        {/* Intro */}
        <div className="max-w-4xl mx-auto text-center mb-16 px-4">
          <p className="text-lg text-zinc-600 leading-relaxed italic border-l-4 border-red-600 pl-6 text-left">
            {destination.longDescription ||
              destination.description ||
              "Discover the magic of this destination. A land of incredible diversity, ancient history, and stunning natural beauty. Join us as we explore the heart and soul of this remarkable region."}
          </p>
        </div>

        {/* Sub-destinations / Travel Guides */}
        {destination.subDestinations?.length > 0 && (
          <section className="mb-24">
            <h2 className="text-2xl font-bold text-zinc-900 mb-8 pb-4 border-b">
              Top {destination.name} Travel Guides
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {destination.subDestinations.map((sub: any) => (
                <Link
                  key={sub.id}
                  href={`/en/destinations/${sub.slug}`}
                  className="group block border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="aspect-3/2 relative overflow-hidden">
                    <Image
                      src={sub.image || "/placeholder-destination.jpg"}
                      alt={sub.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3 bg-white">
                    <h3 className="font-bold text-sm text-zinc-900 group-hover:text-red-600 transition-colors uppercase tracking-wider">
                      {sub.name} Travel Guide
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Top Tours Section */}
        <section className="mb-24">
          <div className="flex items-center justify-between mb-8 pb-4 border-b">
            <h2 className="text-2xl font-bold text-zinc-900 uppercase">
              Our {destination.name} trips
            </h2>
            <Button
              variant="link"
              className="text-red-600 font-bold p-0 h-auto"
            >
              View all trips
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destination.tours?.map((tour: any) => (
              <Link
                key={tour.id}
                href={`/en/tours/${tour.slug}`}
                className="flex flex-col group h-full border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-4/3 relative overflow-hidden shrink-0">
                  <Image
                    src={tour.images?.[0] || "/placeholder-tour.jpg"}
                    alt={tour.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 p-1 bg-white/50 backdrop-blur rounded-full">
                    <Heart className="w-4 h-4 text-zinc-600" />
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1 justify-between bg-white">
                  <div>
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">
                      {tour.style} • {tour.durationDays} days
                    </div>
                    <h3 className="font-bold text-zinc-900 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors">
                      {tour.title}
                    </h3>
                  </div>
                  <div className="mt-4 pt-4 border-t flex items-end justify-between">
                    <div>
                      <div className="text-[10px] text-zinc-400">From</div>
                      <div className="font-black text-lg">
                        USD ${tour.priceFrom}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Button
              variant="outline"
              className="rounded-full px-12 h-12 font-black border-zinc-900 hover:bg-zinc-900 hover:text-white transition-colors"
            >
              SEE MORE TRIPS
            </Button>
          </div>
        </section>

        {/* Reviews Section Mockup */}
        <section className="mb-24 py-16 bg-zinc-50 rounded-3xl px-8 border border-zinc-200">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-yellow-400 text-yellow-400"
                />
              ))}
              <span className="font-bold text-xl ml-2">4.7</span>
              <span className="text-zinc-500">/ 5 based on 1240 reviews</span>
            </div>
            <h2 className="text-3xl font-black mb-12 uppercase tracking-tight">
              {destination.name} Tour Reviews
            </h2>

            <div className="space-y-12">
              <div className="border-b pb-8">
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < 5
                          ? "fill-black text-black"
                          : "fill-zinc-200 text-zinc-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-lg font-bold mb-4">
                  &quot;Life-changing experience! Well organized and the guide
                  was fantastic.&quot;
                </p>
                <div className="flex items-center justify-between text-sm text-zinc-500">
                  <span>John Doe • Travelled Dec 2025</span>
                  <span className="text-red-600 font-bold border-b border-red-600">
                    Verified Trip
                  </span>
                </div>
              </div>
              <div className="border-b pb-8">
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < 4
                          ? "fill-black text-black"
                          : "fill-zinc-200 text-zinc-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-lg font-bold mb-4">
                  &quot;The itinerary was perfect. Covered all major highlights
                  without feeling rushed.&quot;
                </p>
                <div className="flex items-center justify-between text-sm text-zinc-500">
                  <span>Sarah Smith • Travelled Nov 2025</span>
                  <span className="text-red-600 font-bold border-b border-red-600">
                    Verified Trip
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="link"
              className="mt-12 w-full md:w-auto h-12 px-12 rounded-lg font-bold"
            >
              LOAD MORE REVIEWS
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
