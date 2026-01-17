"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function PurposeSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative h-[500px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1484062391240-5197b88a05ef?auto=format&fit=crop&q=80&w=2000"
            alt="Local community"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 md:p-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-3xl"
            >
              <span className="text-white/80 font-bold uppercase tracking-[0.2em] mb-6 block drop-shadow-md">
                Our Purpose
              </span>
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-8 drop-shadow-xl leading-tight">
                We&apos;re here to do good by creating positive impact through
                the joy of travel.
              </h2>
              <Button className="bg-white text-zinc-900 hover:bg-zinc-100 rounded-full px-10 py-6 text-lg font-bold shadow-xl">
                Learn more about our impact
              </Button>
            </motion.div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-emerald-600">B</span>
            </div>
            <h4 className="font-bold text-lg mb-2">Certified B Corp</h4>
            <p className="text-zinc-500 text-sm">
              Meeting the highest standards of social and environmental
              performance.
            </p>
          </div>
          <div>
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-blue-600">🌍</span>
            </div>
            <h4 className="font-bold text-lg mb-2">Carbon Neutral</h4>
            <p className="text-zinc-500 text-sm">
              Measuring and offsetting the carbon footprint of all our trips.
            </p>
          </div>
          <div>
            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-amber-600">🤝</span>
            </div>
            <h4 className="font-bold text-lg mb-2">Locally Led</h4>
            <p className="text-zinc-500 text-sm">
              Supporting local economies and providing authentic experiences.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
