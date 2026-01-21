"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";

interface TourCardProps {
  tour: any;
}

export function TourCard({ tour }: TourCardProps) {
  const averageRating =
    tour.reviews.length > 0
      ? (
          tour.reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0) /
          tour.reviews.length
        ).toFixed(1)
      : "New";

  return (
    <div className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden shadow-sm border group h-full">
      {/* Image Container */}
      <div className="relative w-full md:w-[300px] aspect-4/3 md:aspect-auto overflow-hidden">
        <Image
          src={tour.images?.[0] || "/placeholder-tour.jpg"}
          alt={tour.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-white rounded-full shadow-sm backdrop-blur-sm transition-colors">
          <Heart className="w-4 h-4 text-zinc-600" />
        </button>
        {tour.isSale && (
          <Badge className="absolute top-2 left-2 bg-red-600 text-white border-none font-bold">
            SALE
          </Badge>
        )}
        {tour.isNew && (
          <Badge className="absolute top-2 left-2 bg-blue-600 text-white border-none font-bold">
            NEW
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1 text-xs text-zinc-500 mb-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-zinc-900">{averageRating}</span>
            <span>({tour.reviews.length} reviews)</span>
          </div>

          <Link href={`/en/tours/${tour.slug}`}>
            <h3 className="text-lg font-bold text-zinc-900 leading-snug hover:text-red-600 transition-colors line-clamp-2">
              {tour.title}
            </h3>
          </Link>

          <div className="mt-2 text-sm text-zinc-600 flex items-center gap-2">
            <span>{tour.durationDays} days</span>
            <span className="text-zinc-300">•</span>
            <span>
              {tour.startLocation} to {tour.endLocation}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="text-[10px] uppercase tracking-wider font-bold border-zinc-300"
            >
              {tour.style}
            </Badge>
            <Badge
              variant="outline"
              className="text-[10px] uppercase tracking-wider font-bold border-zinc-300"
            >
              {tour.theme}
            </Badge>
          </div>

          <div className="mt-3 flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`h-1 w-4 rounded-full ${
                  i < tour.physicalRating ? "bg-zinc-800" : "bg-zinc-200"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-end justify-between">
          <div>
            <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">
              From
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-bold">USD</span>
              <span className="text-xl font-black">${tour.priceFrom}</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="font-bold border-zinc-300 hover:bg-zinc-50"
          >
            + Add to compare
          </Button>
        </div>
      </div>
    </div>
  );
}
