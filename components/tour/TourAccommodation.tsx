"use client";

import { Tour } from "@/lib/api";
import { Bed, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface TourAccommodationProps {
  tour: Tour;
}

export default function TourAccommodation({ tour }: TourAccommodationProps) {
  if (!tour.accommodation || tour.accommodation.length === 0) {
    return (
      <div className="text-center py-12">
        <Bed className="h-12 w-12 mx-auto text-zinc-300 mb-4" />
        <p className="text-zinc-500">No accommodation information available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Accommodation</h2>
        <p className="text-zinc-600">
          Where you&apos;ll stay during your journey
        </p>
      </div>

      <div className="grid gap-6">
        {tour.accommodation.map((acc, index) => (
          <Card key={acc.id || index} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Bed className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{acc.type}</h3>
                    {acc.name && (
                      <p className="text-sm text-zinc-600">{acc.name}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-zinc-600">Duration</p>
                  <p className="font-bold">{acc.nights} night{acc.nights !== 1 ? 's' : ''}</p>
                </div>
              </div>

              {acc.details && (
                <p className="text-zinc-700 leading-relaxed">{acc.details}</p>
              )}

              {/* Optional: Star rating if available */}
              <div className="flex items-center gap-1 mt-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-4 w-4 text-amber-400 fill-amber-400"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Accommodation Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
        <h4 className="font-bold text-blue-900 mb-2">Please note</h4>
        <p className="text-sm text-blue-800">
          Accommodation listed is subject to change depending on availability, seasonality, and group size. The accommodation
          specified in your itinerary is our preferred partner hotels that offer a great standard and balance of location, comfort,
          and value. In rare cases, your hotel may differ from the options listed.
        </p>
      </div>
    </div>
  );
}
