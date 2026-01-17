"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
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

export default function RegionPage() {
  const params = useParams();
  const region = params?.region as string;
  const { localizeLink } = useCurrency();

  // Capitalize region name for display
  const regionName = region
    ? region.charAt(0).toUpperCase() + region.slice(1)
    : "Region";

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
        <HeroSection region={regionName} />
        <IntroSection region={regionName} />
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
