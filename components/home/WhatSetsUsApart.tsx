"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function WhatSetsUsApart() {
  return (
    <section className="py-24 px-4 bg-[#f8f6f2]">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <h2 className="text-4xl font-bold mb-20">What sets us apart</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h3 className="text-3xl font-bold">
              We're all about sharing the joy of travel
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
              From our first overland trip back in 1989, we've always been about
              real-life experiences. Our small group style means you'll stay
              under the radar, travel the local way, eat with the local people
              and sleep in local homes.
            </p>
            <Button
              variant="link"
              className="text-red-600 p-0 font-bold text-lg h-auto border-b-2 border-red-600 rounded-none pb-1 hover:no-underline"
            >
              Find out about us
            </Button>
          </div>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-premium">
            <Image
              src="/images/home/hero-1.png"
              alt="Joy of travel"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
