"use client";

import { motion } from "framer-motion";

export default function IntroSection() {
  return (
    <section className="py-16 md:py-24 bg-[#FCFBF8]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-serif text-[#2D2424] leading-relaxed italic mb-8">
            &ldquo;We guide you further into the heart of Africa. From the
            sweeping savannas of the Serengeti to the misty peaks of the
            Rwenzori, our small group trips are designed to connect you deeply
            with the wildlife, people, and landscapes of this remarkable
            continent.&rdquo;
          </h2>
          <div className="w-24 h-1 bg-primary/20 mx-auto" />
        </motion.div>
      </div>
    </section>
  );
}
