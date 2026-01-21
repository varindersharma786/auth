"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { BookingFormValues } from "../BookingClient";
import { Info, Package, Shield, DollarSign, Plus, Minus, ChevronLeft, ChevronRight } from "lucide-react";
import { Tour } from "@/lib/api";
import { useState } from "react";

interface TripExtrasStepProps {
  onNext: () => void;
  onBack: () => void;
  tour: Tour;
}

export const TripExtrasStep = ({ onNext, onBack, tour }: TripExtrasStepProps) => {
  const { watch, setValue } = useFormContext<BookingFormValues>();
  const [selectedExtras, setSelectedExtras] = useState<Record<string, number>>({});
  const insuranceRequired = watch("insuranceRequired");

  const kittyItems = tour.tripExtras?.filter((extra) => extra.type === "Kitty") || [];
  const optionalActivities = tour.tripExtras?.filter((extra) => extra.type === "Optional Activity") || [];
  const otherExtras = tour.tripExtras?.filter(
    (extra) => extra.type !== "Kitty" && extra.type !== "Optional Activity"
  ) || [];

  const handleExtraQuantityChange = (extraId: string, change: number) => {
    const currentQty = selectedExtras[extraId] || 0;
    const newQty = Math.max(0, currentQty + change);
    setSelectedExtras({ ...selectedExtras, [extraId]: newQty });

    // Update form value
    const currentAddOns = watch("addOns") || [];
    if (newQty === 0) {
      setValue(
        "addOns",
        currentAddOns.filter((addon) => addon.id !== extraId)
      );
    } else {
      const existingIndex = currentAddOns.findIndex((addon) => addon.id === extraId);
      if (existingIndex >= 0) {
        currentAddOns[existingIndex].quantity = newQty;
        setValue("addOns", [...currentAddOns]);
      } else {
        setValue("addOns", [...currentAddOns, { id: extraId, quantity: newQty }]);
      }
    }
  };

  const calculateExtrasTotal = () => {
    let total = 0;
    Object.entries(selectedExtras).forEach(([extraId, quantity]) => {
      const extra = tour.tripExtras?.find((e) => e.id === extraId);
      if (extra?.price) {
        total += extra.price * quantity;
      }
    });
    return total;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
      <div>
        <h2 className="text-2xl font-bold mb-2">Enhance your experience</h2>
        <p className="text-zinc-600">
          Add optional activities and services to make your trip even more memorable
        </p>
      </div>

      {/* Kitty Items */}
      {kittyItems.length > 0 && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b">
              <div className="p-3 bg-green-500/10 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Group Kitty</h3>
                <p className="text-sm text-zinc-600">
                  Communal expenses collected at the start of the trip
                </p>
              </div>
            </div>

            {kittyItems.map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-bold mb-1">{item.name}</h4>
                    {item.notes && (
                      <p className="text-sm text-zinc-600">{item.notes}</p>
                    )}
                  </div>
                  {item.price && (
                    <div className="text-right ml-4">
                      <p className="text-lg font-bold text-green-600">
                        ${item.price.toFixed(2)}
                      </p>
                      <p className="text-xs text-zinc-500">per person</p>
                    </div>
                  )}
                </div>
                <Badge variant="secondary" className="mt-2 bg-green-500 text-white">
                  Required
                </Badge>
              </div>
            ))}

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-green-800">
                <strong>Note:</strong> The kitty helps cover meals, transport, and activities during your trip. Your tour leader will manage these funds transparently.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Optional Activities */}
      {optionalActivities.length > 0 && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b">
              <div className="p-3 bg-primary/10 rounded-full">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Optional Activities</h3>
                <p className="text-sm text-zinc-600">
                  Book now or arrange during your trip
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              {optionalActivities.map((activity) => {
                const quantity = selectedExtras[activity.id] || 0;
                return (
                  <div key={activity.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-bold mb-1">{activity.name}</h4>
                        {activity.notes && (
                          <p className="text-sm text-zinc-600">{activity.notes}</p>
                        )}
                      </div>
                      {activity.price && (
                        <div className="text-right ml-4">
                          <p className="text-lg font-bold">${activity.price.toFixed(2)}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleExtraQuantityChange(activity.id, -1)}
                        disabled={quantity === 0}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-semibold min-w-[3rem] text-center">
                        {quantity} {quantity === 1 ? "person" : "people"}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleExtraQuantityChange(activity.id, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      {quantity > 0 && activity.price && (
                        <span className="ml-auto text-sm font-semibold text-primary">
                          Total: ${(activity.price * quantity).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Other Extras */}
      {otherExtras.length > 0 && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-xl font-bold mb-4">Additional Services</h3>
            <div className="grid gap-4">
              {otherExtras.map((extra) => {
                const quantity = selectedExtras[extra.id] || 0;
                return (
                  <div key={extra.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold">{extra.name}</h4>
                          <Badge variant="outline">{extra.type}</Badge>
                        </div>
                        {extra.notes && (
                          <p className="text-sm text-zinc-600">{extra.notes}</p>
                        )}
                      </div>
                      {extra.price && (
                        <div className="text-right ml-4">
                          <p className="text-lg font-bold">${extra.price.toFixed(2)}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleExtraQuantityChange(extra.id, -1)}
                        disabled={quantity === 0}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-semibold min-w-[2rem] text-center">{quantity}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleExtraQuantityChange(extra.id, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Travel Insurance */}
      <Card className="border-2 border-blue-200">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b">
            <div className="p-3 bg-blue-500/10 rounded-full">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Travel Insurance</h3>
              <Badge variant="default" className="bg-orange-500 mt-1">
                Highly Recommended
              </Badge>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900 mb-3">
              <strong>Protect your trip investment!</strong> We strongly recommend comprehensive travel insurance covering:
            </p>
            <ul className="text-sm text-blue-800 space-y-1 list-disc pl-5">
              <li>Trip cancellation and interruption</li>
              <li>Medical emergencies and evacuation</li>
              <li>Lost or delayed baggage</li>
              <li>Adventure activities coverage</li>
            </ul>
          </div>

          <label className="flex items-start gap-3 cursor-pointer p-4 border-2 rounded-lg hover:bg-zinc-50 transition-colors">
            <Checkbox
              checked={insuranceRequired}
              onCheckedChange={(checked) => setValue("insuranceRequired", checked as boolean)}
              className="mt-1"
            />
            <div>
              <span className="font-semibold">I confirm I have travel insurance</span>
              <p className="text-sm text-zinc-600 mt-1">
                or I acknowledge the risks of traveling without insurance
              </p>
            </div>
          </label>
        </CardContent>
      </Card>

      {/* Extras Summary */}
      {calculateExtrasTotal() > 0 && (
        <Card className="bg-zinc-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Trip extras total:</span>
              <span className="text-2xl font-bold text-primary">
                ${calculateExtrasTotal().toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-zinc-600 mt-2">
              This will be added to your final payment
            </p>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          size="lg"
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to travelers
        </Button>
        <Button
          type="button"
          onClick={onNext}
          size="lg"
          className="gap-2"
        >
          Continue to payment
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
