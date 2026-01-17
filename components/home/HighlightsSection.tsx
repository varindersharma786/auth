"use client";

import { useEffect, useState } from "react";
import { Article, getArticles } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCurrency } from "@/context/CurrencyContext";
import { motion } from "framer-motion";

export default function HighlightsSection() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { localizeLink } = useCurrency();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getArticles("HIGHLIGHT");
        setArticles(data.slice(0, 2));
      } catch (error) {
        console.error("Failed to fetch highlights:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  if (loading) return null; // Or skeleton

  if (articles.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-white border-t">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2D2424] mb-12">
          Africa highlights
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {articles.map((article) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-16/10 overflow-hidden rounded-2xl mb-6 shadow-lg">
                <Image
                  src={
                    article.image ||
                    "https://images.unsplash.com/photo-1523805081326-78667e7831d3?auto=format&fit=crop&q=80&w=1200"
                  }
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
              </div>

              <h3 className="text-2xl font-serif font-bold text-[#2D2424] mb-4 group-hover:text-primary transition-colors">
                {article.title}
              </h3>
              <p className="text-zinc-600 line-clamp-3 mb-6 leading-relaxed">
                {article.subtitle || article.content.substring(0, 150) + "..."}
              </p>

              <Link href={localizeLink(`/articles/slug/${article.slug}`)}>
                <Button
                  variant="link"
                  className="p-0 h-auto font-bold text-primary group-hover:underline"
                >
                  Read more <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
