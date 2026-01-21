"use client";

import { useFormContext } from "react-hook-form";
import { BookingFormValues } from "../BookingClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bed, Users, ChevronRight, ChevronLeft, Info } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface RoomConfigurationStepProps {
  onNext: () => void;
  onBack: () => void;
  roomOptions: Array<{
    id: string;
    roomType: string;
    description?: string;
    priceAdd: number;
    isDefault: boolean;
  }>;
}

const ROOM_TYPE_LABELS: Record<string, { label: string; description: string; icon: string }> = {
  TWIN_SHARE: {
    label: "Twin Share",
    description: "Share a room with another traveler (2 single beds)",
    icon: "👥",
  },
  SINGLE_ROOM: {
    label: "Single Room",
    description: "Have your own private room (1 single bed)",
    icon: "🛏️",
  },
  DOUBLE_ROOM: {
    label: "Double Room",
    description: "Private room with double bed",
    icon: "🛏️",
  },
  TRIPLE_ROOM: {
    label: "Triple Room",
    description: "Share a room with 2 other travelers (3 beds)",
    icon: "👨‍👩‍👦",
  },
  DORMITORY: {
    label: "Dormitory",
    description: "Shared dormitory accommodation",
    icon: "🏢",
  },
};

export const RoomConfigurationStep = ({ onNext, onBack, roomOptions }: RoomConfigurationStepProps) => {
  const { control, watch, setValue } = useFormContext<BookingFormValues>();
  const selectedRoomOptionId = watch("roomOptionId");
  const numberOfTravelers = watch("numberOfTravelers");

  const getRoomInfo = (roomType: string) => {
    return ROOM_TYPE_LABELS[roomType] || {
      label: roomType.replace(/_/g, " "),
      description: "Room accommodation",
      icon: "🛏️",
    };
  };

  const calculateRoomCost = (roomOptionId: string) => {
    const room = roomOptions.find((r) => r.id === roomOptionId);
    if (!room) return 0;
    return room.priceAdd * numberOfTravelers;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Choose your room type</h2>
        <p className="text-zinc-600">
          Select your preferred accommodation style for {numberOfTravelers} {numberOfTravelers === 1 ? "traveler" : "travelers"}
        </p>
      </div>

      {/* Room Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Bed className="h-5 w-5" />
          Available room options
        </h3>

        {roomOptions.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Bed className="h-12 w-12 mx-auto text-zinc-300 mb-4" />
              <p className="text-zinc-600 mb-2">No room options configured</p>
              <p className="text-sm text-zinc-500">
                Please contact us for accommodation details
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {roomOptions.map((room) => {
              const isSelected = selectedRoomOptionId === room.id;
              const roomInfo = getRoomInfo(room.roomType);
              const additionalCost = calculateRoomCost(room.id);

              return (
                <Card
                  key={room.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    isSelected ? "border-primary border-2 shadow-lg" : ""
                  }`}
                  onClick={() => setValue("roomOptionId", room.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            checked={isSelected}
                            onChange={() => setValue("roomOptionId", room.id)}
                            className="h-5 w-5"
                          />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{roomInfo.icon}</span>
                            <div>
                              <h4 className="font-bold text-lg">{roomInfo.label}</h4>
                              {room.isDefault && (
                                <Badge variant="secondary" className="text-xs">
                                  Most Popular
                                </Badge>
                              )}
                            </div>
                          </div>

                          <p className="text-sm text-zinc-600 mb-2">
                            {room.description || roomInfo.description}
                          </p>

                          {room.roomType === "TWIN_SHARE" && numberOfTravelers === 1 && (
                            <div className="flex items-start gap-2 mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                              <Info className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-amber-800">
                                You&apos;ll be paired with another traveler of the same gender. If you prefer a private room, select Single Room option.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-right ml-4">
                        {room.priceAdd > 0 ? (
                          <div>
                            <p className="text-xl font-bold text-primary">
                              +${room.priceAdd.toFixed(2)}
                            </p>
                            <p className="text-xs text-zinc-500">per person</p>
                            {numberOfTravelers > 1 && (
                              <p className="text-sm text-zinc-600 mt-1">
                                +${additionalCost.toFixed(2)} total
                              </p>
                            )}
                          </div>
                        ) : (
                          <Badge variant="secondary" className="bg-green-500 text-white">
                            Included
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Roommate Preferences (for twin share) */}
      {selectedRoomOptionId && roomOptions.find((r) => r.id === selectedRoomOptionId)?.roomType === "TWIN_SHARE" && (
        <Card className="bg-zinc-50">
          <CardContent className="p-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Roommate preferences (optional)
            </h4>
            <p className="text-sm text-zinc-600 mb-4">
              If you&apos;re traveling with someone you&apos;d like to share with, enter their name below. Otherwise, we&apos;ll pair you with another traveler.
            </p>
            
            <FormField
              control={control}
              name="roommates.0.shareWith"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Share room with (optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter name of travel companion"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Leave blank if you&apos;re happy to be paired with any traveler
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      )}

      {/* Information Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-bold text-blue-900 mb-2">Room configuration notes</h4>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>• All rooms include basic amenities and clean bedding</li>
          <li>• Single room supplements are subject to availability</li>
          <li>• Twin share rooms are same-gender only</li>
          <li>• Final room assignments are confirmed 2 weeks before departure</li>
        </ul>
      </div>

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
          Back to dates
        </Button>
        <Button
          type="button"
          onClick={onNext}
          disabled={!selectedRoomOptionId}
          size="lg"
          className="gap-2"
        >
          Continue to traveler details
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
