import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { BookingFormValues } from "../BookingClient";
import { Info, Lock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tour, createPaymentOrder, capturePaymentOrder } from "@/lib/api";
import { useCurrency } from "@/context/CurrencyContext";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface PaymentStepProps {
  onBack: () => void;
  tour: Tour;
}

export const PaymentStep = ({ onBack, tour }: PaymentStepProps) => {
  const router = useRouter();
  const {
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext<BookingFormValues>();

  const agreeTerms = watch("agreeTerms");
  const readGuidelines = watch("readGuidelines");
  const updatesConsent = watch("updatesConsent");

  const { currency, currencySymbol, exchangeRate } = useCurrency();

  // Price calculation
  const basePrice = tour.priceFrom - 725.5; // Demo discount
  const finalPrice = basePrice * exchangeRate;

  // Format formatted price
  const formattedPrice = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(finalPrice);

  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "card">(
    "paypal"
  ); // Default to paypal for this task

  // We need state to store the booking ID created during createOrder phase
  const [currentBookingId, setCurrentBookingId] = useState<string | null>(null);

  const initialOptions = {
    clientId: "test", // "test" is for sandbox. Use env var in real app
    currency: currency,
    intent: "capture",
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
        <div className="bg-sky-50 dark:bg-sky-950/30 border-l-4 border-sky-600 p-4 space-y-2 text-sky-800 dark:text-sky-300">
          <h4 className="font-bold flex items-center gap-2">
            <Info className="w-5 h-5" />
            Full payment required to request your place
          </h4>
          <p className="text-sm">
            As your trip departs soon, we&apos;ll check if there&apos;s space
            and get back to you in 2-4 business days. If unavailable, we&apos;ll
            refund you.
          </p>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 bg-white dark:bg-zinc-950">
          <p className="text-sm text-muted-foreground mb-6">
            Review details in the booking summary.
          </p>

          <h3 className="text-2xl font-bold mb-4">Payment options</h3>

          {/* Payment Method Selection */}
          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={() => setPaymentMethod("paypal")}
              className={`flex-1 p-4 border rounded-lg flex flex-col items-center justify-center gap-2 transition-all ${
                paymentMethod === "paypal"
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200"
              }`}
            >
              <span className="font-bold">PayPal</span>
            </button>
          </div>

          <div className="flex items-center gap-3 p-4 border rounded-md border-black bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-700 mb-6">
            <span className="font-medium">Pay in full: {formattedPrice}</span>
          </div>

          {/* Terms Checkboxes */}
          <div className="space-y-4 mb-8">
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
              <Label htmlFor="terms" className="text-sm cursor-pointer">
                I agree to terms and conditions *
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
              <Label htmlFor="guidelines" className="text-sm cursor-pointer">
                I have read the Essential Trip Information *
              </Label>
            </div>
            {errors.readGuidelines && (
              <p className="text-xs text-red-500 ml-7">
                {errors.readGuidelines.message}
              </p>
            )}
          </div>

          <Separator className="mb-6" />

          {/* Action Buttons */}
          <div className="space-y-4">
            {paymentMethod === "paypal" ? (
              <div className="relative z-0">
                <PayPalButtons
                  key={currency} // Re-render if currency changes
                  style={{ layout: "vertical" }}
                  disabled={!agreeTerms || !readGuidelines}
                  forceReRender={[currency, finalPrice]}
                  createOrder={async (data, actions) => {
                    // Prepare booking details
                    const bookingData = getValues();
                    const { orderID, bookingID } = await createPaymentOrder({
                      tourId: tour.id,
                      ...bookingData,
                      totalPrice: finalPrice,
                      currency: currency,
                      startDate: new Date().toISOString(), // Demo: using current date, should be from props/selection
                      endDate: new Date().toISOString(),
                      numGuests: 1, // Demo
                    });
                    setCurrentBookingId(bookingID);
                    return orderID;
                  }}
                  onApprove={async (data, actions) => {
                    if (!currentBookingId) return;
                    try {
                      const response = await capturePaymentOrder(
                        data.orderID,
                        currentBookingId
                      );
                      if (response.status === "COMPLETED") {
                        toast.success("Booking confirmed!");
                        // Redirect to confirmation page
                        // router.push("/booking/confirmation/" + currentBookingId);
                        alert(
                          "Payment Successful! Booking Confirmed: " +
                            currentBookingId
                        );
                      }
                    } catch (e) {
                      toast.error("Payment Capture Failed");
                      console.error(e);
                    }
                  }}
                />
              </div>
            ) : (
              <div className="flex justify-end gap-4 items-center">
                <Button variant="ghost" onClick={onBack} type="button">
                  Back
                </Button>
                <Button
                  type="button"
                  disabled
                  className="bg-black text-white px-8 py-6 h-auto text-lg font-bold"
                >
                  Card Payment Not Implemented
                </Button>
              </div>
            )}
            {paymentMethod === "paypal" && (
              <Button
                variant="ghost"
                onClick={onBack}
                type="button"
                className="w-full"
              >
                Back
              </Button>
            )}
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
};
