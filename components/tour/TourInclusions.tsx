"use client";

import { Check, X } from "lucide-react";
import { Tour } from "@/lib/api";

interface TourInclusionsProps {
  tour: Tour;
}

export default function TourInclusions({ tour }: TourInclusionsProps) {
  const hasInclusions = tour.inclusions && tour.inclusions.length > 0;
  const hasExclusions = tour.exclusions && tour.exclusions.length > 0;

  if (!hasInclusions && !hasExclusions) return null;

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {hasInclusions && (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-50">
            What&apos;s Included
          </h3>
          <ul className="space-y-3">
            {tour.inclusions.map((item, idx) => (
              <li
                key={idx}
                className="flex gap-3 text-sm text-zinc-600 dark:text-zinc-300"
              >
                <Check className="h-5 w-5 text-green-500 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasExclusions && (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-50">
            What&apos;s Not Included
          </h3>
          <ul className="space-y-3">
            {tour.exclusions.map((item, idx) => (
              <li
                key={idx}
                className="flex gap-3 text-sm text-zinc-600 dark:text-zinc-300"
              >
                <X className="h-5 w-5 text-red-500 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
