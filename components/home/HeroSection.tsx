"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useCurrency } from "@/context/CurrencyContext";
import { Banner } from "@/lib/api";

interface HeroSectionProps {
  banner?: Banner;
  region?: string;
}

export default function HeroSection({ banner, region }: HeroSectionProps) {
  const { localizeLink } = useCurrency();

  // Fallback values if no banner provided
  const title = banner?.title || `Discover ${region || "Amazing Destinations"}`;
  const subtitle =
    banner?.subtitle ||
    "Experience the world with expert-led tours and life-changing journeys";
  const image =
    banner?.imageUrl ||
    "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=2000";
  const ctaText = banner?.ctaText || "Explore Tours";
  const ctaUrl = banner?.ctaUrl || "/tours";

  return (
    <section className="relative h-[600px] md:h-[700px] overflow-hidden bg-zinc-900">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover opacity-70"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent" />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 drop-shadow-2xl leading-tight">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto font-medium drop-shadow-lg leading-relaxed">
            {subtitle}
          </p>
          <Link href={localizeLink(ctaUrl)}>
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-12 py-7 text-lg font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
              {ctaText}
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
