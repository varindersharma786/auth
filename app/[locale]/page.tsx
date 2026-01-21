"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TripCard from "@/components/home/TripCard";
import Link from "next/link";
import Image from "next/image";
import { useCurrency } from "@/context/CurrencyContext";
import {
  Banner,
  SiteSettings,
  getBanners,
  getSiteSettings,
  getDestinations,
  getTours,
  Destination,
  Tour,
} from "@/lib/api";
import { Loader2, Search, Star, Users, MapPin, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { localizeLink } = useCurrency();
  const [heroBanner, setHeroBanner] = useState<Banner | undefined>();
  const [settings, setSettings] = useState<SiteSettings | undefined>();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [featuredTours, setFeaturedTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [banners, siteSettings, dests, tours] = await Promise.all([
          getBanners("HERO"),
          getSiteSettings(),
          getDestinations(),
          getTours(),
        ]);

        setHeroBanner(banners.find((b) => b.isActive) || banners[0]);
        setSettings(siteSettings);

        // Get top destinations
        const topDests = dests.filter((d) => d.isTop);
        setDestinations(topDests.length > 0 ? topDests : dests.slice(0, 8));

        // Get featured tours
        setFeaturedTours(tours.filter((t) => t.isFeatured).slice(0, 12));
      } catch (error) {
        console.error("Failed to fetch home page content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = localizeLink(`/search?keyword=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const heroTitle =
    heroBanner?.title || "Only Intrepid";
  const heroSubtitle =
    heroBanner?.subtitle ||
    "Real and remarkable small group trips worldwide.";
  const heroImage =
    heroBanner?.imageUrl ||
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=2000";
  const heroCtaText = heroBanner?.ctaText || "Where to next?";
  const heroCtaUrl = heroBanner?.ctaUrl || "/destinations";

  return (
    <div className="min-h-screen bg-white">
      <main className="w-full">
        {/* Hero Banner with Search - Intrepid Style */}
        <section className="relative h-[90vh] min-h-[600px] overflow-hidden">
          <Image
            src={heroImage}
            alt={heroTitle}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

          <div className="relative h-full flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8 w-full"
            >
              <div>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 drop-shadow-2xl leading-tight tracking-tight">
                  {heroTitle}
                </h1>
                <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto font-light drop-shadow-lg">
                  {heroSubtitle}
                </p>
              </div>

              {/* Hero Search Bar - Intrepid Style */}
              <div className="max-w-4xl mx-auto w-full">
                <div className="bg-white rounded-full p-2 shadow-2xl flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-3 px-4">
                    <Search className="h-5 w-5 text-zinc-400" />
                    <Input
                      placeholder="Where do you want to go?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-lg bg-transparent"
                    />
                  </div>
                  <Button
                    onClick={handleSearch}
                    className="rounded-full px-8 py-6 bg-primary hover:bg-primary/90 text-white font-bold text-lg h-auto"
                  >
                    Search
                  </Button>
                </div>
                <div className="flex items-center justify-center gap-6 mt-6 text-white/90 text-sm">
                  <Link
                    href={localizeLink("/destinations")}
                    className="hover:text-white transition-colors underline underline-offset-4"
                  >
                    Browse by destination
                  </Link>
                  <span className="text-white/50">•</span>
                  <Link
                    href={localizeLink("/tours")}
                    className="hover:text-white transition-colors underline underline-offset-4"
                  >
                    View all tours
                  </Link>
                  <span className="text-white/50">•</span>
                  <Link
                    href={localizeLink("/deals")}
                    className="hover:text-white transition-colors underline underline-offset-4 text-yellow-400"
                  >
                    Special offers
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Trust Indicators - Intrepid Style */}
        <section className="bg-[#F8F6F3] py-12 border-y">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="flex items-center justify-center mb-3">
                  <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
                  <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
                  <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
                  <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
                  <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
                </div>
                <p className="text-sm font-bold text-zinc-900">4.9/5 rating</p>
                <p className="text-xs text-zinc-600 mt-1">From 2000+ reviews</p>
              </div>
              <div>
                <Users className="h-8 w-8 text-primary mx-auto mb-3" />
                <p className="text-sm font-bold text-zinc-900">Small groups</p>
                <p className="text-xs text-zinc-600 mt-1">12 people max</p>
              </div>
              <div>
                <MapPin className="h-8 w-8 text-primary mx-auto mb-3" />
                <p className="text-sm font-bold text-zinc-900">100+ destinations</p>
                <p className="text-xs text-zinc-600 mt-1">Across all continents</p>
              </div>
              <div>
                <Calendar className="h-8 w-8 text-primary mx-auto mb-3" />
                <p className="text-sm font-bold text-zinc-900">Flexible booking</p>
                <p className="text-xs text-zinc-600 mt-1">Free cancellation</p>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Destinations - Intrepid Style */}
        {destinations.length > 0 && (
          <section className="py-20 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-end mb-12">
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-3">
                    Popular destinations
                  </h2>
                  <p className="text-zinc-600 text-lg">
                    Explore our most-loved places around the world
                  </p>
                </div>
                <Link href={localizeLink("/destinations")}>
                  <span className="hidden md:inline text-zinc-900 font-bold border-b-2 border-zinc-900 pb-1 hover:text-primary hover:border-primary transition-colors cursor-pointer">
                    View all destinations
                  </span>
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
                {destinations.slice(0, 8).map((dest) => (
                  <Link
                    key={dest.id}
                    href={localizeLink(`/destinations/${dest.slug}`)}
                    className="group block"
                  >
                    <div className="relative aspect-square rounded-full overflow-hidden mb-4 shadow-md border-4 border-white mx-auto max-w-[220px] group-hover:border-primary transition-colors duration-300">
                      <Image
                        src={
                          dest.image ||
                          "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=600"
                        }
                        alt={dest.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <h3 className="text-center text-lg font-bold text-zinc-900 group-hover:text-primary transition-colors">
                      {dest.name}
                    </h3>
                  </Link>
                ))}
              </div>

              <div className="text-center mt-8 md:hidden">
                <Link href={localizeLink("/destinations")}>
                  <Button variant="outline" className="rounded-full px-8">
                    View all destinations
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Featured Tours - Intrepid Style */}
        <section className="py-20 px-6 bg-[#F8F6F3]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4">
                Featured trips
              </h2>
              <p className="text-zinc-600 text-lg max-w-2xl mx-auto">
                Hand-picked adventures for every type of traveler
              </p>
            </div>

            {featuredTours.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredTours.map((tour) => (
                  <TripCard key={tour.id} trip={tour} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-zinc-500 mb-4">No featured tours available</p>
                <Link href={localizeLink("/tours")}>
                  <Button>Browse all tours</Button>
                </Link>
              </div>
            )}

            <div className="text-center mt-12">
              <Link href={localizeLink("/tours")}>
                <Button
                  size="lg"
                  className="rounded-full px-12 py-6 text-lg font-bold bg-primary hover:bg-primary/90"
                >
                  View all trips
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Why Choose Us - Intrepid Style */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4">
                Why travel with us
              </h2>
              <p className="text-zinc-600 text-lg max-w-2xl mx-auto">
                We&apos;re committed to creating meaningful travel experiences
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-900">
                  Small group adventures
                </h3>
                <p className="text-zinc-600">
                  Travel with like-minded people in groups of 12 or fewer
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <MapPin className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-900">
                  Local experiences
                </h3>
                <p className="text-zinc-600">
                  Immerse yourself in local culture with expert guides
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Star className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-900">
                  Responsible travel
                </h3>
                <p className="text-zinc-600">
                  Supporting communities and protecting the planet
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter - Intrepid Style */}
        <section className="py-20 px-6 bg-zinc-900 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Get travel inspiration
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Subscribe to our newsletter for exclusive deals and trip ideas
            </p>

            <form
              className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Newsletter subscription coming soon!");
              }}
            >
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 h-14 rounded-full bg-white text-zinc-900 border-0 px-6 text-lg"
                required
              />
              <Button
                type="submit"
                className="h-14 rounded-full px-12 bg-primary hover:bg-primary/90 font-bold text-lg"
              >
                Subscribe
              </Button>
            </form>

            <p className="text-sm text-white/60 mt-6">
              By subscribing, you agree to receive marketing emails from us.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
