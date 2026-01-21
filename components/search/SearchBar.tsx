"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, MapPin, Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [keyword, setKeyword] = React.useState(
    searchParams.get("keyword") || "",
  );
  const [dateFrom, setDateFrom] = React.useState(
    searchParams.get("date_range_from") || "",
  );
  const [dateTo, setDateTo] = React.useState(
    searchParams.get("date_range_to") || "",
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (keyword) params.set("keyword", keyword);
    else params.delete("keyword");

    if (dateFrom) params.set("date_range_from", dateFrom);
    else params.delete("date_range_from");

    if (dateTo) params.set("date_range_to", dateTo);
    else params.delete("date_range_to");

    params.set("page", "1"); // Reset to page 1 on search
    router.push(`?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="flex flex-col md:flex-row items-center bg-white rounded-full shadow-md border p-1 pr-1 pl-4 md:pl-6 gap-2">
        <div className="flex-1 flex items-center gap-3 py-2 w-full">
          <MapPin className="w-5 h-5 text-zinc-400 shrink-0" />
          <input
            type="text"
            placeholder="Where to?"
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-semibold placeholder:text-zinc-400 outline-none"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        <div className="hidden md:block w-px h-8 bg-zinc-200" />

        <div className="flex-1 flex items-center gap-3 py-2 w-full">
          <CalendarIcon className="w-5 h-5 text-zinc-400 shrink-0" />
          <div className="flex items-center gap-2 text-sm font-semibold flex-1">
            <input
              type="text"
              placeholder="Start date"
              className="w-full bg-transparent border-none focus:ring-0 placeholder:text-zinc-400 outline-none"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
            <span className="text-zinc-300">—</span>
            <input
              type="text"
              placeholder="End date"
              className="w-full bg-transparent border-none focus:ring-0 placeholder:text-zinc-400 outline-none"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="rounded-full bg-red-600 hover:bg-red-700 h-10 px-8 text-sm font-bold transition-colors w-full md:w-auto"
        >
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>
    </form>
  );
}
