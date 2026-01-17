"use client";

import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
      {/* Background Image Placeholder */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=2000')`,
          filter: "brightness(0.85)",
        }}
      />

      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/40" />

      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-7xl font-serif font-bold text-white drop-shadow-2xl"
        >
          Africa Tours & Holidays
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mt-4 text-lg md:text-2xl text-white/90 font-light max-w-3xl"
        >
          Extraordinary small group adventures across the continent
        </motion.p>
      </div>
    </section>
  );
}
