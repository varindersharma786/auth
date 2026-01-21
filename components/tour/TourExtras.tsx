"use client";

import { Tour } from "@/lib/api";
import { Package, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TourExtrasProps {
  tour: Tour;
}

export default function TourExtras({ tour }: TourExtrasProps) {
  if (!tour.tripExtras || tour.tripExtras.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 mx-auto text-zinc-300 mb-4" />
        <p className="text-zinc-500">No trip extras available</p>
      </div>
    );
  }

  // Group extras by type
  const kittyItems = tour.tripExtras.filter((extra) => extra.type === "Kitty");
  const optionalActivities = tour.tripExtras.filter(
    (extra) => extra.type === "Optional Activity"
  );
  const otherExtras = tour.tripExtras.filter(
    (extra) => extra.type !== "Kitty" && extra.type !== "Optional Activity"
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">Trip Extras</h2>
        <p className="text-zinc-600">
          Optional activities and additional services you can add to your trip
        </p>
      </div>

      {/* Kitty Section */}
      {kittyItems.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-primary" />
            Kitty
          </h3>
          <p className="text-zinc-600 mb-4">
            A group kitty is collected at the start of the trip to cover communal expenses throughout your journey.
          </p>
          <div className="grid gap-4">
            {kittyItems.map((item, index) => (
              <Card key={item.id || index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-lg mb-2">{item.name}</h4>
                      {item.notes && (
                        <p className="text-sm text-zinc-600">{item.notes}</p>
                      )}
                    </div>
                    {item.price && (
                      <div className="text-right ml-4">
                        <p className="text-2xl font-bold text-primary">
                          ${item.price}
                        </p>
                        <p className="text-xs text-zinc-500">per person</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Optional Activities */}
      {optionalActivities.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            Optional Activities
          </h3>
          <p className="text-zinc-600 mb-4">
            Enhance your experience with these optional activities. Book in advance or during your trip.
          </p>
          <div className="grid gap-4">
            {optionalActivities.map((activity, index) => (
              <Card key={activity.id || index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-lg">{activity.name}</h4>
                        <Badge variant="secondary">Optional</Badge>
                      </div>
                      {activity.notes && (
                        <p className="text-sm text-zinc-600 leading-relaxed">
                          {activity.notes}
                        </p>
                      )}
                    </div>
                    {activity.price && (
                      <div className="text-right ml-4">
                        <p className="text-xl font-bold">
                          ${activity.price}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Other Extras */}
      {otherExtras.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">Additional Services</h3>
          <div className="grid gap-4">
            {otherExtras.map((extra, index) => (
              <Card key={extra.id || index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-lg mb-2">{extra.name}</h4>
                      <Badge variant="outline" className="mb-2">
                        {extra.type}
                      </Badge>
                      {extra.notes && (
                        <p className="text-sm text-zinc-600">{extra.notes}</p>
                      )}
                    </div>
                    {extra.price && (
                      <div className="text-right ml-4">
                        <p className="text-xl font-bold">${extra.price}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Important Note */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mt-8">
        <h4 className="font-bold text-amber-900 mb-2">Important information</h4>
        <ul className="text-sm text-amber-800 space-y-2">
          <li>• Optional activities are subject to availability and weather conditions</li>
          <li>• Prices are indicative and may vary</li>
          <li>• Some activities require advance booking</li>
          <li>• Your tour leader can help arrange optional activities during the trip</li>
        </ul>
      </div>
    </div>
  );
}
