import HeroCarousel from "@/components/home/HeroCarousel";
import SearchSection from "@/components/home/SearchSection";
import TripTabs from "@/components/home/TripTabs";
import WhatSetsUsApart from "@/components/home/WhatSetsUsApart";
import PromoBanner from "@/components/home/PromoBanner";
import DestinationGrid from "@/components/home/DestinationGrid";
import SubscriptionSection from "@/components/home/SubscriptionSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <main className="w-full">
        {/* Hero Section */}
        <HeroCarousel />

        {/* Search & Stats */}
        <SearchSection />

        {/* Trip Exploration */}
        <TripTabs />

        {/* What Sets Us Apart */}
        <WhatSetsUsApart />

        {/* Promo Banner */}
        <PromoBanner />

        {/* Destination Grid */}
        <DestinationGrid />

        {/* Subscription */}
        <SubscriptionSection />
      </main>
    </div>
  );
}
