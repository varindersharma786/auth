import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BookingFormValues } from "../BookingClient";
import { Info, Lock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Tour } from "@/lib/api";
import Image from "next/image";

interface PaymentStepProps {
  onBack: () => void;
  tour: Tour;
}

export const PaymentStep = ({ onBack, tour }: PaymentStepProps) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useFormContext<BookingFormValues>();
  const agreeTerms = watch("agreeTerms");
  const readGuidelines = watch("readGuidelines");
  const updatesConsent = watch("updatesConsent");

  const totalPrice = tour.priceFrom - 725.5; // Discount hardcoded for demo matching screenshot

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
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

      <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 bg-white dark:bg-zinc-950">
        <p className="text-sm text-muted-foreground mb-6">
          Have you reviewed the details in the booking summary? If something
          isn&apos;t correct, you can adjust your details in the previous steps.
        </p>

        <h3 className="text-2xl font-bold mb-4">Payment options</h3>

        <div className="flex items-center gap-3 p-4 border rounded-md border-black bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-700">
          <input
            type="radio"
            checked
            readOnly
            className="w-4 h-4 text-black bg-black border-gray-300 focus:ring-black dark:focus:ring-white dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <span className="font-medium">
            Pay in full {tour.currency} {totalPrice.toLocaleString()}
          </span>
        </div>

        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Payment details</h3>
            <div className="flex items-center gap-2">
              {/* Icons simulation */}
              <div className="h-6 w-10 relative">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                  alt="Visa"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="h-6 w-10 relative">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                  alt="Mastercard"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold border border-zinc-300 rounded px-1 py-0.5">
                <Lock className="w-2 h-2" /> SECURE PAYMENT
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="cardName"
                className="text-muted-foreground font-normal"
              >
                Cardholder name
              </Label>
              <Input
                id="cardName"
                placeholder=""
                {...register("cardName")}
                className="bg-transparent px-0 border-t-0 border-x-0 rounded-none focus-visible:ring-0 border-b border-zinc-300 focus:border-black shadow-none font-medium h-auto py-2"
              />
              {errors.cardName && (
                <p className="text-xs text-red-500">
                  {errors.cardName.message}
                </p>
              )}
            </div>

            <div className="space-y-2 relative">
              <Label
                htmlFor="cardNumber"
                className="text-muted-foreground font-normal absolute -top-3 left-0 text-xs"
              >
                1234 5678 9012 3456
              </Label>
              <Input
                id="cardNumber"
                placeholder="Card number"
                {...register("cardNumber")}
                className="bg-transparent px-0 border-t-0 border-x-0 rounded-none focus-visible:ring-0 border-b border-zinc-300 focus:border-black shadow-none h-auto py-2 mt-2"
              />
              {errors.cardNumber && (
                <p className="text-xs text-red-500">
                  {errors.cardNumber.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label
                  htmlFor="expiryDate"
                  className="text-muted-foreground font-normal"
                >
                  MM/YY
                </Label>
                <Input
                  id="expiryDate"
                  placeholder="Expiry date"
                  {...register("expiryDate")}
                  className="bg-transparent px-0 border-t-0 border-x-0 rounded-none focus-visible:ring-0 border-b border-zinc-300 focus:border-black shadow-none h-auto py-2"
                />
                {errors.expiryDate && (
                  <p className="text-xs text-red-500">
                    {errors.expiryDate.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="cvv"
                  className="text-muted-foreground font-normal"
                >
                  3 digits
                </Label>
                <Input
                  id="cvv"
                  placeholder="CVC/CVV"
                  {...register("cvv")}
                  className="bg-transparent px-0 border-t-0 border-x-0 rounded-none focus-visible:ring-0 border-b border-zinc-300 focus:border-black shadow-none h-auto py-2"
                />
                {errors.cvv && (
                  <p className="text-xs text-red-500">{errors.cvv.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div className="flex items-start gap-3">
            <Checkbox
              id="terms"
              checked={agreeTerms === true}
              onCheckedChange={(checked) =>
                setValue("agreeTerms", checked === true ? true : undefined, {
                  shouldValidate: true,
                })
              }
              className="mt-1"
            />
            <Label
              htmlFor="terms"
              className="text-sm font-normal leading-tight cursor-pointer"
            >
              I agree to the{" "}
              <a href="#" className="underline text-red-600">
                terms and conditions
              </a>{" "}
              and{" "}
              <a href="#" className="underline text-red-600">
                privacy policy
              </a>{" "}
              *
            </Label>
          </div>
          {errors.agreeTerms && (
            <p className="text-xs text-red-500 ml-7">
              {errors.agreeTerms.message}
            </p>
          )}

          <div className="flex items-start gap-3">
            <Checkbox
              id="guidelines"
              checked={readGuidelines === true}
              onCheckedChange={(checked) =>
                setValue(
                  "readGuidelines",
                  checked === true ? true : undefined,
                  { shouldValidate: true }
                )
              }
              className="mt-1"
            />
            <Label
              htmlFor="guidelines"
              className="text-sm font-normal leading-tight cursor-pointer"
            >
              I have read the{" "}
              <a href="#" className="underline text-red-600">
                Essential Trip Information
              </a>{" "}
              and will follow{" "}
              <a href="#" className="underline text-red-600">
                community guidelines
              </a>{" "}
              *
            </Label>
          </div>
          {errors.readGuidelines && (
            <p className="text-xs text-red-500 ml-7">
              {errors.readGuidelines.message}
            </p>
          )}

          <div className="flex items-start gap-3">
            <Checkbox
              id="marketing"
              checked={updatesConsent}
              onCheckedChange={(checked) =>
                setValue("updatesConsent", checked === true)
              }
              className="mt-1"
            />
            <Label
              htmlFor="marketing"
              className="text-sm font-normal leading-tight cursor-pointer text-muted-foreground"
            >
              I would like to receive offers and regular updates from Intrepid
              Travel via email
            </Label>
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex justify-end gap-4 items-center">
        <Button variant="ghost" onClick={onBack} type="button">
          Back
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black px-8 py-6 h-auto text-lg font-bold"
        >
          {isSubmitting ? "Processing..." : "Pay Now"}
        </Button>
      </div>
    </div>
  );
};
