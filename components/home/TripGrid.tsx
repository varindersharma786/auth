"use client";

import { useEffect, useState } from "react";
import { Tour, getTours } from "@/lib/api";
import TripCard from "./TripCard";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useCurrency } from "@/context/CurrencyContext";

export default function TripGrid() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const { localizeLink } = useCurrency();

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const data = await getTours();
        setTours(data.slice(0, 12)); // Take first 12 for homepage
      } catch (error) {
        console.error("Failed to fetch tours:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#2D2424]">
            Our Africa trips
          </h2>
          <p className="text-zinc-500 mt-4 text-lg max-w-2xl mx-auto">
            Whether you&apos;re looking for a luxury safari or a rugged overland
            adventure, we have the perfect trip for you.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {tours.map((tour) => (
            <TripCard key={tour.id} trip={tour} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href={localizeLink("/tours")}>
            <Button
              size="lg"
              className="rounded-full px-10 py-6 text-lg font-bold shadow-xl hover:shadow-2xl transition-all"
            >
              View all 40+ trips
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
