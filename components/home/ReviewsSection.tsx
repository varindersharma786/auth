"use client";

import { Star, CheckCircle2, ThumbsUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function ReviewsSection() {
  // Static for now, can be connected to dynamic aggregate later
  const ratings = [
    { stars: 5, count: 420 },
    { stars: 4, count: 56 },
    { stars: 3, count: 12 },
    { stars: 2, count: 4 },
    { stars: 1, count: 2 },
  ];

  const total = 494;
  const average = 4.8;

  return (
    <section className="py-16 md:py-24 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2D2424] mb-12">
          Customer reviews
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Summary */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="text-6xl font-serif font-bold text-[#2D2424]">
                {average}
              </span>
              <div className="space-y-1">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-current" />
                  ))}
                </div>
                <p className="text-zinc-500 font-medium">
                  Based on {total} reviews
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {ratings.map((rating) => (
                <div
                  key={rating.stars}
                  className="flex items-center gap-4 group"
                >
                  <span className="w-12 text-sm font-bold text-zinc-600 underline">
                    {rating.stars} stars
                  </span>
                  <Progress
                    value={(rating.count / total) * 100}
                    className="h-2 rounded-full bg-zinc-200"
                    indicatorClassName="bg-zinc-900 group-hover:bg-primary transition-colors"
                  />
                  <span className="w-12 text-sm text-zinc-400 text-right">
                    {rating.count}
                  </span>
                </div>
              ))}
            </div>

            <Button className="w-full py-6 rounded-full font-bold text-lg shadow-lg">
              Write a review
            </Button>
          </div>

          {/* Individual Reviews */}
          <div className="lg:col-span-2 space-y-8">
            <ReviewItem
              name="Sarah Jenkins"
              date="December 2025"
              rating={5}
              title="Life-changing experience in the Serengeti!"
              content="Absolutely incredible trip from start to finish. Our guide was extremely knowledgeable and always found the best spots for wildlife viewing. The small group size made everything feel personal and exclusive."
              verified={true}
            />
            <ReviewItem
              name="Michael Chen"
              date="November 2025"
              rating={5}
              title="Exceeded all expectations"
              content="I've traveled a lot but this was something else. The logistics were handled perfectly, allowing us to just enjoy the magic of Africa. Highly recommend the Masai Mara extension."
              verified={true}
            />
            <div className="pt-4">
              <Button
                variant="outline"
                className="rounded-full px-8 py-5 font-bold border-zinc-300"
              >
                Check out more reviews
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ReviewItem({ name, date, rating, title, content, verified }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="p-8 rounded-2xl bg-white shadow-sm border border-zinc-100"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-1">
          <div className="flex text-amber-400 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < rating ? "fill-current" : "text-zinc-200"}`}
              />
            ))}
          </div>
          <h4 className="font-bold text-zinc-900">{title}</h4>
        </div>
        {verified && (
          <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-bold uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-full">
            <CheckCircle2 className="h-3 w-3" />
            Verified traveler
          </div>
        )}
      </div>

      <p className="text-zinc-600 mb-6 leading-relaxed italic">
        &ldquo;{content}&rdquo;
      </p>

      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-zinc-400 uppercase">
            {name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-zinc-900">{name}</p>
            <p className="text-zinc-500 text-xs">{date}</p>
          </div>
        </div>
        <button className="flex items-center gap-2 text-zinc-400 hover:text-primary transition-colors">
          <ThumbsUp className="h-4 w-4" />
          <span className="text-xs font-bold">Helpful</span>
        </button>
      </div>
    </motion.div>
  );
}
