"use client";

import { useState } from "react";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SearchSection() {
  return (
    <div className="relative -mt-16 z-10 mx-auto max-w-6xl px-4">
      <div className="bg-white rounded-xl shadow-2xl p-4 md:p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Where to?"
            className="pl-10 h-14 border-gray-200 focus:ring-red-500 rounded-lg text-lg"
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="When?"
            className="pl-10 h-14 border-gray-200 focus:ring-red-500 rounded-lg text-lg"
          />
        </div>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Who?"
            className="pl-10 h-14 border-gray-200 focus:ring-red-500 rounded-lg text-lg"
          />
        </div>
        <Button className="h-14 bg-red-600 hover:bg-red-700 text-white rounded-lg text-lg font-semibold shadow-lg shadow-red-200">
          Search
        </Button>
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 italic">
          Real and remarkable small group trips worldwide.
        </h2>
        <div className="flex flex-wrap justify-center gap-12 mt-10">
          <Stat name="100s of experiences" value="Over 100 countries" />
          <Stat
            name="Small group sizes"
            value="Travel with like-minded people"
          />
          <Stat name="Creating positive change" value="Since 1989" />
        </div>
      </div>
    </div>
  );
}

function Stat({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">
        {name}
      </span>
      <span className="text-lg font-semibold text-gray-800">{value}</span>
    </div>
  );
}
