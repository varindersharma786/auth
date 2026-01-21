"use client";

import { useEffect, useState } from "react";
import { getTours, Tour } from "@/lib/api";
import TripCard from "@/components/home/TripCard";
import { Loader2, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchFilters } from "@/components/search/SearchFilters";
import { SearchSort } from "@/components/search/SearchSort";
import { useSearchParams } from "next/navigation";

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      try {
        const data = await getTours();
        setTours(data);
      } catch (error) {
        console.error("Failed to fetch tours:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header / Search Bar Section */}
      <div className="bg-white border-b py-8 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-zinc-900 mb-2">
              All Tours & Experiences
            </h1>
            <p className="text-zinc-600">
              {loading
                ? "Loading..."
                : `${tours.length} incredible ${tours.length === 1 ? "tour" : "tours"} to explore`}
            </p>
          </div>
          <SearchBar />
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl py-8">
        {/* Filter Toggle (Mobile) */}
        <div className="lg:hidden mb-6">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="w-full"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar / Filters */}
          <aside
            className={`w-full lg:w-64 shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            <div className="sticky top-40">
              <SearchFilters />
            </div>
          </aside>

          {/* Results Grid */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">
                {tours.length} {tours.length === 1 ? "Tour" : "Tours"}
              </h2>
              <SearchSort />
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : tours.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-zinc-500 text-lg mb-4">
                  No tours found matching your criteria
                </p>
                <Button onClick={() => window.location.reload()}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {tours.map((tour) => (
                  <TripCard key={tour.id} trip={tour} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
