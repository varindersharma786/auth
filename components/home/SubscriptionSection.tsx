"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export default function SubscriptionSection() {
  return (
    <section className="py-24 px-4 bg-zinc-50">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">
          Subscribe for travel deals and inspiration
        </h2>
        <form className="mt-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Email"
              className="h-14 rounded-lg bg-white border-none shadow-sm"
            />
            <Input
              placeholder="Country"
              className="h-14 rounded-lg bg-white border-none shadow-sm"
            />
          </div>
          <div className="flex items-center space-x-2 text-left justify-center">
            <Checkbox id="terms" />
            <label
              htmlFor="terms"
              className="text-sm text-gray-500 font-medium"
            >
              I agree to the privacy policy and terms of service.
            </label>
          </div>
          <Button className="h-14 px-12 bg-black hover:bg-zinc-800 text-white rounded-full font-bold text-lg">
            Let&apos;s stay in touch
          </Button>
        </form>
      </div>
    </section>
  );
}
