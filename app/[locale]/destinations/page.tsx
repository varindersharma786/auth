"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function AllDestinationsPage() {
  const [destinations, setDestinations] = React.useState<any[]>([]);
  const [topDestinations, setTopDestinations] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [allRes, topRes] = await Promise.all([
          fetch(
            `${
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
            }/api/destinations`
          ),
          fetch(
            `${
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
            }/api/destinations/top`
          ),
        ]);
        const allData = await allRes.json();
        const topData = await topRes.json();
        setDestinations(allData || []);
        setTopDestinations(topData || []);
      } catch (error) {
        console.error("Error fetching destinations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero Section */}
      <div className="relative w-full">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-6">
            <Link href="/" className="hover:text-zinc-900">
              Home
            </Link>
            <span>›</span>
            <span className="text-zinc-900 font-medium">All destinations</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-center text-zinc-900 mb-12">
            All destinations
          </h1>
        </div>

        <div className="aspect-21/9 relative w-full overflow-hidden">
          <Image
            src="/destinations-hero.webp" // Need to generate or use placeholder
            alt="All destinations"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl mt-16">
        {/* Intro */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <p className="text-2xl font-medium text-zinc-700 leading-relaxed">
            With more than 1,000 adventures in over 100 countries, we&apos;re now
            covering more of the globe than ever before — north to south, east
            to west.
          </p>
          <p className="mt-6 text-zinc-500 text-sm leading-relaxed">
            We&apos;ve curated unique travel experiences that take you beyond the
            typical tourist path, allowing you to connect with local cultures
            and landscapes in meaningful ways. Whether you&apos;re seeking a short
            break or an epic journey, we have something for every traveler.
          </p>
        </div>

        {/* Categories / Continents */}
        <section className="mb-24">
          <h2 className="text-2xl font-bold text-zinc-900 mb-8">
            Where you can go
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-video w-full rounded-xl" />
                    <Skeleton className="h-6 w-1/3" />
                  </div>
                ))
              : destinations.map((dest) => (
                  <Link
                    key={dest.id}
                    href={`/en/destinations/${dest.slug}`}
                    className="group"
                  >
                    <div className="aspect-video relative rounded-xl overflow-hidden mb-4 shadow-sm border">
                      <Image
                        src={dest.image || "/placeholder-destination.jpg"}
                        alt={dest.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 group-hover:text-red-600 transition-colors">
                      {dest.name}
                    </h3>
                  </Link>
                ))}
          </div>
        </section>

        {/* Call to Action */}
        <div className="bg-zinc-50 rounded-2xl p-8 md:p-12 mb-24 flex flex-col md:flex-row items-center justify-between gap-8 border shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 mb-2">
              Discover your next adventure
            </h2>
            <p className="text-zinc-500">
              Search 1000+ trips in 100+ countries, search tours near you.
            </p>
          </div>
          <Button className="bg-black text-white px-8 h-12 rounded-full font-bold hover:bg-zinc-800 transition-colors shrink-0">
            Explore all trips
          </Button>
        </div>

        {/* Top Destinations */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 mb-10">
            Our top destinations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-square w-full rounded-xl" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ))
              : topDestinations.map((dest, index) => (
                  <div key={dest.id} className="flex flex-col">
                    <Link
                      href={`/en/destinations/${dest.slug}`}
                      className="aspect-square relative rounded-xl overflow-hidden mb-6 shadow-sm border group"
                    >
                      <Image
                        src={dest.image || "/placeholder-destination.jpg"}
                        alt={dest.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>
                    <h3 className="text-xl font-bold text-zinc-900 mb-4">
                      {index + 1}. {dest.name}
                    </h3>
                    <p className="text-zinc-500 text-sm leading-relaxed mb-6 line-clamp-4">
                      {dest.description ||
                        "Explore the wonders and hidden gems of this incredible destination. From bustling cities to serene landscapes, there's always something new to discover."}
                    </p>
                    <Button
                      variant="outline"
                      asChild
                      className="w-full mt-auto rounded-none border-zinc-900 font-bold hover:bg-zinc-900 hover:text-white transition-colors"
                    >
                      <Link href={`/en/destinations/${dest.slug}`}>
                        Explore {dest.name}
                      </Link>
                    </Button>
                  </div>
                ))}
          </div>
          <div className="mt-12 flex justify-end gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-10 w-10 border-zinc-300"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-10 w-10 border-zinc-300"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
