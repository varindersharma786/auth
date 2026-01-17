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

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main className="w-full">
        <HeroSection />
        <IntroSection />
        <DealsTable />
        <TripGrid />
        <HighlightsSection />
        <ReviewsSection />
        <InspirationCarousel />
        <BrowseByDestination />
        <PurposeSection />
        <SubscriptionSection />
      </main>
    </div>
  );
}
