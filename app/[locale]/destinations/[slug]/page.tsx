"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Loader2, MapPin, ChevronRight, Info, Calendar, Users, Star } from "lucide-react";
import { api, Destination, Tour } from "@/lib/api";
import { useCurrency } from "@/context/CurrencyContext";
import TripCard from "@/components/home/TripCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function DestinationDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { localizeLink } = useCurrency();

  const [destination, setDestination] = useState<(Destination & { tours?: Tour[]; parent?: Destination; subDestinations?: Destination[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

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

  // Filter tours by category
  const filteredTours = destination.tours
    ? selectedCategory === "all"
      ? destination.tours
      : destination.tours.filter((t) => t.theme === selectedCategory)
    : [];

  // Get unique tour categories
  const categories = destination.tours
    ? Array.from(new Set(destination.tours.map((t) => t.theme)))
    : [];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb - Intrepid Style */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center gap-2 text-sm text-zinc-600">
            <Link
              href={localizeLink("/")}
              className="hover:text-primary transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link
              href={localizeLink("/destinations")}
              className="hover:text-primary transition-colors"
            >
              Destinations
            </Link>
            <ChevronRight className="h-3 w-3" />
            {destination.parent && (
              <>
                <Link
                  href={localizeLink(
                    `/destinations/${destination.parent.slug}`
                  )}
                  className="hover:text-primary transition-colors"
                >
                  {destination.parent.name}
                </Link>
                <ChevronRight className="h-3 w-3" />
              </>
            )}
            <span className="text-zinc-900 font-semibold">{destination.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section - Intrepid Style */}
      <section className="relative h-[70vh] min-h-[500px] max-h-[700px] overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        
        <div className="relative h-full flex flex-col justify-end pb-16 px-6">
          <div className="max-w-7xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {destination.parent && (
                <div className="flex items-center gap-2 text-white/90 mb-3">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm font-semibold uppercase tracking-wide">
                    {destination.parent.name}
                  </span>
                </div>
              )}
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
                {destination.name}
              </h1>
              {destination.description && (
                <p className="text-xl md:text-2xl text-white/95 max-w-3xl mb-6 font-light">
                  {destination.description}
                </p>
              )}
              
              {/* Quick Stats */}
              <div className="flex flex-wrap items-center gap-6 text-white/90">
                {destination.tours && destination.tours.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <span className="font-semibold">
                      {destination.tours.length} {destination.tours.length === 1 ? "tour" : "tours"}
                    </span>
                  </div>
                )}
                {destination.subDestinations && destination.subDestinations.length > 0 && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <span className="font-semibold">
                      {destination.subDestinations.length} destinations
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">4.8 average rating</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section - Intrepid Style */}
      {destination.longDescription && (
        <section className="py-16 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-zinc-900">
              About {destination.name}
            </h2>
            <div className="prose prose-lg max-w-none text-zinc-700 leading-relaxed">
              <p className="whitespace-pre-line text-lg">{destination.longDescription}</p>
            </div>
          </div>
        </section>
      )}

      {/* Sub-Destinations - Intrepid Style */}
      {destination.subDestinations && destination.subDestinations.length > 0 && (
        <section className="py-16 px-6 bg-[#F8F6F3]">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-zinc-900">
                Explore {destination.name}
              </h2>
              <p className="text-zinc-600 text-lg">
                Discover the unique regions and cities
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {destination.subDestinations.map((sub: Destination, index) => (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={localizeLink(`/destinations/${sub.slug}`)}
                    className="group block"
                  >
                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 mb-4">
                      <Image
                        src={
                          sub.image ||
                          "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800"
                        }
                        alt={sub.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                          {sub.name}
                        </h3>
                        {sub.description && (
                          <p className="text-white/80 text-sm mt-2 line-clamp-2">
                            {sub.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tours Section - Intrepid Style */}
      {destination.tours && destination.tours.length > 0 && (
        <section className="py-16 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-zinc-900">
                Tours in {destination.name}
              </h2>
              <p className="text-zinc-600 text-lg mb-8">
                {destination.tours.length} {destination.tours.length === 1 ? "trip" : "trips"} available
              </p>

              {/* Category Filters - Intrepid Style */}
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => setSelectedCategory("all")}
                    variant={selectedCategory === "all" ? "default" : "outline"}
                    className="rounded-full"
                  >
                    All tours ({destination.tours.length})
                  </Button>
                  {categories.map((cat) => (
                    <Button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      variant={selectedCategory === cat ? "default" : "outline"}
                      className="rounded-full"
                    >
                      {cat} ({destination.tours?.filter((t) => t.theme === cat).length})
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Tours Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTours.map((tour: Tour) => (
                <TripCard key={tour.id} trip={tour} />
              ))}
            </div>

            {filteredTours.length === 0 && (
              <div className="text-center py-12">
                <p className="text-zinc-500 mb-4">
                  No tours found in this category
                </p>
                <Button
                  onClick={() => setSelectedCategory("all")}
                  variant="outline"
                >
                  View all tours
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Travel Tips Section - Intrepid Style */}
      {destination.longDescription && (
        <section className="py-16 px-6 bg-[#F8F6F3]">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Info className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-zinc-900">
                    Planning your trip to {destination.name}
                  </h3>
                  <p className="text-zinc-600">
                    Here&apos;s what you need to know before you go
                  </p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div>
                  <h4 className="font-bold text-lg mb-3 text-zinc-900">Best time to visit</h4>
                  <p className="text-zinc-600">
                    The ideal time depends on your preferences. Contact us for personalized recommendations based on weather, festivals, and crowd levels.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-3 text-zinc-900">Getting around</h4>
                  <p className="text-zinc-600">
                    All our tours include transportation. Our expert guides ensure you travel safely and comfortably throughout your journey.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {(!destination.tours || destination.tours.length === 0) &&
        (!destination.subDestinations ||
          destination.subDestinations.length === 0) && (
          <section className="py-20 px-6 bg-white">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-10 w-10 text-zinc-400" />
              </div>
              <h3 className="text-3xl font-bold mb-4 text-zinc-900">Coming Soon</h3>
              <p className="text-zinc-600 text-lg mb-8">
                We&apos;re currently working on adding tours for this destination. Check back soon or explore our other destinations!
              </p>
              <div className="flex gap-4 justify-center">
                <Link href={localizeLink("/destinations")}>
                  <Button variant="outline" className="rounded-full px-8">
                    Browse Destinations
                  </Button>
                </Link>
                <Link href={localizeLink("/tours")}>
                  <Button className="rounded-full px-8">
                    View All Tours
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

      {/* CTA Section - Intrepid Style */}
      <section className="py-16 px-6 bg-zinc-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to explore {destination.name}?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Join thousands of travelers who have discovered the magic of this destination
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={localizeLink("/tours")}>
              <Button size="lg" className="rounded-full px-12 py-6 bg-primary hover:bg-primary/90 font-bold text-lg">
                View all tours
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="rounded-full px-12 py-6 font-bold text-lg bg-transparent border-white text-white hover:bg-white hover:text-zinc-900">
              Contact us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
