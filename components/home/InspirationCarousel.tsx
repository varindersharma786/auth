"use client";

import { useEffect, useState } from "react";
import { Article, getArticles } from "@/lib/api";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCurrency } from "@/context/CurrencyContext";
import { motion } from "framer-motion";

export default function InspirationCarousel() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { localizeLink } = useCurrency();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getArticles("INSPIRATION");
        setArticles(data);
      } catch (error) {
        console.error("Failed to fetch inspiration:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  if (loading) return null;

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2D2424]">
              Get inspired on the Road ahead
            </h2>
            <p className="text-zinc-500 mt-2">
              Stories, tips, and insights from our community of travelers.
            </p>
          </div>
          <Link href={localizeLink("/blog")} className="hidden md:block">
            <span className="text-primary font-bold border-b-2 border-primary pb-1">
              Read all stories
            </span>
          </Link>
        </div>

        <ScrollArea className="w-full whitespace-nowrap pb-6">
          <div className="flex gap-6">
            {articles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="inline-block w-[300px] shrink-0"
              >
                <Link
                  href={localizeLink(`/articles/slug/${article.slug}`)}
                  className="group"
                >
                  <div className="relative aspect-4/5 rounded-2xl overflow-hidden mb-4 shadow-md">
                    <Image
                      src={
                        article.image ||
                        "https://images.unsplash.com/photo-1547970810-dc1eac37d174?auto=format&fit=crop&q=80&w=800"
                      }
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-white/70 block mb-2">
                        {article.category}
                      </span>
                      <h3 className="text-xl font-bold text-white whitespace-normal line-clamp-2 leading-snug">
                        {article.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}

            {/* Mock items if no articles found */}
            {articles.length === 0 &&
              [1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="inline-block w-[300px] shrink-0">
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 bg-zinc-100 border flex items-center justify-center">
                    <span className="text-zinc-400 font-medium">
                      Coming Soon
                    </span>
                  </div>
                </div>
              ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </section>
  );
}
