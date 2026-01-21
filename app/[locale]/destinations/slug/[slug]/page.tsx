"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Loader2, MapPin, ChevronRight } from "lucide-react";
import { api, Destination, Tour } from "@/lib/api";
import { useCurrency } from "@/context/CurrencyContext";
import TripCard from "@/components/home/TripCard";
import { Button } from "@/components/ui/button";

export default function DestinationDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { localizeLink } = useCurrency();

  const [destination, setDestination] = useState<(Destination & { tours?: Tour[]; parent?: Destination; subDestinations?: Destination[] }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const { data } = await api.get(`/api/destinations/slug/${slug}`);
        setDestination(data);
      } catch (error) {
        console.error("Failed to fetch destination:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchDestination();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Destination Not Found</h1>
          <Link href={localizeLink("/destinations")}>
            <Button>Back to Destinations</Button>
          </Link>
        </div>
      </div>
    );
  }

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
            {destination.parent && (
              <>
                <Link
                  href={localizeLink(
                    `/destinations/slug/${destination.parent.slug}`
                  )}
                  className="hover:text-primary transition-colors"
                >
                  {destination.parent.name}
                </Link>
                <ChevronRight className="h-4 w-4" />
              </>
            )}
            <span className="text-zinc-900 font-bold">{destination.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        <Image
          src={
            destination.bannerImage ||
            destination.image ||
            "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=2000"
          }
          alt={destination.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <div className="flex items-center gap-2 text-white/80 mb-4">
            <MapPin className="h-5 w-5" />
            <span className="text-sm font-bold uppercase tracking-widest">
              {destination.parent ? destination.parent.name : "Destination"}
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 drop-shadow-xl">
            {destination.name}
          </h1>
          {destination.description && (
            <p className="text-xl text-white/90 max-w-2xl mb-8 drop-shadow-lg">
              {destination.description}
            </p>
          )}
        </div>
      </section>

      {/* About Section */}
      {destination.longDescription && (
        <section className="py-16 px-6 bg-zinc-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-center">
              About {destination.name}
            </h2>
            <div className="prose prose-lg mx-auto text-zinc-700">
              <p className="whitespace-pre-line">{destination.longDescription}</p>
            </div>
          </div>
        </section>
      )}

      {/* Sub-Destinations */}
      {destination.subDestinations && destination.subDestinations.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-12 text-center">
              Explore {destination.name}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {destination.subDestinations.map((sub: Destination) => (
                <Link
                  key={sub.id}
                  href={localizeLink(`/destinations/slug/${sub.slug}`)}
                  className="group"
                >
                  <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                    <Image
                      src={
                        sub.image ||
                        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800"
                      }
                      alt={sub.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                        {sub.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tours Section */}
      {destination.tours && destination.tours.length > 0 && (
        <section className="py-16 px-6 bg-zinc-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                Tours in {destination.name}
              </h2>
              <p className="text-zinc-600 text-lg">
                {destination.tours.length} amazing{" "}
                {destination.tours.length === 1 ? "tour" : "tours"} to choose
                from
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {destination.tours.map((tour: Tour) => (
                <TripCard key={tour.id} trip={tour} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {(!destination.tours || destination.tours.length === 0) &&
        (!destination.subDestinations ||
          destination.subDestinations.length === 0) && (
          <section className="py-20 px-6">
            <div className="max-w-2xl mx-auto text-center">
              <MapPin className="h-16 w-16 mx-auto mb-6 text-zinc-300" />
              <h3 className="text-2xl font-bold mb-4">Coming Soon</h3>
              <p className="text-zinc-600 mb-8">
                We&apos;re currently working on adding tours for this
                destination. Check back soon!
              </p>
              <Link href={localizeLink("/destinations")}>
                <Button>Browse All Destinations</Button>
              </Link>
            </div>
          </section>
        )}
    </div>
  );
}
