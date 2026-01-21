"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, MapPin, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/context/CurrencyContext";
import SubscriptionSection from "@/components/home/SubscriptionSection";
import { useEffect, useState } from "react";
import { getDestinations, Destination } from "@/lib/api";

export default function DestinationsPage() {
  const { localizeLink } = useCurrency();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await getDestinations();
        setDestinations(data);
      } catch (error) {
        console.error("Failed to fetch destinations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  // Filter parent destinations (regions) and child destinations (countries)
  const regions = destinations.filter((d) => !d.parentId);
  const countries = destinations.filter((d) => d.parentId);

  // Search filter
  const filteredRegions = regions.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden bg-[#2D2424]">
        <Image
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=2000"
          alt="World destinations"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6 drop-shadow-xl">
            Explore the World
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mb-10 drop-shadow-lg">
            Choose your next adventure from our curated destinations across the
            globe
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-2xl relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
            <Input
              placeholder="Search destinations, countries, or regions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-16 pl-14 pr-6 rounded-full text-lg bg-white/95 backdrop-blur-sm border-none shadow-2xl"
            />
          </div>
        </div>
      </section>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Regions Grid */}
          {filteredRegions.length > 0 && (
            <section className="py-20 px-6">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                    Browse by Region
                  </h2>
                  <p className="text-zinc-600 text-lg">
                    Select a region to discover incredible tours and experiences
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredRegions.map((region) => (
                    <Link
                      key={region.id}
                      href={localizeLink(`/destinations/${region.slug}`)}
                    >
                      <div className="group relative aspect-[4/5] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer">
                        <Image
                          src={
                            region.image ||
                            "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=1200"
                          }
                          alt={region.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        <div className="absolute bottom-0 left-0 right-0 p-8">
                          <div className="flex items-center gap-2 text-white/80 mb-3">
                            <MapPin className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">
                              Explore
                            </span>
                          </div>
                          <h3 className="text-3xl font-serif font-bold text-white mb-3 group-hover:text-primary transition-colors">
                            {region.name}
                          </h3>
                          {region.description && (
                            <p className="text-white/90 text-sm leading-relaxed line-clamp-2">
                              {region.description}
                            </p>
                          )}
                          <Button className="mt-6 rounded-full bg-white text-zinc-900 hover:bg-primary hover:text-white transition-all">
                            Explore {region.name}
                          </Button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Popular Destinations (Countries) */}
          {filteredCountries.length > 0 && (
            <section className="py-20 px-6 bg-zinc-50">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-12 text-center">
                  Popular Destinations
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {filteredCountries.map((dest) => (
                    <Link
                      key={dest.id}
                      href={localizeLink(`/destinations/${dest.slug}`)}
                    >
                      <div className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 text-center cursor-pointer">
                        <MapPin className="h-8 w-8 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
                        <h4 className="font-bold text-lg group-hover:text-primary transition-colors">
                          {dest.name}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {!loading &&
            filteredRegions.length === 0 &&
            filteredCountries.length === 0 && (
              <div className="text-center py-20">
                <p className="text-zinc-500 text-lg">
                  No destinations found matching &quot;{searchTerm}&quot;
                </p>
              </div>
            )}
        </>
      )}

      {/* Newsletter */}
      <SubscriptionSection />
    </div>
  );
}
