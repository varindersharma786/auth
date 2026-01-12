import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BookingFormValues } from "../BookingClient";
import { Info } from "lucide-react";

interface TravellerDetailsStepProps {
  onNext: () => void;
}

export const TravellerDetailsStep = ({ onNext }: TravellerDetailsStepProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<BookingFormValues>();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
      {/* Disclaimer */}
      <div className="bg-sky-50 dark:bg-sky-950/30 border-l-4 border-sky-600 p-4 space-y-2 text-sky-800 dark:text-sky-300">
        <h4 className="font-bold flex items-center gap-2">
          <Info className="w-5 h-5" />
          Full payment required to request your place
        </h4>
        <p className="text-sm">
          As your trip departs soon, we&apos;ll check if there&apos;s space and
          get back to you in 2-4 business days. If unavailable, we&apos;ll
          refund you.
        </p>
        <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
          <li>
            <strong>Important:</strong> Don&apos;t book non-refundable travel
            until your trip is confirmed.
          </li>
          <li>
            <strong>Before you travel:</strong> Check{" "}
            <a href="#" className="underline text-red-600">
              visa and entry requirements
            </a>
            .
          </li>
        </ul>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center text-xs">
            1
          </span>
          1. Primary traveller details
        </h2>

        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 space-y-6">
          <h3 className="font-bold text-lg">Personal details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Select
                onValueChange={(val) => {
                  // Normally connect to Rhf with Controller or simple register via hidden input
                }}
                defaultValue="Mr"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select title" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mr">Mr</SelectItem>
                  <SelectItem value="Mrs">Mrs</SelectItem>
                  <SelectItem value="Ms">Ms</SelectItem>
                  <SelectItem value="Dr">Dr</SelectItem>
                </SelectContent>
              </Select>
              {/* For demo simply registering hidden/text input behind select or assume select works */}
              <input type="hidden" {...register("title")} value="Mr" />
            </div>

            <div className="flex items-end pb-2">
              <span className="text-sm font-bold flex items-center gap-1 cursor-help">
                <Info className="w-4 h-4" /> Why do we need this?
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstName">First name (as per passport)*</Label>
            <Input
              id="firstName"
              {...register("firstName")}
              className={errors.firstName ? "border-red-500" : ""}
            />
            {errors.firstName && (
              <p className="text-xs text-red-500">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="middleName">Middle name (as per passport)</Label>
            <Input id="middleName" {...register("middleName")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last name (as per passport)*</Label>
            <Input
              id="lastName"
              {...register("lastName")}
              className={errors.lastName ? "border-red-500" : ""}
            />
            {errors.lastName && (
              <p className="text-xs text-red-500">{errors.lastName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Date of birth *</Label>
            <div className="grid grid-cols-3 gap-4">
              <Input placeholder="Day" {...register("dobDay")} />
              <Input placeholder="Month" {...register("dobMonth")} />
              <Input placeholder="Year" {...register("dobYear")} />
            </div>
          </div>

          <Separator className="my-6" />

          <h3 className="font-bold text-lg">Contact details</h3>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Contact number *</Label>
            <Input id="phone" {...register("phone")} />
            {errors.phone && (
              <p className="text-xs text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              placeholder="Start typing an address, e.g. 123 Main St"
              {...register("address")}
            />
            {errors.address && (
              <p className="text-xs text-red-500">{errors.address.message}</p>
            )}
            <Button
              variant="outline"
              size="sm"
              type="button"
              className="mt-2 text-xs"
            >
              Enter address manually
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={onNext}
          className="bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black"
        >
          Continue &gt;
        </Button>
      </div>
    </div>
  );
};

import { Separator } from "@/components/ui/separator";
