"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { SearchFilters } from "@/components/search/SearchFilters";
import { TourCard } from "@/components/search/TourCard";
import { SearchSort } from "@/components/search/SearchSort";
import { SearchBar } from "@/components/search/SearchBar";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [tours, setTours] = React.useState<any[]>([]);
  const [pagination, setPagination] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  const fetchTours = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
        }/api/tours/search?${searchParams.toString()}`
      );
      const data = await response.json();
      setTours(data.tours || []);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Failed to fetch tours:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTours();
  }, [searchParams]);

  const keyword = searchParams.get("keyword");

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      {/* Header / Search Bar Section */}
      <div className="bg-white border-b py-8 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-4">
            <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
              <span>Home</span>
              <span>›</span>
              <span className="text-zinc-900 font-medium">Search</span>
            </div>
            <h1 className="text-2xl font-bold text-zinc-900">
              {loading
                ? "Searching..."
                : `${pagination?.total || 0} trip${
                    pagination?.total === 1 ? "" : "s"
                  } found ${keyword ? `for "${keyword}"` : ""}`}
            </h1>
          </div>
          <SearchBar />
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar / Filters */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="sticky top-40">
              <SearchFilters />
            </div>
          </aside>

          {/* Results List */}
          <main className="flex-1">
            <div className="flex justify-end mb-6">
              <SearchSort />
            </div>

            <div className="space-y-6">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden shadow-sm border h-[240px]"
                  >
                    <Skeleton className="w-full md:w-[300px] h-full" />
                    <div className="flex-1 p-6 space-y-4">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="space-y-2 pt-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                      </div>
                    </div>
                  </div>
                ))
              ) : tours.length > 0 ? (
                tours.map((tour) => <TourCard key={tour.id} tour={tour} />)
              ) : (
                <div className="text-center py-20 bg-white rounded-xl border shadow-sm">
                  <h2 className="text-xl font-bold text-zinc-900">
                    No trips found
                  </h2>
                  <p className="text-zinc-500 mt-2">
                    Try adjusting your filters or search keywords.
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="mt-12 flex items-center justify-between border-t pt-8">
                <div className="text-sm font-medium text-zinc-500">
                  Page {pagination.page} of {pagination.pages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={pagination.page <= 1}
                    onClick={() => {
                      const params = new URLSearchParams(
                        searchParams.toString()
                      );
                      params.set("page", (pagination.page - 1).toString());
                      window.history.pushState(
                        null,
                        "",
                        `?${params.toString()}`
                      );
                      fetchTours();
                    }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={pagination.page >= pagination.pages}
                    onClick={() => {
                      const params = new URLSearchParams(
                        searchParams.toString()
                      );
                      params.set("page", (pagination.page + 1).toString());
                      window.history.pushState(
                        null,
                        "",
                        `?${params.toString()}`
                      );
                      fetchTours();
                    }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
