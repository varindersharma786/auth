"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/context/CurrencyContext";
import SubscriptionSection from "@/components/home/SubscriptionSection";

const REGIONS = [
  {
    name: "Africa",
    slug: "africa",
    description:
      "Wildlife safaris, ancient cultures, and breathtaking landscapes",
    image:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1200",
    tourCount: 45,
  },
  {
    name: "Asia",
    slug: "asia",
    description: "Ancient temples, vibrant cultures, and diverse adventures",
    image:
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=1200",
    tourCount: 38,
  },
  {
    name: "Europe",
    slug: "europe",
    description:
      "Historic cities, stunning architecture, and cultural treasures",
    image:
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=1200",
    tourCount: 32,
  },
  {
    name: "Americas",
    slug: "americas",
    description: "From rainforests to glaciers, discover the New World",
    image:
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&q=80&w=1200",
    tourCount: 28,
  },
  {
    name: "Oceania",
    slug: "oceania",
    description: "Island paradises, unique wildlife, and pristine nature",
    image:
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80&w=1200",
    tourCount: 18,
  },
  {
    name: "Middle East",
    slug: "middle-east",
    description: "Ancient history, desert adventures, and modern marvels",
    image:
      "https://images.unsplash.com/photo-1549144511-f099e773c147?auto=format&fit=crop&q=80&w=1200",
    tourCount: 15,
  },
];

export default function DestinationsPage() {
  const { localizeLink } = useCurrency();

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
              className="h-16 pl-14 pr-6 rounded-full text-lg bg-white/95 backdrop-blur-sm border-none shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Regions Grid */}
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
            {REGIONS.map((region) => (
              <Link
                key={region.slug}
                href={localizeLink(`/destinations/${region.slug}`)}
              >
                <div className="group relative aspect-[4/5] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer">
                  <Image
                    src={region.image}
                    alt={region.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="flex items-center gap-2 text-white/80 mb-3">
                      <MapPin className="h-4 w-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {region.tourCount} Tours
                      </span>
                    </div>
                    <h3 className="text-3xl font-serif font-bold text-white mb-3 group-hover:text-primary transition-colors">
                      {region.name}
                    </h3>
                    <p className="text-white/90 text-sm leading-relaxed">
                      {region.description}
                    </p>
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

      {/* Popular Destinations */}
      <section className="py-20 px-6 bg-zinc-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-12 text-center">
            Popular Destinations
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              "Kenya",
              "Tanzania",
              "Thailand",
              "Peru",
              "Iceland",
              "Morocco",
              "Japan",
              "New Zealand",
              "Italy",
              "Brazil",
              "Norway",
              "Vietnam",
            ].map((dest) => (
              <Link
                key={dest}
                href={localizeLink(
                  `/destinations/africa/${dest.toLowerCase()}`
                )}
              >
                <div className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 text-center cursor-pointer">
                  <MapPin className="h-8 w-8 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
                  <h4 className="font-bold text-lg group-hover:text-primary transition-colors">
                    {dest}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <SubscriptionSection />
    </div>
  );
}
