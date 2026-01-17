"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import TripGrid from "@/components/home/TripGrid";
import SubscriptionSection from "@/components/home/SubscriptionSection";
import Link from "next/link";
import Image from "next/image";
import { useCurrency } from "@/context/CurrencyContext";
import { Banner, SiteSettings, getBanners, getSiteSettings } from "@/lib/api";
import { Loader2 } from "lucide-react";

// Default regions if not configured in CMS
const DEFAULT_REGIONS = [
  {
    name: "Africa",
    slug: "africa",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801",
  },
  {
    name: "Asia",
    slug: "asia",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada",
  },
  {
    name: "Europe",
    slug: "europe",
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b",
  },
  {
    name: "Americas",
    slug: "americas",
    image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29",
  },
];

export default function Home() {
  const { localizeLink } = useCurrency();
  const [heroBanner, setHeroBanner] = useState<Banner | undefined>();
  const [settings, setSettings] = useState<SiteSettings | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [banners, siteSettings] = await Promise.all([
          getBanners("HERO"),
          getSiteSettings(),
        ]);

        setHeroBanner(banners.find((b) => b.isActive) || banners[0]);
        setSettings(siteSettings);
      } catch (error) {
        console.error("Failed to fetch home page content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const heroTitle =
    heroBanner?.title || settings?.siteName || "Explore the World Your Way";
  const heroSubtitle =
    heroBanner?.subtitle ||
    "Experience authentic adventures, from wildlife safaris to cultural journeys across the globe";
  const heroImage =
    heroBanner?.imageUrl ||
    "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=2000";
  const heroCtaText = heroBanner?.ctaText || "Start Exploring";
  const heroCtaUrl = heroBanner?.ctaUrl || "/destinations";

  return (
    <div className="min-h-screen bg-white">
      <main className="w-full">
        {/* Hero Banner - Fully CMS Managed */}
        <section className="relative h-[600px] md:h-[700px] overflow-hidden">
          <Image
            src={heroImage}
            alt={heroTitle}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 drop-shadow-xl leading-tight">
              {heroTitle}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl font-medium drop-shadow-lg">
              {heroSubtitle}
            </p>
            <Link href={localizeLink(heroCtaUrl)}>
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-12 py-7 text-lg font-bold shadow-2xl">
                {heroCtaText}
              </Button>
            </Link>
          </div>
        </section>

        {/* Quick Destinations - Can be managed via CMS banners with type "DESTINATION" */}
        <section className="py-20 px-6 bg-zinc-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">
              Popular Destinations
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {DEFAULT_REGIONS.map((region) => (
                <Link
                  key={region.slug}
                  href={localizeLink(`/destinations/${region.slug}`)}
                >
                  <div className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer">
                    <Image
                      src={`${region.image}?auto=format&fit=crop&q=80&w=800`}
                      alt={region.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-2xl font-bold text-white">
                        {region.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Tours - Dynamically fetched */}
        <TripGrid />

        {/* Newsletter - CMS configurable */}
        <SubscriptionSection />
      </main>
    </div>
  );
}
