"use client";

import { useFormContext } from "react-hook-form";
import { BookingFormValues } from "../BookingClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, ChevronRight } from "lucide-react";
import { Tour } from "@/lib/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

interface DateSelectionStepProps {
  onNext: () => void;
  departures: Array<{
    id: string;
    departureDate: string;
    endDate: string;
    price: number;
    discountedPrice?: number;
    availableSpaces: number;
    status: string;
  }>;
  tour: Tour;
}

export const DateSelectionStep = ({ onNext, departures, tour }: DateSelectionStepProps) => {
  const { control, watch, setValue } = useFormContext<BookingFormValues>();
  const selectedDepartureId = watch("departureId");
  const numberOfTravelers = watch("numberOfTravelers");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string, availableSpaces: number) => {
    if (status === "SOLD_OUT" || availableSpaces === 0) {
      return <Badge variant="destructive">Sold Out</Badge>;
    }
    if (availableSpaces <= 5) {
      return <Badge variant="default" className="bg-orange-500">Only {availableSpaces} spots left!</Badge>;
    }
    return <Badge variant="secondary" className="bg-green-500 text-white">Available</Badge>;
  };

  const calculateTotal = (departureId: string) => {
    const departure = departures.find((d) => d.id === departureId);
    if (!departure) return 0;
    const price = departure.discountedPrice || departure.price;
    return price * numberOfTravelers;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Choose your departure date</h2>
        <p className="text-zinc-600">
          Select from our available departure dates for {tour.title}
        </p>
      </div>

      {/* Number of Travelers */}
      <Card>
        <CardContent className="p-6">
          <FormField
            control={control}
            name="numberOfTravelers"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-lg font-semibold">
                  <Users className="h-5 w-5" />
                  Number of travelers
                </FormLabel>
                <Select
                  value={field.value?.toString() || "1"}
                  onValueChange={(value) => field.onChange(parseInt(value))}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select number of travelers" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "Traveler" : "Travelers"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Available Departures */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Available departure dates
        </h3>

        {departures.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-12 w-12 mx-auto text-zinc-300 mb-4" />
              <p className="text-zinc-600 mb-2">No departures available</p>
              <p className="text-sm text-zinc-500">
                Please contact us for custom departure arrangements
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {departures.map((departure) => {
              const isSelected = selectedDepartureId === departure.id;
              const isAvailable = departure.status === "AVAILABLE" && departure.availableSpaces >= numberOfTravelers;
              const total = calculateTotal(departure.id);

              return (
                <Card
                  key={departure.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    isSelected ? "border-primary border-2 shadow-lg" : ""
                  } ${!isAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => {
                    if (isAvailable) {
                      setValue("departureId", departure.id);
                    }
                  }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              checked={isSelected}
                              onChange={() => {
                                if (isAvailable) {
                                  setValue("departureId", departure.id);
                                }
                              }}
                              disabled={!isAvailable}
                              className="h-5 w-5"
                            />
                          </div>
                          {getStatusBadge(departure.status, departure.availableSpaces)}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-lg">
                              {formatDate(departure.departureDate)}
                            </h4>
                            <span className="text-zinc-400">→</span>
                            <span className="text-zinc-600">
                              {formatDate(departure.endDate)}
                            </span>
                          </div>

                          <p className="text-sm text-zinc-600">
                            {tour.durationDays} days • {departure.availableSpaces} spaces available
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="space-y-1">
                          {departure.discountedPrice ? (
                            <>
                              <p className="text-sm text-zinc-500 line-through">
                                ${departure.price.toFixed(2)}
                              </p>
                              <p className="text-2xl font-bold text-primary">
                                ${departure.discountedPrice.toFixed(2)}
                              </p>
                            </>
                          ) : (
                            <p className="text-2xl font-bold">
                              ${departure.price.toFixed(2)}
                            </p>
                          )}
                          <p className="text-xs text-zinc-500">per person</p>
                          {isSelected && numberOfTravelers > 1 && (
                            <p className="text-sm font-semibold text-primary mt-2">
                              Total: ${total.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Information Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-bold text-blue-900 mb-2">Before you book</h4>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>• Prices are per person and subject to availability</li>
          <li>• A deposit may be required to secure your booking</li>
          <li>• Final payment is due 60 days before departure</li>
          <li>• Check visa requirements for your destination</li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <div></div>
        <Button
          type="button"
          onClick={onNext}
          disabled={!selectedDepartureId}
          size="lg"
          className="gap-2"
        >
          Continue to room selection
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
