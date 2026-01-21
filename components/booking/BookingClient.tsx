"use client";
import { useState, useEffect } from "react";
import { Tour } from "@/lib/api";
import { api } from "@/lib/api";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TripExtrasStep } from "./steps/TripExtrasStep";
import { PaymentStep } from "./steps/PaymentStep";
import { BookingSidebar } from "./BookingSidebar";
import { DateSelectionStep } from "./steps/DateSelectionStep";
import { TravellerDetailsStep } from "./steps/TravellerDetailsStep";
import { RoomConfigurationStep } from "./steps/RoomConfigurationStep";
interface BookingClientProps {
  tour: Tour;
}

interface TourDeparture {
  id: string;
  departureDate: string;
  endDate: string;
  price: number;
  discountedPrice?: number;
  availableSpaces: number;
  status: string;
}

interface RoomOption {
  id: string;
  roomType: string;
  description?: string;
  priceAdd: number;
  isDefault: boolean;
}

// Define the schema for the entire wizard
const bookingSchema = z.object({
  // Step 1: Date Selection
  departureId: z.string().min(1, "Please select a departure date"),
  numberOfTravelers: z.number().min(1, "At least 1 traveler required"),

  // Step 2: Room Configuration
  roomOptionId: z.string().min(1, "Please select a room type"),
  roommates: z.array(z.object({
    name: z.string().optional(),
    shareWith: z.string().optional(),
  })).optional(),

  // Step 3: Traveller Details
  travelers: z.array(z.object({
    title: z.string().min(1, "Title is required"),
    firstName: z.string().min(2, "First name is required"),
    middleName: z.string().optional(),
    lastName: z.string().min(2, "Last name is required"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(5, "Phone is required"),
    nationality: z.string().optional(),
    passportNo: z.string().optional(),
    address: z.string().min(5, "Address is required"),
    isLeadGuest: z.boolean().default(false),
  })),
  emergencyContact: z.object({
    name: z.string().min(2, "Emergency contact name required"),
    phone: z.string().min(5, "Emergency contact phone required"),
    relationship: z.string().min(2, "Relationship required"),
  }),
  specialRequests: z.string().optional(),

  // Step 4: Trip Extras
  addOns: z.array(z.object({
    id: z.string(),
    quantity: z.number(),
  })).optional(),
  insuranceRequired: z.boolean().default(false),
  insuranceDetails: z.string().optional(),

  // Step 5: Payment
  paymentType: z.enum(["FULL_PAYMENT", "DEPOSIT"]),
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
  const [departures, setDepartures] = useState<TourDeparture[]>([]);
  const [roomOptions, setRoomOptions] = useState<RoomOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch departures and room options
    const fetchData = async () => {
      try {
        const [depsResponse, roomsResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/departures/tour/${tour.id}`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/room-options/tour/${tour.id}`),
        ]);
        
        if (depsResponse.ok) {
          const depsData = await depsResponse.json();
          setDepartures(depsData);
        }
        
        if (roomsResponse.ok) {
          const roomsData = await roomsResponse.json();
          setRoomOptions(roomsData);
        }
      } catch (error) {
        console.error("Failed to fetch booking data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [tour.id]);

  const methods = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    mode: "onChange",
    defaultValues: {
      numberOfTravelers: 1,
      departureId: "",
      roomOptionId: "",
      travelers: [{
        title: "",
        firstName: "",
        middleName: "",
        lastName: "",
        dateOfBirth: "",
        email: "",
        phone: "",
        nationality: "",
        passportNo: "",
        address: "",
        isLeadGuest: true,
      }],
      emergencyContact: {
        name: "",
        phone: "",
        relationship: "",
      },
      specialRequests: "",
      addOns: [],
      insuranceRequired: false,
      paymentType: "FULL_PAYMENT",
      agreeTerms: undefined as any,
      readGuidelines: undefined as any,
      updatesConsent: false,
    },
  });

  const { handleSubmit, trigger } = methods;

  const steps = [
    { id: 1, label: "Select date" },
    { id: 2, label: "Room configuration" },
    { id: 3, label: "Traveller details" },
    { id: 4, label: "Trip extras" },
    { id: 5, label: "Payment" },
  ];

  const nextStep = async () => {
    let isValid = false;
    if (currentStep === 1) {
      isValid = await trigger(["departureId", "numberOfTravelers"]);
    } else if (currentStep === 2) {
      isValid = await trigger(["roomOptionId"]);
    } else if (currentStep === 3) {
      isValid = await trigger(["travelers", "emergencyContact"]);
    } else if (currentStep === 4) {
      isValid = true; // Trip extras are optional
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
    try {
      // Submit booking to backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourId: tour.id,
          ...data,
        }),
      });

      if (response.ok) {
        alert("Booking submitted successfully!");
        // Redirect to confirmation page or dashboard
      } else {
        alert("Failed to submit booking. Please try again.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-zinc-600">Loading booking options...</p>
        </div>
      </div>
    );
  }

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
              {currentStep === 1 && (
                <DateSelectionStep 
                  onNext={nextStep} 
                  departures={departures}
                  tour={tour}
                />
              )}
              {currentStep === 2 && (
                <RoomConfigurationStep 
                  onNext={nextStep} 
                  onBack={prevStep}
                  roomOptions={roomOptions}
                />
              )}
              {currentStep === 3 && (
                <TravellerDetailsStep 
                  onNext={nextStep} 
                  onBack={prevStep}
                />
              )}
              {currentStep === 4 && (
                <TripExtrasStep 
                  onNext={nextStep} 
                  onBack={prevStep}
                  tour={tour}
                />
              )}
              {currentStep === 5 && (
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
