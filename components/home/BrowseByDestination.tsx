"use client";

import { useEffect, useState } from "react";
import { Destination, getDestinations } from "@/lib/api";
import { Loader2, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCurrency } from "@/context/CurrencyContext";
import { motion } from "framer-motion";

export default function BrowseByDestination() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const { localizeLink } = useCurrency();

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await getDestinations();
        setDestinations(data.filter((d) => d.isTop).slice(0, 8));
      } catch (error) {
        console.error("Failed to fetch destinations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  if (loading) return null;

  return (
    <section className="py-16 md:py-24 bg-[#FCFBF8]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2D2424]">
            Browse by destination
          </h2>
          <Link href={localizeLink("/destinations")}>
            <span className="text-zinc-900 font-bold border-b-2 border-zinc-900 pb-1 hover:text-primary hover:border-primary transition-colors">
              See all destinations
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {destinations.map((dest, index) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={localizeLink(`/destinations/${dest.slug}`)}
                className="group block text-center"
              >
                <div className="relative aspect-square rounded-full overflow-hidden mb-4 shadow-md border-4 border-white mx-auto max-w-[200px]">
                  <Image
                    src={
                      dest.image ||
                      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600"
                    }
                    alt={dest.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <h3 className="text-lg font-bold text-[#2D2424] group-hover:text-primary transition-colors">
                  {dest.name}
                </h3>
              </Link>
            </motion.div>
          ))}

          {destinations.length === 0 &&
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square rounded-full bg-zinc-200 mb-4 max-w-[200px] mx-auto" />
                <div className="h-4 w-24 bg-zinc-200 mx-auto rounded" />
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
