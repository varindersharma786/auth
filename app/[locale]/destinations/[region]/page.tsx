"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Loader2 } from "lucide-react";
import HeroSection from "@/components/home/HeroSection";
import IntroSection from "@/components/home/IntroSection";
import DealsTable from "@/components/home/DealsTable";
import TripGrid from "@/components/home/TripGrid";
import HighlightsSection from "@/components/home/HighlightsSection";
import ReviewsSection from "@/components/home/ReviewsSection";
import InspirationCarousel from "@/components/home/InspirationCarousel";
import BrowseByDestination from "@/components/home/BrowseByDestination";
import PurposeSection from "@/components/home/PurposeSection";
import SubscriptionSection from "@/components/home/SubscriptionSection";
import { useCurrency } from "@/context/CurrencyContext";
import { Banner, Article, getBanners, getArticles } from "@/lib/api";

export default function RegionPage() {
  const params = useParams();
  const region = params?.region as string;
  const { localizeLink } = useCurrency();

  const [heroBanner, setHeroBanner] = useState<Banner | undefined>();
  const [introArticle, setIntroArticle] = useState<Article | undefined>();
  const [loading, setLoading] = useState(true);

  // Capitalize region name for display
  const regionName = region
    ? region.charAt(0).toUpperCase() + region.slice(1)
    : "Region";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch hero banner for this region (or fallback to general HERO type)
        const banners = await getBanners("HERO");
        const regionBanner = banners.find(
          (b) =>
            b.title.toLowerCase().includes(region?.toLowerCase() || "") &&
            b.isActive
        );
        setHeroBanner(regionBanner || banners.find((b) => b.isActive));

        // Fetch intro article for this region
        const articles = await getArticles("HIGHLIGHT");
        const regionArticle = articles.find((a) =>
          a.title.toLowerCase().includes(region?.toLowerCase() || "")
        );
        setIntroArticle(regionArticle || articles[0]);
      } catch (error) {
        console.error("Failed to fetch region content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [region]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
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
            <span className="text-zinc-900 font-bold">{regionName}</span>
          </nav>
        </div>
      </div>

      <main className="w-full">
        <HeroSection banner={heroBanner} region={regionName} />
        <IntroSection article={introArticle} region={regionName} />
        <DealsTable region={regionName} />
        <TripGrid region={regionName} />
        <HighlightsSection region={regionName} />
        <ReviewsSection />
        <InspirationCarousel />
        <BrowseByDestination region={regionName} />
        <PurposeSection />
        <SubscriptionSection />
      </main>
    </div>
  );
}
