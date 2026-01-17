"use client";

import { motion } from "framer-motion";
import { Article } from "@/lib/api";

interface IntroSectionProps {
  article?: Article;
  region?: string;
}

export default function IntroSection({ article, region }: IntroSectionProps) {
  const title = article?.title || `About ${region || "Our Destinations"}`;
  const content =
    article?.content ||
    `Discover incredible adventures and create unforgettable memories in ${region || "the world's most amazing destinations"}. Our expertly crafted tours offer authentic experiences, led by local guides who bring destinations to life.`;

  return (
    <section className="py-16 md:py-24 px-6 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center"
      >
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2D2424] mb-8">
          {title}
        </h2>
        <div className="prose prose-lg max-w-none text-zinc-700 leading-relaxed">
          {content.split("\n\n").map((paragraph, index) => (
            <p key={index} className="mb-6 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
