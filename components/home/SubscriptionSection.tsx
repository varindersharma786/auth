"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";

export default function SubscriptionSection() {
  return (
    <section className="py-24 md:py-32 px-6 bg-[#2D2424] text-white">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">
            Get 10% off your first trip
          </h2>
          <p className="text-zinc-400 text-lg mb-12 max-w-2xl mx-auto font-medium">
            Subscribe for exclusive travel deals, remarkable stories and
            inspired itinerary ideas.
          </p>

          <form className="space-y-8 bg-zinc-800/10 p-8 md:p-12 rounded-3xl border border-white/10 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                placeholder="First Name"
                className="h-16 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-zinc-500 px-6 focus:border-primary transition-all shadow-inner"
              />
              <Input
                placeholder="Email address"
                className="h-16 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-zinc-500 px-6 focus:border-primary transition-all shadow-inner"
              />
            </div>

            <div className="flex items-center space-x-3 text-left justify-center">
              <Checkbox
                id="terms"
                className="border-white/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <label
                htmlFor="terms"
                className="text-xs text-zinc-500 font-medium leading-relaxed"
              >
                I am over 18 and I have read and agree to the{" "}
                <span className="underline cursor-pointer hover:text-white">
                  Privacy Policy
                </span>{" "}
                and{" "}
                <span className="underline cursor-pointer hover:text-white">
                  Terms of Use
                </span>
                .
              </label>
            </div>

            <Button className="h-16 px-16 bg-primary hover:bg-primary/90 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all w-full md:w-auto">
              Subscribe Now
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
