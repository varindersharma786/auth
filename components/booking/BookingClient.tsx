import { useState } from "react";
import { Tour } from "@/lib/api";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TravellerDetailsStep } from "./steps/TravellerDetailsStep";
import { TripExtrasStep } from "./steps/TripExtrasStep";
import { PaymentStep } from "./steps/PaymentStep";
import { BookingSidebar } from "./BookingSidebar";

interface BookingClientProps {
  tour: Tour;
}

// Define the schema for the entire wizard
const bookingSchema = z.object({
  // Step 1: Traveller Details
  title: z.string().min(1, "Title is required"),
  firstName: z.string().min(2, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(2, "Last name is required"),
  dobDay: z.string().min(1, "Day is required"),
  dobMonth: z.string().min(1, "Month is required"),
  dobYear: z.string().min(1, "Year is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(5, "Phone is required"),
  address: z.string().min(5, "Address is required"),

  // Step 2: Trip Extras (Simplified for now)
  roomOption: z.enum(["twin", "single"]),
  shareWithFriend: z.boolean().optional(),

  // Step 3: Payment
  paymentOption: z.enum(["full"]),
  cardName: z.string().min(2, "Cardholder name is required"),
  cardNumber: z.string().min(16, "Invalid card number"),
  expiryDate: z.string().min(5, "Invalid expiry date"), // MM/YY
  cvv: z.string().min(3, "Invalid CVV"),
  agreeTerms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms and conditions" }),
  }),
  readGuidelines: z.literal(true, {
    errorMap: () => ({ message: "You must read the essential trip info" }),
  }),
  updatesConsent: z.boolean().optional(),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;

export const BookingClient = ({ tour }: BookingClientProps) => {
  const [currentStep, setCurrentStep] = useState(1);

  const methods = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    mode: "onChange",
    defaultValues: {
      paymentOption: "full",
      roomOption: "twin",
    },
  });

  const { handleSubmit, trigger } = methods;

  const steps = [
    { id: 1, label: "Traveller details" },
    { id: 2, label: "Trip extras" },
    { id: 3, label: "Payment" },
  ];

  const nextStep = async () => {
    let isValid = false;
    if (currentStep === 1) {
      isValid = await trigger([
        "title",
        "firstName",
        "lastName",
        "dobDay",
        "dobMonth",
        "dobYear",
        "email",
        "phone",
        "address",
      ]);
    } else if (currentStep === 2) {
      isValid = await trigger(["roomOption"]);
    }

    if (isValid) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
    window.scrollTo(0, 0);
  };

  const onSubmit = async (data: BookingFormValues) => {
    console.log("Booking submitted:", data);
    // TODO: Submit to API
    alert("Booking functionality coming soon!");
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Stepper */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-4 relative">
          {/* Connecting line */}
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-border -z-10" />

          {steps.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <div
                key={step.id}
                className="flex flex-col items-center gap-2 bg-background px-4"
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                    isCompleted
                      ? "bg-primary border-primary text-primary-foreground"
                      : isCurrent
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-muted-foreground text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium",
                    isCurrent ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            {steps[currentStep - 1].label}
          </h1>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {currentStep === 1 && <TravellerDetailsStep onNext={nextStep} />}
              {currentStep === 2 && (
                <TripExtrasStep onNext={nextStep} onBack={prevStep} />
              )}
              {currentStep === 3 && (
                <PaymentStep onBack={prevStep} tour={tour} />
              )}
            </form>
          </FormProvider>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <BookingSidebar tour={tour} currentStep={currentStep} />
        </div>
      </div>
    </div>
  );
};
