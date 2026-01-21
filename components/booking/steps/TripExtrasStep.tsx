"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { BookingFormValues } from "../BookingClient";
import { Info, Package, Shield, DollarSign, Plus, Minus, ChevronLeft, ChevronRight, Plane, Hotel, Coffee, Car } from "lucide-react";
import { Tour } from "@/lib/api";
import { useState, useMemo } from "react";

interface TripExtrasStepProps {
  onNext: () => void;
  onBack: () => void;
  tour: Tour;
}

interface TourWithRelations extends Tour {
  roomOptions?: Array<{
    id: string;
    tourId: string;
    roomType: string;
    description?: string;
    priceAdd: number;
    isDefault: boolean;
  }>;
  departures?: Array<{
    id: string;
    tourId: string;
    departureDate: string;
    endDate: string;
    price: number;
    discountedPrice?: number;
    availableSpaces: number;
    status: string;
  }>;
}

export const TripExtrasStep = ({ onNext, onBack, tour }: TripExtrasStepProps) => {
  const { watch, setValue } = useFormContext<BookingFormValues>();
  const [selectedExtras, setSelectedExtras] = useState<Record<string, number>>({});
  const [selectedRoomOption, setSelectedRoomOption] = useState<string>("TWIN_SHARE");
  const [preTripNights, setPreTripNights] = useState<number>(0);
  const [postTripNights, setPostTripNights] = useState<number>(0);
  const [donationAmount, setDonationAmount] = useState<number>(0);
  const insuranceRequired = watch("insuranceRequired");
  const numberOfTravelers = watch("numberOfTravelers") || 1;
  const selectedDepartureId = watch("departureId");

  const roomOptions = (tour as TourWithRelations).roomOptions || [];
  const kittyItems = tour.tripExtras?.filter((extra) => extra.type === "Kitty") || [];
  const optionalActivities = tour.tripExtras?.filter((extra) => extra.type === "Optional Activity") || [];
  const otherExtras = tour.tripExtras?.filter(
    (extra) => extra.type !== "Kitty" && extra.type !== "Optional Activity"
  ) || [];

  // Get the selected departure to calculate base price
  const selectedDeparture = (tour as TourWithRelations).departures?.find((dep: { id: string; }) => dep.id === selectedDepartureId);
  const basePrice = selectedDeparture?.discountedPrice || selectedDeparture?.price || tour.priceFrom || 0;

  // Calculate room option price
  const roomOptionPrice = useMemo(() => {
    const roomOption = roomOptions.find((ro: { roomType: string; }) => ro.roomType === selectedRoomOption);
    if (roomOption) {
      return (roomOption.priceAdd || 0) * numberOfTravelers;
    }
    return 0;
  }, [selectedRoomOption, roomOptions, numberOfTravelers]);

  // Calculate pre/post trip accommodation
  const preTripPrice = useMemo(() => {
    return preTripNights * 150 * numberOfTravelers; // Assuming $150 per night
  }, [preTripNights, numberOfTravelers]);

  const postTripPrice = useMemo(() => {
    return postTripNights * 150 * numberOfTravelers; // Assuming $150 per night
  }, [postTripNights, numberOfTravelers]);

  // Calculate extras total
  const extrasTotal = useMemo(() => {
    let total = 0;
    Object.entries(selectedExtras).forEach(([extraId, quantity]) => {
      const extra = tour.tripExtras?.find((e) => e.id === extraId);
      if (extra?.price) {
        total += extra.price * quantity;
      }
    });
    return total;
  }, [selectedExtras, tour.tripExtras]);

  // Calculate total
  const total = useMemo(() => {
    return basePrice + roomOptionPrice + preTripPrice + postTripPrice + extrasTotal + donationAmount;
  }, [basePrice, roomOptionPrice, preTripPrice, postTripPrice, extrasTotal, donationAmount]);

  // Calculate total per person
  const totalPerPerson = useMemo(() => {
    return total / numberOfTravelers;
  }, [total, numberOfTravelers]);

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

  // Update room option in form
  const handleRoomOptionChange = (roomType: string) => {
    setSelectedRoomOption(roomType);
    setValue("roomOptionId", roomType);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
      <div>
        <h2 className="text-2xl font-bold mb-2">Enhance your experience</h2>
        <p className="text-zinc-600">
          Add optional activities and services to make your trip even more memorable
        </p>
      </div>

      {/* Room Options */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b">
            <div className="p-3 bg-purple-500/10 rounded-full">
              <Hotel className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Room Options</h3>
              <p className="text-sm text-zinc-600">
                Choose your preferred accommodation style
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {roomOptions.map((option) => {
              const isSelected = selectedRoomOption === option.roomType;
              return (
                <div 
                  key={option.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${isSelected ? 'border-purple-500 bg-purple-50' : 'hover:bg-zinc-50'}`}
                  onClick={() => handleRoomOptionChange(option.roomType)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={isSelected}
                        onChange={() => handleRoomOptionChange(option.roomType)}
                        className="h-4 w-4 text-purple-600"
                      />
                      <div>
                        <h4 className="font-bold">
                          {option.roomType.replace(/_/g, ' ')}
                        </h4>
                        <p className="text-sm text-zinc-600">
                          {option.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {option.priceAdd && option.priceAdd > 0 ? (
                        <>
                          <p className="text-lg font-bold text-purple-600">
                            +${option.priceAdd.toFixed(2)}/pp
                          </p>
                          <p className="text-xs text-zinc-500">
                            ${((option.priceAdd || 0) * numberOfTravelers).toFixed(2)} total
                          </p>
                        </>
                      ) : (
                        <p className="text-green-600 font-bold">Included</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Pre & Post Trip Accommodation */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b">
            <div className="p-3 bg-blue-500/10 rounded-full">
              <Plane className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Pre & Post-Trip Accommodation</h3>
              <p className="text-sm text-zinc-600">
                Extend your stay before or after the tour
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Coffee className="h-5 w-5 text-blue-600" />
                Pre-Trip Nights
              </h4>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPreTripNights(prev => Math.max(0, prev - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-semibold min-w-[3rem] text-center">
                  {preTripNights} nights
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPreTripNights(prev => prev + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                {preTripNights > 0 && (
                  <span className="ml-auto text-sm font-semibold text-blue-600">
                    ${preTripPrice.toFixed(2)} total
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-600 mt-2">
                $150/night × {preTripNights} nights × {numberOfTravelers} travelers
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Car className="h-5 w-5 text-blue-600" />
                Post-Trip Nights
              </h4>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPostTripNights(prev => Math.max(0, prev - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-semibold min-w-[3rem] text-center">
                  {postTripNights} nights
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPostTripNights(prev => prev + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                {postTripNights > 0 && (
                  <span className="ml-auto text-sm font-semibold text-blue-600">
                    ${postTripPrice.toFixed(2)} total
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-600 mt-2">
                $150/night × {postTripNights} nights × {numberOfTravelers} travelers
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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

      {/* Donation */}
      <Card className="border-2 border-amber-200">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-amber-200">
            <div className="p-3 bg-amber-500/10 rounded-full">
              <DollarSign className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Support Local Communities</h3>
              <p className="text-sm text-zinc-600">
                Help fund community projects through the Intrepid Foundation
              </p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800 mb-3">
              <strong>Make a difference!</strong> Your donation supports life-changing projects empowering local communities.
            </p>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="donation"
                  checked={donationAmount === 0}
                  onChange={() => {
                    setDonationAmount(0);
                    setValue("donationAmount", 0);
                  }}
                  className="h-4 w-4"
                />
                <span>No donation</span>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="donation"
                  checked={donationAmount === 25}
                  onChange={() => {
                    setDonationAmount(25);
                    setValue("donationAmount", 25);
                  }}
                  className="h-4 w-4"
                />
                <span>$25</span>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="donation"
                  checked={donationAmount === 50}
                  onChange={() => {
                    setDonationAmount(50);
                    setValue("donationAmount", 50);
                  }}
                  className="h-4 w-4"
                />
                <span>$50</span>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="donation"
                  checked={donationAmount === 100}
                  onChange={() => {
                    setDonationAmount(100);
                    setValue("donationAmount", 100);
                  }}
                  className="h-4 w-4"
                />
                <span>$100</span>
              </div>
            </div>
            
            <div className="mt-3 flex items-center gap-2">
              <input
                type="radio"
                name="donation"
                checked={donationAmount > 100}
                onChange={() => {
                  setDonationAmount(150);
                  setValue("donationAmount", 150);
                }}
                className="h-4 w-4"
              />
              <span>Other amount:</span>
              <input
                type="number"
                min="0"
                value={donationAmount > 100 ? donationAmount : ''}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val >= 0) {
                    setDonationAmount(val);
                    setValue("donationAmount", val);
                  }
                }}
                placeholder="Enter amount"
                className="border rounded px-2 py-1 w-24"
              />
            </div>
          </div>
        </CardContent>
      </Card>

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

      {/* Dynamic Total Summary */}
      <Card className="bg-gradient-to-r from-primary to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold">Your Total</h3>
              <p className="text-sm opacity-80">Updates as you make selections</p>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-3xl font-bold">${total.toFixed(2)}</p>
              <p className="text-sm opacity-80">${totalPerPerson.toFixed(2)} per person</p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/20 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Base price:</span>
              <span>${basePrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Room option:</span>
              <span>${roomOptionPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Pre-trip nights:</span>
              <span>${preTripPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Post-trip nights:</span>
              <span>${postTripPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Extras:</span>
              <span>${extrasTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Donation:</span>
              <span>${donationAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t border-white/20">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

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
