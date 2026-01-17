"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function PromoBanner() {
  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <div className="relative rounded-2xl overflow-hidden min-h-[500px] flex items-stretch">
        <div className="flex-1 bg-white p-12 md:p-24 flex flex-col justify-center gap-6 z-10">
          <Image
            src="/next.svg"
            alt="Intrepid"
            width={150}
            height={40}
            className="mb-4"
          />
          <h2 className="text-5xl md:text-7xl font-bold leading-tight">
            Go where the joy takes you
          </h2>
          <p className="text-xl text-gray-600 max-w-md italic">
            &quot;The world is a book and those who do not travel read only one
            page.&quot;
          </p>
          <Button className="w-fit bg-red-600 hover:bg-red-700 text-white font-bold py-6 px-10 rounded-full text-lg">
            Let&apos;s go
          </Button>
        </div>
        <div className="flex-1 relative hidden lg:block">
          <Image
            src="/images/home/promo-bg.png"
            alt="Promotion"
            fill
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-red-600 p-12 flex flex-col justify-center text-white h-full">
            <h3 className="text-6xl font-bold mb-4">Only Intrepid</h3>
            <Image
              src="/next.svg"
              alt="Icon"
              width={80}
              height={80}
              className="invert opacity-20 absolute top-10 right-10"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12 bg-zinc-50 p-8 rounded-2xl">
        <FeatureItem
          title="Small group expertise"
          desc="We've been doing this since 1989."
          icon="icon-stats"
        />
        <FeatureItem
          title="24/7 support"
          desc="We're here for you whenever you need."
          icon="icon-clock"
        />
        <FeatureItem
          title="Local leaders"
          desc="Get under the skin of every destination."
          icon="icon-globe"
        />
        <FeatureItem
          title="Carbon neutral"
          desc="Travel that gives back to the planet."
          icon="icon-leaf"
        />
      </div>
    </section>
  );
}

function FeatureItem({ title, desc, icon }: { title: string; desc: string; icon: string }) {
  return (
    <div className="flex gap-4">
      <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
        <div className="h-6 w-6 bg-red-600 rounded-sm"></div>
      </div>
      <div>
        <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
        <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
