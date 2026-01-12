"use client";

import Image from "next/image";
import { Tour } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin } from "lucide-react";

interface TourHeroProps {
  tour: Tour;
}

export default function TourHero({ tour }: TourHeroProps) {
  // Use first image or placeholder
  const mainImage = tour.images?.[0] || "/placeholder-tour.jpg";
  const galleryImages = tour.images?.slice(1, 4) || [];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {tour.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-zinc-900 dark:text-zinc-50">
              4.8
            </span>
            <span>(124 reviews)</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>
              {tour.startLocation} to {tour.endLocation}
            </span>
          </div>
          <Badge variant="secondary" className="font-normal">
            {tour.theme}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[400px] rounded-xl overflow-hidden">
        <div className="md:col-span-2 relative h-full">
          <Image
            src={mainImage}
            alt={tour.title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"
            priority
          />
        </div>
        <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-2 h-full">
          {galleryImages.map((img, idx) => (
            <div key={idx} className="relative h-full">
              <Image
                src={img}
                alt={`Gallery ${idx}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
          {/* Fallback pattern if not enough images */}
          {[...Array(Math.max(0, 4 - (galleryImages.length + 1)))].map(
            (_, idx) => (
              <div
                key={`placeholder-${idx}`}
                className="relative h-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center"
              >
                <span className="text-zinc-400 text-sm">Image</span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
