"use client";

import { useEffect, useState } from "react";
import { Tour, searchTours } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Heart, Map as MapIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCurrency } from "@/context/CurrencyContext";

export default function DealsTable() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const { localizeLink, formatPrice } = useCurrency();

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const data = await searchTours({ isFeatured: "true", limit: 6 });
        setTours(data.tours);
      } catch (error) {
        console.error("Failed to fetch deals:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section className="py-16 md:py-24 max-w-7xl mx-auto px-6">
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2D2424]">
            Top Africa travel deals
          </h2>
          <p className="text-gray-600 mt-2">
            The best value safaris and adventures available right now.
          </p>
        </div>
        <Link href={localizeLink("/deals")}>
          <Button variant="outline" className="rounded-full">
            View all deals
          </Button>
        </Link>
      </div>

      <div className="border rounded-xl bg-white shadow-premium overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50">
            <TableRow>
              <TableHead className="w-[300px]">Destination</TableHead>
              <TableHead>Map</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Price From</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tours.map((tour) => (
              <TableRow
                key={tour.id}
                className="hover:bg-zinc-50/50 transition-colors"
              >
                <TableCell className="font-medium py-6">
                  <Link
                    href={localizeLink(`/tours/${tour.slug}`)}
                    className="hover:text-primary"
                  >
                    {tour.title}
                  </Link>
                  <p className="text-xs text-zinc-500 font-normal mt-1">
                    {tour.startLocation} to {tour.endLocation}
                  </p>
                </TableCell>
                <TableCell>
                  <div className="relative h-12 w-20 rounded-md overflow-hidden bg-zinc-100 border">
                    {tour.mapImage ? (
                      <Image
                        src={tour.mapImage}
                        alt="Map"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <MapIcon className="h-4 w-4 text-zinc-400" />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{tour.durationDays} days</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold text-lg">
                      {formatPrice(tour.priceFrom, tour.currency)}
                    </span>
                    {tour.discountPrice && (
                      <span className="text-xs text-zinc-400 line-through">
                        {formatPrice(tour.discountPrice, tour.currency)}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <Heart className="h-5 w-5" />
                    </Button>
                    <Link href={localizeLink(`/tours/${tour.slug}`)}>
                      <Button size="sm" className="rounded-full">
                        View Trip
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
