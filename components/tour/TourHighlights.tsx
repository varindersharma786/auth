"use client";

import { Check, Heart } from "lucide-react";
import { Tour } from "@/lib/api";

interface TourHighlightsProps {
  tour: Tour;
}

export default function TourHighlights({ tour }: TourHighlightsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-bold font-serif text-zinc-900 dark:text-zinc-50">
          Why you&apos;ll love this trip
        </h2>
        <Heart className="h-5 w-5 text-rose-500 fill-rose-500 animate-pulse" />
      </div>

      <div className="prose dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-300">
        <p>{tour.overview || "Experience an unforgettable journey..."}</p>
      </div>

      {tour.highlight && tour.highlight.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2 mt-4">
          {tour.highlight.map((item, idx) => (
            <li key={idx} className="flex gap-3 items-start">
              <div className="mt-1 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Check className="h-3 w-3 text-primary" />
              </div>
              <span className="text-sm">{item.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
