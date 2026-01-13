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
  Globe,
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
import { getDestinations, deleteDestination, Destination } from "@/lib/api";
import { toast } from "sonner";

export default function DestinationsAdminPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDestinations = async () => {
    setIsLoading(true);
    try {
      const data = await getDestinations();
      setDestinations(data);
    } catch (err) {
      toast.error("Failed to load destinations");
      setDestinations([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this destination?")) return;
    try {
      await deleteDestination(id);
      toast.success("Destination deleted successfully");
      setDestinations((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      toast.error("Failed to delete destination");
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
            Destinations Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage continents, countries, and regions.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/destinations/create">
            <Plus className="mr-2 h-5 w-5" /> Create New Destination
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search destinations..."
              className="pl-9 bg-background border-none shadow-none ring-0 focus-visible:ring-1"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {destinations.map((dest) => (
            <Card
              key={dest.id}
              className="group overflow-hidden border-none shadow-premium hover:shadow-premium-hover transition-all duration-300 bg-white dark:bg-zinc-950"
            >
              <div className="h-2 bg-primary/10 group-hover:bg-primary transition-colors" />
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge
                    variant={dest.isTop ? "default" : "secondary"}
                    className="mb-2"
                  >
                    {dest.isTop ? "Top Destination" : "Regular"}
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
                          href={`/admin/destinations/${dest.id}`}
                          className="flex items-center"
                        >
                          <Edit3 className="mr-2 h-4 w-4" /> Edit Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(dest.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="text-xl line-clamp-1">
                  {dest.name}
                </CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <Globe className="h-3 w-3" /> /{dest.slug}
                </CardDescription>
              </CardHeader>
              <CardContent className="py-4">
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4 h-[60px]">
                  {dest.description || "No description provided."}
                </p>
                <Separator className="my-4 op-50" />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">
                    {dest.subDestinations?.length || 0} Sub-destinations
                  </span>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 group-hover:text-primary transition-colors"
                  >
                    <Link href={`/en/destinations/${dest.slug}`}>
                      View Site <ExternalLink className="ml-1.5 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {destinations.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-muted-foreground bg-zinc-50/50 dark:bg-zinc-900/50 rounded-3xl border-2 border-dashed">
              <Globe className="h-16 w-16 mb-4 opacity-10" />
              <p className="text-lg font-medium">No destinations found.</p>
              <Button asChild variant="link">
                <Link href="/admin/destinations/create">
                  Create your first destination
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
