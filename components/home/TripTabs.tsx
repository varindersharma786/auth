"use client";

import Image from "next/image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock } from "lucide-react";
import Link from "next/link";
import { useCurrency } from "@/context/CurrencyContext";

const categories = [
  "Only Intrepid adventures",
  "Best sellers",
  "Popular trips",
];

const trips = [
  {
    id: "1",
    title: "Vietnam: Ha Long Bay & Hanoi",
    image: "/images/home/vietnam.png",
    duration: "10 days",
    rating: 4.8,
    reviews: 124,
    price: 1200,
    category: "Only Intrepid adventures",
    badge: "Bestseller",
  },
  {
    id: "2",
    title: "Kenya: Great Migration Safari",
    image: "/images/home/kenya.png",
    duration: "8 days",
    rating: 4.9,
    reviews: 86,
    price: 2400,
    category: "Only Intrepid adventures",
    badge: "Exclusive",
  },
  // Add more mock trips as needed
];

export default function TripTabs() {
  const { exchangeRate, currencySymbol } = useCurrency();

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <Tabs defaultValue={categories[0]} className="w-full">
        <div className="flex justify-between items-end mb-8">
          <TabsList className="bg-transparent border-b rounded-none h-auto p-0 gap-8">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-red-600 data-[state=active]:bg-transparent text-lg font-bold pb-2 px-0 text-gray-400 data-[state=active]:text-black"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
          <Link
            href="/shop"
            className="text-red-600 font-bold border-b-2 border-red-600 pb-1 mb-2 hover:text-red-700"
          >
            View all tours
          </Link>
        </div>

        {categories.map((cat) => (
          <TabsContent
            key={cat}
            value={cat}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {trips
              .filter((t) => t.category === cat || cat === "Popular trips")
              .map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  exchangeRate={exchangeRate}
                  symbol={currencySymbol}
                />
              ))}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}

function TripCard({ trip, exchangeRate, symbol }: any) {
  const finalPrice = Math.round(trip.price * exchangeRate);

  return (
    <Card className="group overflow-hidden border-none shadow-none hover:shadow-xl transition-all duration-300 rounded-xl bg-zinc-50/50">
      <div className="relative aspect-4/3 overflow-hidden">
        <Image
          src={trip.image}
          alt={trip.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <Badge className="absolute top-3 left-3 bg-red-600 hover:bg-red-700 border-none px-3 py-1 font-bold">
          {trip.badge}
        </Badge>
      </div>
      <CardContent className="p-4 bg-white">
        <div className="flex items-center gap-1 text-xs font-bold text-gray-500 uppercase mb-2">
          <Clock className="h-3 w-3" />
          {trip.duration}
        </div>
        <h3 className="font-bold text-lg mb-2 line-clamp-2 min-h-14 group-hover:text-red-600 transition-colors">
          {trip.title}
        </h3>
        <div className="flex items-center gap-1 mb-4">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(trip.rating) ? "fill-current" : ""
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-bold text-gray-400">
            {trip.rating} ({trip.reviews})
          </span>
        </div>
        <div className="flex justify-between items-end border-t pt-4 mt-auto">
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase block mb-1">
              From
            </span>
            <span className="text-xl font-bold">
              {symbol}
              {finalPrice.toLocaleString()}
            </span>
          </div>
          <Link
            href={`/tours/${trip.id}`}
            className="text-sm font-bold text-red-600 hover:opacity-80"
          >
            View details
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
