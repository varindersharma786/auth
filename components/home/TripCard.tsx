"use client";

import { Tour, toggleWishlist, getWishlist } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Clock, Heart, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCurrency } from "@/context/CurrencyContext";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";

interface TripCardProps {
  trip: Tour;
}

export default function TripCard({ trip }: TripCardProps) {
  const { localizeLink, formatPrice } = useCurrency();
  const { data: session } = authClient.useSession();
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (session) {
      // Check if this tour is in user's wishlist
      getWishlist().then((list) => {
        setIsWishlisted(list.some((t) => t.id === trip.id));
      });
    }
  }, [session, trip.id]);

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error("Please login to use wishlist");
      return;
    }

    try {
      const action = isWishlisted ? "remove" : "add";
      await toggleWishlist(trip.id, action);
      setIsWishlisted(!isWishlisted);
      toast.success(
        isWishlisted ? "Removed from wishlist" : "Added to wishlist"
      );
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="group h-full overflow-hidden border-none shadow-premium hover:shadow-2xl transition-all duration-500 rounded-2xl bg-white flex flex-col">
        {/* Map Header */}
        <div className="relative aspect-video overflow-hidden bg-zinc-100 border-b">
          {trip.mapImage ? (
            <Image
              src={trip.mapImage}
              alt="Route Map"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-zinc-200">
              <span className="text-zinc-400 text-sm font-medium">
                Route Map
              </span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {trip.isNew && (
              <Badge className="bg-emerald-500 hover:bg-emerald-600 border-none px-3 py-1 font-bold text-[10px] uppercase tracking-wider">
                New
              </Badge>
            )}
            {trip.isSale && (
              <Badge className="bg-amber-500 hover:bg-amber-600 border-none px-3 py-1 font-bold text-[10px] uppercase tracking-wider">
                Sale
              </Badge>
            )}
          </div>

          <button
            onClick={handleWishlist}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-300 shadow-sm border ${
              isWishlisted
                ? "bg-red-500 text-white opacity-100"
                : "bg-white/80 opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 hover:bg-red-50"
            }`}
          >
            <Heart
              className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`}
            />
          </button>
        </div>

        <CardContent className="p-6 flex flex-col flex-1">
          {/* Style & Theme Tags */}
          <div className="flex gap-2 mb-3">
            <span className="text-[10px] uppercase tracking-[0.1em] font-bold text-primary px-2 py-0.5 rounded-full bg-primary/5">
              {trip.style}
            </span>
            <span className="text-[10px] uppercase tracking-[0.1em] font-bold text-zinc-400">
              {trip.theme}
            </span>
          </div>

          <h3 className="font-serif font-bold text-xl mb-3 line-clamp-2 min-h-14 group-hover:text-primary transition-colors">
            {trip.title}
          </h3>

          <div className="flex items-center gap-4 mb-6 text-sm text-zinc-500">
            <div className="flex items-center gap-1.5 font-medium">
              <Clock className="h-4 w-4 text-zinc-400" />
              {trip.durationDays} days
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
              <span className="font-bold text-zinc-700">4.9</span>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t flex justify-between items-end">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block mb-1">
                From
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-zinc-900">
                  {formatPrice(trip.priceFrom, trip.currency)}
                </span>
                {trip.discountPrice && (
                  <span className="text-sm text-zinc-400 line-through">
                    {formatPrice(trip.discountPrice, trip.currency)}
                  </span>
                )}
              </div>
            </div>

            <Link href={localizeLink(`/tours/slug/${trip.slug}`)}>
              <Button
                variant="ghost"
                className="rounded-full group/btn pr-0 hover:bg-transparent text-primary font-bold"
              >
                Details{" "}
                <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
