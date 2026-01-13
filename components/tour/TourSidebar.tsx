"use client";

import { Tour } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Calendar, User, Info } from "lucide-react";

import { useCurrency } from "@/context/CurrencyContext";

interface TourSidebarProps {
  tour: Tour;
}

export default function TourSidebar({ tour }: TourSidebarProps) {
  const { currency, exchangeRate } = useCurrency();

  const finalPrice = tour.priceFrom * exchangeRate;
  const formattedPrice = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency,
  }).format(finalPrice);

  return (
    <div className="sticky top-24">
      <Card className="border-none shadow-premium bg-zinc-50/50 dark:bg-zinc-900/50 overflow-hidden">
        <div className="bg-primary p-4 text-primary-foreground text-center">
          <p className="text-sm font-medium opacity-90">
            Trip Code: {tour.code}
          </p>
        </div>
        <CardHeader>
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-sm text-muted-foreground">From</span>
            <div className="text-right">
              <span className="text-3xl font-bold block">{formattedPrice}</span>
              <span className="text-xs text-muted-foreground">per person</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center border shrink-0">
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">Duration</p>
                <p className="text-muted-foreground">
                  {tour.durationDays} Days
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center border shrink-0">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">Group Size</p>
                <p className="text-muted-foreground">
                  Max {tour.maxGroupSize} people
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center border shrink-0">
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">Min Age</p>
                <p className="text-muted-foreground">
                  {tour.minAge ? `${tour.minAge}+ years` : "All ages"}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-medium mb-3 text-sm">Available Dates</h4>
            <div className="space-y-2">
              {/* Placeholder dates */}
              {["Oct 15, 2026", "Nov 02, 2026", "Dec 10, 2026"].map(
                (date, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-sm p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
                  >
                    <span>{date}</span>
                    <span className="text-green-600 font-medium text-xs">
                      Available
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button className="w-full text-lg py-6 shadow-lg shadow-primary/20">
            Book Now
          </Button>
          <Button variant="outline" className="w-full">
            Download Brochure
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-2">
            No booking fees • 24/7 Support
          </p>
        </CardFooter>
      </Card>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/50">
        <h4 className="font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2 mb-2">
          <Info className="h-4 w-4" /> Need Help?
        </h4>
        <p className="text-sm text-blue-800 dark:text-blue-200">
          Speak to an expert about this trip. <br />
          <span className="font-bold">Call: +1 555-0123</span>
        </p>
      </div>
    </div>
  );
}
