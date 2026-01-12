"use client";

import { Tour } from "@/lib/api";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Map, Coffee, Bed, Bus } from "lucide-react";
import Image from "next/image";

interface TourItineraryProps {
  tour: Tour;
}

export default function TourItinerary({ tour }: TourItineraryProps) {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold font-serif text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
        <Map className="h-6 w-6 text-primary" />
        Itinerary
      </h2>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {tour.itinerary.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border rounded-xl px-4 bg-zinc-50/50 dark:bg-zinc-900/50 data-[state=open]:bg-white dark:data-[state=open]:bg-zinc-900 data-[state=open]:shadow-md transition-all duration-200"
              >
                <div className="flex gap-4 py-4">
                  <div className="flex flex-col items-center gap-1">
                    <Badge
                      variant="outline"
                      className="h-8 w-8 rounded-full p-0 flex items-center justify-center border-primary/50 text-primary font-bold"
                    >
                      {item.day}
                    </Badge>
                    <div className="w-px h-full bg-zinc-200 dark:bg-zinc-800 my-2" />
                  </div>

                  <div className="flex-1">
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline py-0 pt-1">
                      {item.title}
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      {item.details}

                      <div className="mt-6 flex flex-wrap gap-4 pt-4 border-t border-dashed">
                        {tour.accommodation.find((acc) => acc.name) && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Bed className="h-4 w-4" />
                            <span>Accommodation included</span>
                          </div>
                        )}
                        {tour.mealsIncluded && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Coffee className="h-4 w-4" />
                            <span>Meals included</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Bus className="h-4 w-4" />
                          <span>{tour.transport}</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </div>
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 relative shadow-inner border">
              {tour.mapImage ? (
                <Image
                  src={tour.mapImage}
                  alt="Tour Map"
                  fill
                  className="object-contain p-4"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
                  <Map className="h-12 w-12 mb-2 opacity-20" />
                  <p className="text-sm">
                    Map view not available for this tour
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
