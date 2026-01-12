"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  MoreVertical,
  MapPin,
  Clock,
  Trash2,
  Edit3,
  ExternalLink,
  Map,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getTours, deleteTour, Tour } from "@/lib/api";
import { toast } from "sonner";

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTours = async () => {
    setIsLoading(true);
    try {
      const data = await getTours();
      setTours(data);
    } catch (err) {
      toast.error("Failed to load tours");
      setTours([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteTour(id);
      toast.success("Tour deleted successfully");
      // Optimistic update: remove from local state immediately
      setTours((prev) => prev.filter((tour) => tour.id !== id));
    } catch (err) {
      toast.error("Failed to delete tour");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Clock className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Tours Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your travel experiences and itineraries.
          </p>
        </div>
        <Button
          asChild
        >
          <Link href="/admin/tours/create-tour">
            <Plus className="mr-2 h-5 w-5" /> Create New Tour
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tours by name, location or code..."
              className="pl-9 bg-background border-none shadow-none ring-0 focus-visible:ring-1"
            />
          </div>
          <Button variant="outline" className="hidden sm:flex">
            Filter
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour) => (
            <Card
              key={tour.id}
              className="group overflow-hidden border-none shadow-premium hover:shadow-premium-hover transition-all duration-300 bg-white dark:bg-zinc-950"
            >
              <div className="h-2 bg-primary/10 group-hover:bg-primary transition-colors" />
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant="secondary" className="mb-2">
                    {tour.code}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/admin/tours/${tour.id}`}
                          className="flex items-center"
                        >
                          <Edit3 className="mr-2 h-4 w-4" /> Edit Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(tour.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Tour
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="text-xl line-clamp-1">
                  {tour.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {tour.startLocation} →{" "}
                  {tour.endLocation}
                </CardDescription>
              </CardHeader>
              <CardContent className="py-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground text-xs uppercase font-semibold">
                      Duration
                    </span>
                    <span className="flex items-center font-medium">
                      <Clock className="mr-1.5 h-3.5 w-3.5" />{" "}
                      {tour.durationDays} Days
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 text-right">
                    <span className="text-muted-foreground text-xs uppercase font-semibold">
                      Starting Price
                    </span>
                    <span className="font-bold text-primary">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: tour.currency,
                      }).format(tour.priceFrom)}
                    </span>
                  </div>
                </div>
                <Separator className="my-4 op-50" />
                <div className="flex items-center justify-between mt-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-7 w-7 rounded-full border-2 border-background bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center"
                      >
                        <span className="text-[10px] font-bold">{i}</span>
                      </div>
                    ))}
                    <div className="h-7 w-7 rounded-full border-2 border-background bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center translate-x-1">
                      <span className="text-[8px] font-bold">+5</span>
                    </div>
                  </div>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 group-hover:text-primary transition-colors"
                  >
                    <Link href={`/tours/${tour.slug}`}>
                      View Site <ExternalLink className="ml-1.5 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {tours.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-muted-foreground bg-zinc-50/50 dark:bg-zinc-900/50 rounded-3xl border-2 border-dashed">
              <Map className="h-16 w-16 mb-4 opacity-10" />
              <p className="text-lg font-medium">No tours found.</p>
              <Button asChild variant="link">
                <Link href="/admin/tours/create-tour">
                  Create your first tour
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}