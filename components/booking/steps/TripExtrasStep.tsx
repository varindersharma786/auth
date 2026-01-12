import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { BookingFormValues } from "../BookingClient";
import { Info, Luggage } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface TripExtrasStepProps {
  onNext: () => void;
  onBack: () => void;
}

export const TripExtrasStep = ({ onNext, onBack }: TripExtrasStepProps) => {
  const { register, setValue } = useFormContext<BookingFormValues>();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
      {/* Info Banner Same as Step 1 */}
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
      </div>

      <div className="space-y-6">
        {/* Room Options */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 space-y-6">
          <h3 className="font-bold text-lg">Room options</h3>
          <p className="text-sm text-muted-foreground">
            Want to change your room?
          </p>
          <p className="text-sm text-muted-foreground">
            Individual rooms are subject to availability. We&apos;ll be in touch
            in 2-4 business days with an update.
          </p>
          <p className="text-sm font-medium mt-4">Select only 1 option</p>

          <div className="space-y-4 pt-2">
            <label className="flex items-start gap-3 cursor-pointer p-3 border rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
              <input
                type="radio"
                value="single"
                {...register("roomOption")}
                className="mt-1"
              />
              <div>
                <span className="font-medium">Individual room</span>{" "}
                <span className="text-muted-foreground text-sm">
                  (+USD $290.00 per person)
                </span>
              </div>
            </label>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  onCheckedChange={(checked) =>
                    setValue("shareWithFriend", checked as boolean)
                  }
                />
                <span className="font-medium text-sm">
                  Share with a friend on another booking{" "}
                  <span className="text-muted-foreground font-normal">
                    (No additional cost)
                  </span>
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Pre & Post Trip Extras */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 space-y-6">
          <h3 className="font-bold text-lg">Pre & post-trip extras</h3>

          <div className="space-y-4">
            <h4 className="font-bold flex items-center gap-2">
              <Luggage className="w-4 h-4" /> Transfers
            </h4>

            <div className="border rounded-md p-4 flex justify-between items-center bg-white dark:bg-zinc-900">
              <span className="text-sm font-medium">Add transfers</span>
            </div>
            <div className="border rounded-md p-4 flex justify-between items-center bg-white dark:bg-zinc-900">
              <span className="text-sm font-medium">Add extra nights</span>
            </div>
          </div>
        </div>

        {/* Donation */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 space-y-6">
          <h3 className="font-bold text-lg">
            Would you like to support the communities we visit?
          </h3>
          <p className="text-sm text-muted-foreground">
            Donate 1% of your trip cost to the Intrepid Foundation to support
            life changing projects empowering local people.
          </p>
          <label className="flex items-center gap-3 cursor-pointer">
            <Checkbox />
            <span className="text-sm font-medium">
              Yes, add USD $43.00 to help local communities
            </span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
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
