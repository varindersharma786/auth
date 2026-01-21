import { Tour, TourDeparture, RoomOption } from "@/lib/api";
import { BookingFormValues } from "./BookingClient";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Star, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { useState, useMemo } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useCurrency } from "@/context/CurrencyContext";

interface BookingSidebarProps {
  tour: Tour;
  currentStep: number;
  formValues: BookingFormValues;
  departures: TourDeparture[];
  roomOptions: RoomOption[];
}

export const BookingSidebar = ({
  tour,
  currentStep,
  formValues,
  departures,
  roomOptions,
}: BookingSidebarProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isRoomOpen, setIsRoomOpen] = useState(true);
  const [isExtrasOpen, setIsExtrasOpen] = useState(true);

  const { currency, currencySymbol, exchangeRate } = useCurrency();

  // Helper to format currency
  const format = (amount: number) =>
    new Intl.NumberFormat(undefined, { style: "currency", currency }).format(
      amount * exchangeRate,
    );

  // --- Calculations ---

  // 1. Departure & Base Price
  const selectedDeparture = useMemo(
    () => departures.find((d) => d.id === formValues.departureId),
    [departures, formValues.departureId],
  );

  const travelersCount = formValues.numberOfTravelers || 1;
  const basePricePerPerson = selectedDeparture?.price || tour.priceFrom;
  const basePriceTotal = basePricePerPerson * travelersCount;

  // Dates
  const startDate = selectedDeparture
    ? new Date(selectedDeparture.departureDate)
    : new Date(); // Fallback to now if nothing selected
  const endDate = selectedDeparture
    ? new Date(selectedDeparture.endDate)
    : new Date(new Date().setDate(new Date().getDate() + tour.durationDays));

  // 2. Room Option
  const selectedRoom = useMemo(
    () => roomOptions.find((r) => r.id === formValues.roomOptionId),
    [roomOptions, formValues.roomOptionId],
  );
  const roomPriceTotal = (selectedRoom?.priceAdd || 0) * travelersCount;

  // 3. Extras
  // Assuming addOns will have price info eventually, but relying on quantity for now if price is missing in schema?
  // The schema for addOns is { id: string, quantity: number }. We need the price of the addOn.
  // TripExtrasStep likely has the full addOn objects. But Sidebar needs them too basically.
  // For now, let's assume `tripExtras` on `tour` object has prices.
  const extrasTotal = (formValues.addOns || []).reduce((acc, addon) => {
    const extra = tour.tripExtras.find((e) => e.id === addon.id);
    return acc + (extra?.price || 0) * addon.quantity;
  }, 0);

  // 4. Donation
  const donationTotal = formValues.donationAmount || 0;

  // Total
  const total = basePriceTotal + roomPriceTotal + extrasTotal + donationTotal;

  // Render Helpers
  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="sticky top-24 space-y-4">
      {/* Availability Warning */}
      {selectedDeparture && selectedDeparture.availableSpaces < 5 && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-md p-3 flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          Only {selectedDeparture.availableSpaces} spaces left
        </div>
      )}

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
                  {selectedDeparture ? (
                    formatDate(startDate)
                  ) : (
                    <span className="text-zinc-400 italic">Select date</span>
                  )}
                </p>
                <p className="text-muted-foreground uppercase">
                  {tour.startLocation}
                </p>
              </div>
              <div>
                <p className="font-semibold">Finish</p>
                <p className="text-muted-foreground">
                  {selectedDeparture ? (
                    formatDate(endDate)
                  ) : (
                    <span className="text-zinc-400 italic">—</span>
                  )}
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
            {/* TRIP SECTION */}
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
                  <span>
                    {travelersCount} traveler{travelersCount > 1 ? "s" : ""} x{" "}
                    {format(basePricePerPerson)}
                  </span>
                  <span>{format(basePriceTotal)}</span>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Separator />

            {/* ROOM OPTIONS */}
            <Collapsible open={isRoomOpen} onOpenChange={setIsRoomOpen}>
              <div className="flex items-center justify-between font-medium">
                <span>Room options</span>
                {selectedRoom && (
                  <CollapsibleTrigger asChild>
                    <button className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded">
                      {isRoomOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </CollapsibleTrigger>
                )}
              </div>
              {selectedRoom && (
                <CollapsibleContent className="space-y-2 mt-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>{selectedRoom.roomType}</span>
                    <span>{format(roomPriceTotal)}</span>
                  </div>
                </CollapsibleContent>
              )}
            </Collapsible>

            <Separator />

            {/* PRE & POST TRIP EXTRAS */}
            <Collapsible open={isExtrasOpen} onOpenChange={setIsExtrasOpen}>
              <div className="flex items-center justify-between font-medium">
                <span>Pre & post-trip extras</span>
                {extrasTotal > 0 && (
                  <CollapsibleTrigger asChild>
                    <button className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded">
                      {isExtrasOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </CollapsibleTrigger>
                )}
              </div>
              {extrasTotal > 0 && (
                <CollapsibleContent className="space-y-2 mt-2 text-sm text-muted-foreground">
                  {(formValues.addOns || []).map((addon, idx) => {
                    const extra = tour.tripExtras.find(
                      (e) => e.id === addon.id,
                    );
                    if (!extra || addon.quantity === 0) return null;
                    return (
                      <div key={idx} className="flex justify-between">
                        <span>
                          {addon.quantity}x {extra.name}
                        </span>
                        <span>
                          {format((extra.price || 0) * addon.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </CollapsibleContent>
              )}
            </Collapsible>

            <Separator />

            {/* DONATION */}
            <div className="flex items-center justify-between font-medium">
              <span>Donation</span>
              {donationTotal > 0 && (
                <span className="text-sm text-muted-foreground">
                  {format(donationTotal)}
                </span>
              )}
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{format(total)}</span>
              </div>
              <p className="text-xs text-muted-foreground text-right">
                GST included
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
