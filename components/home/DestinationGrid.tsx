"use client";

import Image from "next/image";
import Link from "next/link";

const destinations = [
  { name: "Vietnam", image: "/images/home/vietnam.png" },
  { name: "Kenya", image: "/images/home/kenya.png" },
  { name: "Italy", image: "/images/home/hero-2.png" },
  { name: "Morocco", image: "/images/home/hero-1.png" },
  { name: "Japan", image: "/images/home/vietnam.png" },
  { name: "Peru", image: "/images/home/promo-bg.png" },
  { name: "Greece", image: "/images/home/hero-2.png" },
];

export default function DestinationGrid() {
  return (
    <section className="py-24 px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <h2 className="text-4xl font-bold">Popular destinations</h2>
        <Link
          href="/shop"
          className="text-red-600 font-bold border-b-2 border-red-600 pb-1 hover:text-red-700"
        >
          View all destinations
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {destinations.map((d, i) => (
          <Link
            key={i}
            href="/shop"
            className="group relative aspect-square rounded-xl overflow-hidden"
          >
            <Image
              src={d.image}
              alt={d.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
            <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-center p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {d.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
