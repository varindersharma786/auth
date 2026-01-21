"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const DESTINATIONS = [
  "Africa",
  "Asia",
  "Australia & Oceania",
  "Central America",
  "Europe",
  "Middle East",
  "North America",
  "South America",
];
const STYLES = ["Basic", "Original", "Comfort", "Premium"];
const THEMES = [
  "Short breaks",
  "18 to 35s",
  "Cruises",
  "Cycling",
  "Expeditions",
  "Explorer",
  "Family",
  "Festival",
  "Food",
  "Independent",
  "Multi-active",
  "Overland",
  "Polar",
  "Sail",
  "Ski",
  "Walking & trekking",
  "Wildlife",
  "Winter Active",
  "Women's Expeditions",
];
const PHYSICAL_RATINGS = [1, 2, 3, 4, 5];

interface FilterState {
  regions: string[];
  styles: string[];
  themes: string[];
  physicalRatings: number[];
  isNew: boolean;
  isSale: boolean;
  minPrice: string;
  maxPrice: string;
  minDuration: string;
  maxDuration: string;
}

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = React.useState<FilterState>({
    regions: searchParams.get("regions")?.split(",") || [],
    styles: searchParams.get("styles")?.split(",") || [],
    themes: searchParams.get("themes")?.split(",") || [],
    physicalRatings:
      searchParams.get("physicalRatings")?.split(",").map(Number) || [],
    isNew: searchParams.get("isNew") === "true",
    isSale: searchParams.get("isSale") === "true",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    minDuration: searchParams.get("minDuration") || "",
    maxDuration: searchParams.get("maxDuration") || "",
  });

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length > 0) params.set(key, value.join(","));
        else params.delete(key);
      } else if (typeof value === "boolean") {
        if (value) params.set(key, "true");
        else params.delete(key);
      } else if (value) {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    });

    router.push(`?${params.toString()}`);
  };

  const handleCheckboxChange = (
    category: keyof FilterState,
    item: string | number,
  ) => {
    const current = filters[category] as (string | number)[];
    const next = current.includes(item as never)
      ? current.filter((i) => i !== item)
      : [...current, item];

    setFilters({ ...filters, [category]: next });
    updateFilters({ [category]: next });
  };

  const handleToggle = (key: keyof FilterState) => {
    const next = !filters[key];
    setFilters({ ...filters, [key]: next });
    updateFilters({ [key]: next });
  };

  const handleInputChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const applyRangeFilters = () => {
    updateFilters({
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      minDuration: filters.minDuration,
      maxDuration: filters.maxDuration,
    });
  };

  return (
    <div className="space-y-4">
      <Accordion
        type="multiple"
        defaultValue={[
          "destinations",
          "duration",
          "price",
          "deals",
          "rating",
          "styles",
          "themes",
        ]}
      >
        {/* Destinations */}
        <AccordionItem value="destinations">
          <AccordionTrigger className="text-sm font-semibold">
            Destinations
          </AccordionTrigger>
          <AccordionContent className="space-y-2">
            {DESTINATIONS.map((region) => (
              <div key={region} className="flex items-center space-x-2">
                <Checkbox
                  id={`region-${region}`}
                  checked={filters.regions.includes(region)}
                  onCheckedChange={() =>
                    handleCheckboxChange("regions", region)
                  }
                />
                <Label
                  htmlFor={`region-${region}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {region}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Duration */}
        <AccordionItem value="duration">
          <AccordionTrigger className="text-sm font-semibold">
            Duration
          </AccordionTrigger>
          <AccordionContent className="space-y-2">
            <div className="flex gap-2 items-center">
              <Input
                placeholder="Min"
                type="number"
                value={filters.minDuration}
                onChange={(e) =>
                  handleInputChange("minDuration", e.target.value)
                }
              />
              <span className="text-zinc-500">to</span>
              <Input
                placeholder="Max"
                type="number"
                value={filters.maxDuration}
                onChange={(e) =>
                  handleInputChange("maxDuration", e.target.value)
                }
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={applyRangeFilters}
            >
              Apply
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* Price */}
        <AccordionItem value="price">
          <AccordionTrigger className="text-sm font-semibold">
            Price
          </AccordionTrigger>
          <AccordionContent className="space-y-2">
            <div className="flex gap-2 items-center">
              <span className="text-zinc-500">$</span>
              <Input
                placeholder="Min"
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleInputChange("minPrice", e.target.value)}
              />
              <span className="text-zinc-500">to</span>
              <span className="text-zinc-500">$</span>
              <Input
                placeholder="Max"
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleInputChange("maxPrice", e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={applyRangeFilters}
            >
              Apply
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* Travel Deals */}
        <AccordionItem value="deals">
          <AccordionTrigger className="text-sm font-semibold">
            Travel deals
          </AccordionTrigger>
          <AccordionContent className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sale"
                checked={filters.isSale}
                onCheckedChange={() => handleToggle("isSale")}
              />
              <Label
                htmlFor="sale"
                className="text-sm font-normal cursor-pointer"
              >
                Trips on sale
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="new"
                checked={filters.isNew}
                onCheckedChange={() => handleToggle("isNew")}
              />
              <Label
                htmlFor="new"
                className="text-sm font-normal cursor-pointer"
              >
                New trips
              </Label>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Physical Rating */}
        <AccordionItem value="rating">
          <AccordionTrigger className="text-sm font-semibold">
            Physical rating
          </AccordionTrigger>
          <AccordionContent className="space-y-2">
            {PHYSICAL_RATINGS.map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={filters.physicalRatings.includes(rating)}
                  onCheckedChange={() =>
                    handleCheckboxChange("physicalRatings", rating)
                  }
                />
                <Label
                  htmlFor={`rating-${rating}`}
                  className="text-sm font-normal cursor-pointer flex gap-0.5"
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 w-3 rounded-full ${
                        i < rating ? "bg-black" : "bg-zinc-200"
                      }`}
                    />
                  ))}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Styles */}
        <AccordionItem value="styles">
          <AccordionTrigger className="text-sm font-semibold">
            Styles
          </AccordionTrigger>
          <AccordionContent className="space-y-2">
            {STYLES.map((style) => (
              <div key={style} className="flex items-center space-x-2">
                <Checkbox
                  id={`style-${style}`}
                  checked={filters.styles.includes(style.toUpperCase())}
                  onCheckedChange={() =>
                    handleCheckboxChange("styles", style.toUpperCase())
                  }
                />
                <Label
                  htmlFor={`style-${style}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {style}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Themes */}
        <AccordionItem value="themes">
          <AccordionTrigger className="text-sm font-semibold">
            Themes
          </AccordionTrigger>
          <AccordionContent className="space-y-2">
            {THEMES.map((theme) => (
              <div key={theme} className="flex items-center space-x-2">
                <Checkbox
                  id={`theme-${theme}`}
                  checked={filters.themes.includes(theme)}
                  onCheckedChange={() => handleCheckboxChange("themes", theme)}
                />
                <Label
                  htmlFor={`theme-${theme}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {theme}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
