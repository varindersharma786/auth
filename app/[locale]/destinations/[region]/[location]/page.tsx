"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  MapPin,
  Calendar,
  Users,
  DollarSign,
} from "lucide-react";
import Image from "next/image";
import TripGrid from "@/components/home/TripGrid";
import SubscriptionSection from "@/components/home/SubscriptionSection";
import { useCurrency } from "@/context/CurrencyContext";
import { Button } from "@/components/ui/button";

export default function LocationPage() {
  const params = useParams();
  const region = params?.region as string;
  const location = params?.location as string;
  const { localizeLink } = useCurrency();

  // Capitalize names for display
  const regionName = region
    ? region.charAt(0).toUpperCase() + region.slice(1)
    : "Region";
  const locationName = location
    ? location.charAt(0).toUpperCase() + location.slice(1)
    : "Location";

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-zinc-50 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center gap-2 text-sm font-medium text-zinc-600">
            <Link
              href={localizeLink("/")}
              className="hover:text-primary transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link
              href={localizeLink("/destinations")}
              className="hover:text-primary transition-colors"
            >
              Destinations
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link
              href={localizeLink(`/destinations/${region}`)}
              className="hover:text-primary transition-colors"
            >
              {regionName}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-zinc-900 font-bold">{locationName}</span>
          </nav>
        </div>
      </div>

      <main className="w-full">
        {/* Hero Section */}
        <section className="relative h-[500px] md:h-[600px] overflow-hidden">
          <Image
            src={`https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&q=80&w=2000`}
            alt={`${locationName} landscape`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <div className="flex items-center gap-2 text-white/80 mb-4">
              <MapPin className="h-5 w-5" />
              <span className="text-sm font-bold uppercase tracking-widest">
                {regionName}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 drop-shadow-xl">
              {locationName}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mb-8 drop-shadow-lg">
              Discover unforgettable experiences in {locationName}
            </p>
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-10 py-6 text-lg font-bold shadow-2xl">
              View All Tours
            </Button>
          </div>
        </section>

        {/* Quick Facts */}
        <section className="py-16 bg-white border-b">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <Calendar className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h4 className="font-bold text-lg mb-1">Best Time</h4>
                <p className="text-sm text-zinc-600">Jun - Sep</p>
              </div>
              <div className="text-center">
                <Users className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h4 className="font-bold text-lg mb-1">Group Size</h4>
                <p className="text-sm text-zinc-600">4-12 people</p>
              </div>
              <div className="text-center">
                <DollarSign className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h4 className="font-bold text-lg mb-1">From</h4>
                <p className="text-sm text-zinc-600">$1,200</p>
              </div>
              <div className="text-center">
                <MapPin className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h4 className="font-bold text-lg mb-1">Duration</h4>
                <p className="text-sm text-zinc-600">7-14 days</p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-8 text-center">
              About {locationName}
            </h2>
            <div className="prose prose-lg max-w-none text-zinc-700 leading-relaxed">
              <p className="mb-6">
                {locationName} offers an incredible blend of natural beauty,
                rich culture, and unforgettable adventures. Whether you're
                seeking wildlife encounters, cultural immersion, or breathtaking
                landscapes, this destination has something for every type of
                traveler.
              </p>
              <p>
                Our carefully curated tours in {locationName} provide authentic
                experiences led by expert local guides, ensuring you discover
                both the iconic highlights and hidden gems that make this
                destination truly special.
              </p>
            </div>
          </div>
        </section>

        {/* Tours in this Location */}
        <TripGrid
          location={locationName}
          showTitle={true}
          title={`Tours in ${locationName}`}
        />

        {/* Travel Tips */}
        <section className="py-20 px-6 bg-zinc-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-12 text-center">
              Travel Tips for {locationName}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm">
                <h3 className="font-bold text-xl mb-4">Visa Requirements</h3>
                <p className="text-zinc-600">
                  Check visa requirements based on your nationality. E-visas are
                  available for many countries.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm">
                <h3 className="font-bold text-xl mb-4">Health & Safety</h3>
                <p className="text-zinc-600">
                  Consult your doctor about recommended vaccinations and malaria
                  prophylaxis before traveling.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm">
                <h3 className="font-bold text-xl mb-4">Currency & Payment</h3>
                <p className="text-zinc-600">
                  Local currency is recommended. Credit cards are accepted in
                  major cities and tourist areas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <SubscriptionSection />
      </main>
    </div>
  );
}
