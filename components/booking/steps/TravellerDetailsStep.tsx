"use client";

import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookingFormValues } from "../BookingClient";
import {
  Info,
  User,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface TravellerDetailsStepProps {
  onNext: () => void;
  onBack: () => void;
}

export const TravellerDetailsStep = ({
  onNext,
  onBack,
}: TravellerDetailsStepProps) => {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<BookingFormValues>();

  const { fields } = useFieldArray({
    control,
    name: "travelers",
  });

  const numberOfTravelers = watch("numberOfTravelers");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
      {/* Important Info Banner */}
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 space-y-2">
        <h4 className="font-bold flex items-center gap-2 text-blue-900">
          <Info className="w-5 h-5" />
          Important: Passport information required
        </h4>
        <p className="text-sm text-blue-800">
          Please ensure all names match your passport exactly. This information
          is required for booking confirmations and border crossings.
        </p>
        <ul className="list-disc pl-5 text-sm space-y-1 mt-2 text-blue-800">
          <li>Check visa and entry requirements for your destination</li>
          <li>
            Passport must be valid for at least 6 months from departure date
          </li>
          <li>
            All travelers must have travel insurance (can be added in next step)
          </li>
        </ul>
      </div>

      {/* Traveler Forms */}
      {fields.map((field, index) => (
        <Card key={field.id} className="border-2">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b">
              <div className="p-3 bg-primary/10 rounded-full">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {index === 0 ? "Lead Traveler" : `Traveler ${index + 1}`}
                  {index === 0 && (
                    <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                      Lead Guest
                    </span>
                  )}
                </h3>
                <p className="text-sm text-zinc-600">
                  {index === 0
                    ? "This person will receive all booking communications"
                    : "Additional passenger information"}
                </p>
              </div>
            </div>

            {/* Personal Details */}
            <div>
              <h4 className="font-semibold mb-4">Personal information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`travelers.${index}.title`}>Title *</Label>
                  <Controller
                    control={control}
                    name={`travelers.${index}.title` as const}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <SelectTrigger
                          className={
                            errors.travelers?.[index]?.title
                              ? "border-red-500"
                              : ""
                          }
                        >
                          <SelectValue placeholder="Select title" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mr">Mr</SelectItem>
                          <SelectItem value="Mrs">Mrs</SelectItem>
                          <SelectItem value="Ms">Ms</SelectItem>
                          <SelectItem value="Miss">Miss</SelectItem>
                          <SelectItem value="Dr">Dr</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.travelers?.[index]?.title && (
                    <p className="text-xs text-red-500">
                      {errors.travelers[index]?.title?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`travelers.${index}.firstName`}>
                    First name (as per passport) *
                  </Label>
                  <Input
                    id={`travelers.${index}.firstName`}
                    {...register(`travelers.${index}.firstName` as const)}
                    className={
                      errors.travelers?.[index]?.firstName
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {errors.travelers?.[index]?.firstName && (
                    <p className="text-xs text-red-500">
                      {errors.travelers[index]?.firstName?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`travelers.${index}.middleName`}>
                    Middle name (optional)
                  </Label>
                  <Input
                    id={`travelers.${index}.middleName`}
                    {...register(`travelers.${index}.middleName` as const)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`travelers.${index}.lastName`}>
                    Last name (as per passport) *
                  </Label>
                  <Input
                    id={`travelers.${index}.lastName`}
                    {...register(`travelers.${index}.lastName` as const)}
                    className={
                      errors.travelers?.[index]?.lastName
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {errors.travelers?.[index]?.lastName && (
                    <p className="text-xs text-red-500">
                      {errors.travelers[index]?.lastName?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`travelers.${index}.dateOfBirth`}>
                    Date of birth *
                  </Label>
                  <Input
                    id={`travelers.${index}.dateOfBirth`}
                    type="date"
                    {...register(`travelers.${index}.dateOfBirth` as const)}
                    className={
                      errors.travelers?.[index]?.dateOfBirth
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {errors.travelers?.[index]?.dateOfBirth && (
                    <p className="text-xs text-red-500">
                      {errors.travelers[index]?.dateOfBirth?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`travelers.${index}.nationality`}>
                    Nationality
                  </Label>
                  <Input
                    id={`travelers.${index}.nationality`}
                    {...register(`travelers.${index}.nationality` as const)}
                    placeholder="e.g., American, British"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor={`travelers.${index}.passportNo`}>
                    Passport number (optional)
                  </Label>
                  <Input
                    id={`travelers.${index}.passportNo`}
                    {...register(`travelers.${index}.passportNo` as const)}
                    placeholder="Can be provided later"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Contact Details (Lead traveler only) */}
            {index === 0 && (
              <div>
                <h4 className="font-semibold mb-4">Contact information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor={`travelers.${index}.email`}>
                      Email address *
                    </Label>
                    <Input
                      id={`travelers.${index}.email`}
                      type="email"
                      {...register(`travelers.${index}.email` as const)}
                      className={
                        errors.travelers?.[index]?.email ? "border-red-500" : ""
                      }
                    />
                    {errors.travelers?.[index]?.email && (
                      <p className="text-xs text-red-500">
                        {errors.travelers[index]?.email?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`travelers.${index}.phone`}>
                      Phone number *
                    </Label>
                    <Input
                      id={`travelers.${index}.phone`}
                      {...register(`travelers.${index}.phone` as const)}
                      placeholder="Include country code"
                      className={
                        errors.travelers?.[index]?.phone ? "border-red-500" : ""
                      }
                    />
                    {errors.travelers?.[index]?.phone && (
                      <p className="text-xs text-red-500">
                        {errors.travelers[index]?.phone?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor={`travelers.${index}.address`}>
                      Home address *
                    </Label>
                    <Textarea
                      id={`travelers.${index}.address`}
                      {...register(`travelers.${index}.address` as const)}
                      placeholder="Street address, City, State/Province, Postal Code, Country"
                      rows={3}
                      className={
                        errors.travelers?.[index]?.address
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {errors.travelers?.[index]?.address && (
                      <p className="text-xs text-red-500">
                        {errors.travelers[index]?.address?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Emergency Contact */}
      <Card className="border-2 border-orange-200 bg-orange-50/50">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-orange-200">
            <div className="p-3 bg-orange-500/10 rounded-full">
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Emergency Contact</h3>
              <p className="text-sm text-zinc-600">
                Someone we can contact in case of emergency (not traveling with
                you)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="emergencyContact.name">Full name *</Label>
              <Input
                id="emergencyContact.name"
                {...register("emergencyContact.name")}
                className={
                  errors.emergencyContact?.name ? "border-red-500" : ""
                }
              />
              {errors.emergencyContact?.name && (
                <p className="text-xs text-red-500">
                  {errors.emergencyContact.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContact.phone">Phone number *</Label>
              <Input
                id="emergencyContact.phone"
                {...register("emergencyContact.phone")}
                placeholder="Include country code"
                className={
                  errors.emergencyContact?.phone ? "border-red-500" : ""
                }
              />
              {errors.emergencyContact?.phone && (
                <p className="text-xs text-red-500">
                  {errors.emergencyContact.phone.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContact.relationship">
                Relationship *
              </Label>
              <Input
                id="emergencyContact.relationship"
                {...register("emergencyContact.relationship")}
                placeholder="e.g., Spouse, Parent, Sibling"
                className={
                  errors.emergencyContact?.relationship ? "border-red-500" : ""
                }
              />
              {errors.emergencyContact?.relationship && (
                <p className="text-xs text-red-500">
                  {errors.emergencyContact.relationship.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Special Requests */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">Special requests (optional)</h3>
          <p className="text-sm text-zinc-600">
            Let us know about any dietary requirements, medical conditions, or
            special needs
          </p>
          <Textarea
            {...register("specialRequests")}
            placeholder="e.g., Vegetarian meals, mobility assistance, allergies..."
            rows={4}
          />
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
          Back to rooms
        </Button>
        <Button type="button" onClick={onNext} size="lg" className="gap-2">
          Continue to trip extras
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
