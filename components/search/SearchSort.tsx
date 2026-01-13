"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SearchSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "relevance";

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
        Sort by:
      </span>
      <Select value={currentSort} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[180px] h-8 text-sm font-semibold border-none shadow-none focus:ring-0">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="relevance">Relevance</SelectItem>
          <SelectItem value="price-asc">Price (Low to High)</SelectItem>
          <SelectItem value="price-desc">Price (High to Low)</SelectItem>
          <SelectItem value="duration-asc">
            Duration (Shortest first)
          </SelectItem>
          <SelectItem value="duration-desc">
            Duration (Longest first)
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
