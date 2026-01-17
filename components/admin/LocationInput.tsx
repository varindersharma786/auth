"use client";

import { useState, useMemo } from "react";
import { MapPin, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { locations, LocationInfo } from "@/lib/location-data";

interface LocationInputProps {
  value: string;
  onChange: (value: string, region?: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function LocationInput({
  value,
  onChange,
  placeholder = "Search for a city...",
  className,
  disabled,
}: LocationInputProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLocations = useMemo(() => {
    if (searchQuery.trim() === "") return [];

    return locations.filter(
      (loc) =>
        loc.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.country.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSelect = (loc: LocationInfo) => {
    const displayValue = `${loc.city}, ${loc.country}`;
    onChange(displayValue, loc.region);
    setOpen(false);
    setSearchQuery("");
  };

  return (
    <div className={cn("relative w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative cursor-pointer">
            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9 cursor-pointer"
              placeholder={placeholder}
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                setSearchQuery(e.target.value);
                if (!open) setOpen(true);
              }}
              disabled={disabled}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-(--radix-popover-trigger-width) p-0"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="max-h-[300px] overflow-y-auto p-1">
            {filteredLocations.length > 0 ? (
              filteredLocations.map((loc) => (
                <button
                  key={`${loc.city}-${loc.country}`}
                  className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
                  onClick={() => handleSelect(loc)}
                >
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-medium">{loc.city}</span>
                    <span className="text-xs text-muted-foreground">
                      {loc.country} ({loc.region})
                    </span>
                  </div>
                </button>
              ))
            ) : searchQuery.length > 0 ? (
              <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-20" />
                No matching locations found.
              </div>
            ) : (
              <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-20" />
                Start typing to see suggestions...
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
