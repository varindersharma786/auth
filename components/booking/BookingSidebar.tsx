import { Tour } from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Star, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useCurrency } from "@/context/CurrencyContext";

interface BookingSidebarProps {
  tour: Tour;
  currentStep: number;
}

export const BookingSidebar = ({ tour }: BookingSidebarProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const { currency, currencySymbol, exchangeRate } = useCurrency();

  // Price calculations
  const convert = (amount: number) => amount * exchangeRate;
  const format = (amount: number) =>
    new Intl.NumberFormat(undefined, { style: "currency", currency }).format(
      amount
    );

  const priceFrom = convert(tour.priceFrom);
  const discount = convert(725.5);
  const total = priceFrom - discount;

  // Calculate generic dates for demo
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 30); // Start in 30 days
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + tour.durationDays);

  return (
    <div className="sticky top-24 space-y-4">
      {/* Availability Warning */}
      <div className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-md p-3 flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        Only 4 spaces left
      </div>

      <Card className="shadow-lg border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={tour.images[0] || "/placeholder-tour.jpg"}
              alt={tour.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6 pb-2">
            <h3 className="text-xl font-bold font-display">{tour.title}</h3>
            <div className="flex items-center gap-1 mt-2 text-yellow-500">
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm text-muted-foreground ml-1">
                4.82 • 373 reviews
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              {tour.durationDays} days
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold">Start</p>
                <p className="text-muted-foreground">
                  {startDate.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p className="text-muted-foreground uppercase">
                  {tour.startLocation}
                </p>
              </div>
              <div>
                <p className="font-semibold">Finish</p>
                <p className="text-muted-foreground">
                  {endDate.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p className="text-muted-foreground uppercase">
                  {tour.endLocation}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Price Breakdown */}
          <div className="space-y-4">
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <div className="flex items-center justify-between font-medium">
                <span>Trip</span>
                <CollapsibleTrigger asChild>
                  <button className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded">
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="space-y-2 mt-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>1 traveller</span>
                  <span>{format(priceFrom)}</span>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Separator />

            <div className="flex items-center justify-between font-medium">
              <span>Room options</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>

            <Separator />

            <div className="flex items-center justify-between font-medium">
              <span>Pre & post-trip extras</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>

            <Separator />

            <div className="flex items-center justify-between font-medium">
              <span>Donation</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-green-600 font-medium">
                <span>Discount</span>
                <span>-{format(discount)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{format(total)}</span>
              </div>
              <p className="text-xs text-muted-foreground text-right">
                GST included
              </p>
            </div>
          </div>

          <div className="pt-4 flex justify-between items-center text-lg font-bold border-t border-zinc-200 dark:border-zinc-800">
            <span>Pay now</span>
            <span>{format(total)}</span>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-md text-xs space-y-2 text-blue-800 dark:text-blue-300">
            <p className="flex gap-2">
              <span className="font-bold">✓</span> We offer{" "}
              <strong>flexible deposits</strong>, pay as you go
            </p>
            <p className="flex gap-2">
              <span className="font-bold">🔒</span>{" "}
              <strong>Secure today&apos;s price</strong> before it changes
            </p>
            <p className="flex gap-2">
              <span className="font-bold">🛡️</span> We prioritise{" "}
              <strong>protecting your data</strong>
            </p>
            <p className="flex gap-2">
              <span className="font-bold">📞</span> We offer{" "}
              <strong>24/7 global support</strong>. Phone us on{" "}
              <a href="#" className="underline">
                +61 3 7043 6363
              </a>
            </p>
          </div>

          <div className="text-center">
            <button
              type="button"
              className="text-xs font-semibold hover:underline"
            >
              How to redeem credit
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
