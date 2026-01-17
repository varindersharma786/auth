import HeroCarousel from "@/components/home/HeroCarousel";
import { Button } from "@/components/ui/button";
import TripGrid from "@/components/home/TripGrid";
import SubscriptionSection from "@/components/home/SubscriptionSection";
import Link from "next/link";
import Image from "next/image";
import { useCurrency } from "@/context/CurrencyContext";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main className="w-full">
        {/* Hero Banner */}
        <section className="relative h-[600px] md:h-[700px] overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=2000"
            alt="African landscape"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 drop-shadow-xl leading-tight">
              Explore the World
              <br />
              Your Way
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl font-medium drop-shadow-lg">
              Experience authentic adventures, from wildlife safaris to cultural
              journeys across the globe
            </p>
            <Link href="/destinations">
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-12 py-7 text-lg font-bold shadow-2xl">
                Start Exploring
              </Button>
            </Link>
          </div>
        </section>

        {/* Quick Destinations */}
        <section className="py-20 px-6 bg-zinc-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">
              Popular Destinations
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {["Africa", "Asia", "Europe", "Americas"].map((region) => (
                <Link
                  key={region}
                  href={`/destinations/${region.toLowerCase()}`}
                >
                  <div className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer">
                    <Image
                      src={`https://images.unsplash.com/photo-${region === "Africa" ? "1516426122078" : region === "Asia" ? "1548013146" : region === "Europe" ? "1467269204594" : "1501594907352"}-c23e76319801?auto=format&fit=crop&q=80&w=800`}
                      alt={region}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-2xl font-bold text-white">
                        {region}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Tours */}
        <TripGrid />

        {/* Newsletter */}
        <SubscriptionSection />
      </main>
    </div>
  );
}
