"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Calendar,
  Map,
  DollarSign,
  Users,
  Check,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Package,
} from "lucide-react";

import ImageUpload from "@/components/admin/ImageUpload";
import LocationInput from "@/components/admin/LocationInput";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

import {
  createTour,
  updateTour,
  getTour,
  getDestinations,
  Destination,
} from "@/lib/api";

const tourSchema = z.object({
  code: z.string().min(1, "Code is required"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(1, "Slug is required"),
  startLocation: z.string().min(1, "Start location is required"),
  endLocation: z.string().min(1, "End location is required"),
  durationDays: z.number().min(1),
  minAge: z.number().nullable(),
  maxGroupSize: z.number().min(1),
  style: z.string().min(1, "Style is required"),
  theme: z.string().min(1, "Theme is required"),
  region: z.string().optional(),
  physicalRating: z.number().min(1).max(5).optional(),
  priceFrom: z.number().min(0),
  discountPrice: z.number().optional(),
  currency: z.string().min(1, "Currency is required"),
  promoTag: z.string().optional(),
  mealsIncluded: z.boolean(),
  transport: z.string().min(1, "Transport info is required"),
  depositAmount: z.number().optional(),
  depositPercentage: z.number().optional(),
  isFeatured: z.boolean().optional(),
  isNew: z.boolean().optional(),
  isSale: z.boolean().optional(),
  itinerary: z.array(
    z.object({
      day: z.number(),
      title: z.string().min(1, "Itinerary title is required"),
      details: z.string().min(1, "Itinerary details are required"),
    })
  ),
  highlight: z.array(
    z.object({
      label: z.string().min(1, "Highlight label is required"),
    })
  ),
  accommodation: z.array(
    z.object({
      type: z.string().min(1, "Type is required"),
      name: z.string().optional(),
      nights: z.number().min(1),
      details: z.string().optional(),
    })
  ),
  tripExtras: z.array(
    z.object({
      type: z.string(),
      name: z.string().min(1, "Extra name is required"),
      price: z.number().optional(),
      notes: z.string().optional(),
    })
  ),
  images: z.array(z.string()),
  mapImage: z.string().optional(),
  overview: z.string().optional(),
  inclusions: z.array(z.string()),
  exclusions: z.array(z.string()),
  destinationId: z.string().min(1, "Category is required"),
});

type TourFormValues = z.infer<typeof tourSchema>;

interface TourFormProps {
  params: { id: string };
}

export default function TourForm({ params }: TourFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(params.id !== "new");

  const form = useForm<any>({
    resolver: zodResolver(tourSchema) as any,
    defaultValues: {
      code: "",
      title: "",
      slug: "",
      startLocation: "",
      endLocation: "",
      durationDays: 1,
      minAge: 0,
      maxGroupSize: 10,
      style: "ORIGINAL",
      theme: "",
      region: "",
      physicalRating: 1,
      priceFrom: 0,
      discountPrice: undefined,
      currency: "USD",
      promoTag: "",
      mealsIncluded: false,
      transport: "",
      depositAmount: undefined,
      depositPercentage: undefined,
      isFeatured: false,
      isNew: false,
      isSale: false,
      itinerary: [],
      highlight: [],
      accommodation: [],
      tripExtras: [],
      images: [],
      mapImage: "",
      overview: "",
      inclusions: [],
      exclusions: [],
      destinationId: "",
    },
  });

  const [destinations, setDestinations] = useState<Destination[]>([]);

  const {
    fields: itFields,
    append: itAppend,
    remove: itRemove,
  } = useFieldArray({
    control: form.control,
    name: "itinerary",
  });

  const {
    fields: hiFields,
    append: hiAppend,
    remove: hiRemove,
  } = useFieldArray({
    control: form.control,
    name: "highlight",
  });

  const {
    fields: acFields,
    append: acAppend,
    remove: acRemove,
  } = useFieldArray({
    control: form.control,
    name: "accommodation",
  });

  const {
    fields: exFields,
    append: exAppend,
    remove: exRemove,
  } = useFieldArray({
    control: form.control,
    name: "tripExtras",
  });

  useEffect(() => {
    if (params.id !== "new") {
      getTour(params.id)
        .then((data) => {
          form.reset({
            ...data,
            minAge: data.minAge ?? 0,
          });
          setIsFetching(false);
        })
        .catch(() => {
          toast.error("Failed to fetch tour details");
          setIsFetching(false);
        });
    }
  }, [params.id, form]);

  useEffect(() => {
    getDestinations()
      .then(setDestinations)
      .catch(() => toast.error("Failed to fetch destinations"));
  }, []);

  const onSubmit: SubmitHandler<TourFormValues> = async (values) => {
    setIsLoading(true);
    try {
      if (params.id === "new") {
        await createTour(values);
        toast.success("Tour created successfully!");
      } else {
        await updateTour(params.id, values);
        toast.success("Tour updated successfully!");
      }
      router.push("/admin/tours");
    } catch {
      toast.error("An error occurred while saving the tour.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  };

  if (isFetching) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className=" mx-auto py-10 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            {params.id === "new" ? "Create New Tour" : "Edit Tour"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            Craft an unforgettable experience for your travelers.
          </p>
        </div>
        <div className="flex gap-2">
          {params.id !== "new" && (
            <>
              <Button
                variant="outline"
                onClick={() => router.push(`/admin/tours/${params.id}/departures`)}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Manage Dates
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push(`/admin/tours/${params.id}/rooms`)}
              >
                <Package className="h-4 w-4 mr-2" />
                Room Options
              </Button>
            </>
          )}
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="sticky top-20 z-40 bg-background/95 backdrop-blur py-4">
              <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
                <TabsTrigger value="general">1. General</TabsTrigger>
                <TabsTrigger value="itinerary">2. Itinerary</TabsTrigger>
                <TabsTrigger value="details">3. Details</TabsTrigger>
                <TabsTrigger value="extras">4. Extras</TabsTrigger>
              </TabsList>
            </div>

            <AnimatePresence mode="wait">
              {/* General Tab */}
              <TabsContent
                key="general"
                value="general"
                className="mt-6 space-y-6"
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="border-none shadow-premium bg-zinc-50/50 dark:bg-zinc-900/50">
                    <CardHeader>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <Package className="h-6 w-6 text-primary" /> Basic
                        Information
                      </CardTitle>
                      <CardDescription>
                        Core identity and routing for this tour.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tour Title</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ultimate Safari Adventure"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  form.setValue(
                                    "slug",
                                    generateSlug(e.target.value)
                                  );
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tour Code</FormLabel>
                            <FormControl>
                              <Input placeholder="SAF-001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Slug (URL Friendly)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="ultimate-safari-adventure"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="theme"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Theme</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Adventure, Luxury, Family"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="destinationId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category / Region</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Destination" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {destinations.map((dest) => (
                                  <SelectItem key={dest.id} value={dest.id}>
                                    {dest.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Automatic selection based on location, but you can
                              override it.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="startLocation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Location</FormLabel>
                            <FormControl>
                              <LocationInput
                                value={field.value}
                                onChange={(val, region) => {
                                  field.onChange(val);
                                  if (region) {
                                    const dest = destinations.find(
                                      (d) =>
                                        d.name.toLowerCase() ===
                                        region.toLowerCase()
                                    );
                                    if (dest) {
                                      form.setValue("destinationId", dest.id);
                                    }
                                  }
                                }}
                                placeholder="Nairobi, Kenya"
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="endLocation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Location</FormLabel>
                            <FormControl>
                              <LocationInput
                                value={field.value}
                                onChange={(val, region) => {
                                  field.onChange(val);
                                  if (
                                    region &&
                                    !form.getValues("destinationId")
                                  ) {
                                    const dest = destinations.find(
                                      (d) =>
                                        d.name.toLowerCase() ===
                                        region.toLowerCase()
                                    );
                                    if (dest) {
                                      form.setValue("destinationId", dest.id);
                                    }
                                  }
                                }}
                                placeholder="Mombasa, Kenya"
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Card className="mt-6 border-none shadow-premium bg-zinc-50/50 dark:bg-zinc-900/50">
                    <CardHeader>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <DollarSign className="h-6 w-6 text-primary" /> Pricing
                        & Style
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="priceFrom"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price From</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  className="pl-9"
                                  type="number"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Currency</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Currency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="USD">USD</SelectItem>
                                <SelectItem value="EUR">EUR</SelectItem>
                                <SelectItem value="GBP">GBP</SelectItem>
                                <SelectItem value="INR">INR</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="durationDays"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Duration (Days)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  className="pl-9"
                                  type="number"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="maxGroupSize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max Group Size</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Users className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  className="pl-9"
                                  type="number"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Card className="mt-6 border-none shadow-premium bg-zinc-50/50 dark:bg-zinc-900/50">
                    <CardHeader>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <DollarSign className="h-6 w-6 text-primary" /> Additional
                        Pricing & Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="discountPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Discounted Price (optional)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  className="pl-9"
                                  type="number"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="depositAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Deposit Amount (optional)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  className="pl-9"
                                  type="number"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="depositPercentage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Deposit Percentage (optional)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  className="pl-9"
                                  type="number"
                                  placeholder="e.g., 20 for 20%"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="region"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Region</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., East Africa, Southeast Asia" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="physicalRating"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Physical Rating (1-5)</FormLabel>
                            <Select
                              onValueChange={(value) => field.onChange(Number(value))}
                              defaultValue={field.value?.toString()}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select rating" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {[1, 2, 3, 4, 5].map((rating) => (
                                  <SelectItem key={rating} value={rating.toString()}>
                                    {rating} {rating === 1 ? "Easy" : rating === 2 ? "Moderate" : rating === 3 ? "Challenging" : rating === 4 ? "Tough" : "Extreme"}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="promoTag"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Promo Tag (optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Top Deal, Bestseller" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="isFeatured"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Featured Tour</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                  Show in featured section
                                </p>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="isNew"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>New Tour</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                  Mark as new release
                                </p>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="isSale"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>On Sale</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                  Show sale badge
                                </p>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="mt-6 border-none shadow-premium bg-zinc-50/50 dark:bg-zinc-900/50">
                    <CardHeader>
                      <CardTitle className="text-2xl">Media</CardTitle>
                      <CardDescription>
                        Upload images for the gallery and map.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                      <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Gallery Images (Drag & Drop to Reorder)
                            </FormLabel>
                            <FormControl>
                              <ImageUpload
                                value={field.value}
                                onChange={field.onChange}
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="mapImage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Map Image</FormLabel>
                            <FormControl>
                              <ImageUpload
                                value={field.value ? [field.value] : []}
                                onChange={(urls) =>
                                  field.onChange(urls[0] || "")
                                }
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={() => setActiveTab("itinerary")}
                  >
                    Next: Itinerary <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              {/* Itinerary Tab */}
              <TabsContent
                key="itinerary"
                value="itinerary"
                className="mt-6 space-y-6"
              >
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="border-none shadow-premium bg-zinc-50/50 dark:bg-zinc-900/50">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl flex items-center gap-2">
                          <Map className="h-6 w-6 text-primary" /> Daily
                          Itinerary
                        </CardTitle>
                        <CardDescription>
                          Break down the journey day by day.
                        </CardDescription>
                      </div>
                      <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={() =>
                          itAppend({
                            day: itFields.length + 1,
                            title: "",
                            details: "",
                          })
                        }
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add Day
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[500px] pr-4">
                        <div className="space-y-6">
                          {itFields.map((field, index) => (
                            <div
                              key={field.id}
                              className="relative p-6 rounded-xl border bg-background/50 shadow-sm transition-all hover:shadow-md"
                            >
                              <Badge className="absolute -left-3 -top-3 h-8 w-8 flex items-center justify-center rounded-full p-0">
                                {index + 1}
                              </Badge>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-2 text-destructive hover:text-destructive/80"
                                onClick={() => itRemove(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <div className="grid gap-4">
                                <div className="grid grid-cols-4 gap-4">
                                  <FormField
                                    control={form.control}
                                    name={`itinerary.${index}.day`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Day</FormLabel>
                                        <FormControl>
                                          <Input
                                            type="number"
                                            {...field}
                                            onChange={(e) =>
                                              field.onChange(
                                                Number(e.target.value)
                                              )
                                            }
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name={`itinerary.${index}.title`}
                                    render={({ field }) => (
                                      <FormItem className="col-span-3">
                                        <FormLabel>Daily Title</FormLabel>
                                        <FormControl>
                                          <Input
                                            placeholder="Arrival and Welcome Dinner"
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                <FormField
                                  control={form.control}
                                  name={`itinerary.${index}.details`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>
                                        Activities & Details
                                      </FormLabel>
                                      <FormControl>
                                        <Textarea
                                          className="min-h-[100px]"
                                          placeholder="Detailed description of the day..."
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          ))}
                          {itFields.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                              <Map className="h-12 w-12 mb-4 opacity-20" />
                              <p>No itinerary items added yet.</p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </motion.div>
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setActiveTab("general")}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" /> Previous: General
                  </Button>
                  <Button type="button" onClick={() => setActiveTab("details")}>
                    Next: Details <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              {/* Details Tab (Highlights & Accommodations) */}
              <TabsContent
                key="details"
                value="details"
                className="mt-6 space-y-6"
              >
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Highlights */}
                    <Card className="border-none shadow-premium bg-zinc-50/50 dark:bg-zinc-900/50">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle className="text-xl">Highlights</CardTitle>
                          <CardDescription>
                            Key attractions of this tour.
                          </CardDescription>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => hiAppend({ label: "" })}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[300px]">
                          <div className="space-y-3">
                            {hiFields.map((field, index) => (
                              <div
                                key={field.id}
                                className="flex gap-2 items-center"
                              >
                                <FormField
                                  control={form.control}
                                  name={`highlight.${index}.label`}
                                  render={({ field }) => (
                                    <FormItem className="flex-1">
                                      <FormControl>
                                        <Input
                                          placeholder="Witness the Great Migration"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => hiRemove(index)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>

                    {/* Accommodations */}
                    <Card className="border-none shadow-premium bg-zinc-50/50 dark:bg-zinc-900/50">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle className="text-xl">
                            Accommodations
                          </CardTitle>
                          <CardDescription>
                            Where travelers will stay.
                          </CardDescription>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() =>
                            acAppend({
                              type: "",
                              name: "",
                              nights: 1,
                              details: "",
                            })
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[300px]">
                          <div className="space-y-4">
                            {acFields.map((field, index) => (
                              <div
                                key={field.id}
                                className="p-4 rounded-lg border bg-background/50 relative"
                              >
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-1 top-1"
                                  onClick={() => acRemove(index)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                                <div className="grid gap-3">
                                  <div className="grid grid-cols-2 gap-2">
                                    <FormField
                                      control={form.control}
                                      name={`accommodation.${index}.type`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel className="text-xs">
                                            Type
                                          </FormLabel>
                                          <FormControl>
                                            <Input
                                              placeholder="Hotel/Lodge"
                                              {...field}
                                            />
                                          </FormControl>
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={form.control}
                                      name={`accommodation.${index}.nights`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel className="text-xs">
                                            Nights
                                          </FormLabel>
                                          <FormControl>
                                            <Input
                                              type="number"
                                              {...field}
                                              onChange={(e) =>
                                                field.onChange(
                                                  Number(e.target.value)
                                                )
                                              }
                                            />
                                          </FormControl>
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                  <FormField
                                    control={form.control}
                                    name={`accommodation.${index}.name`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-xs">
                                          Name
                                        </FormLabel>
                                        <FormControl>
                                          <Input
                                            placeholder="Serengeti Sopa Lodge"
                                            {...field}
                                          />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="mt-6 border-none shadow-premium bg-zinc-50/50 dark:bg-zinc-900/50">
                    <CardHeader>
                      <CardTitle className="text-xl">Logistics</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="transport"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Transport Information</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="4x4 Safari Vehicle, Internal flights"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="mealsIncluded"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-background">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>All Meals Included</FormLabel>
                              <FormDescription>
                                Tick if the tour price covers breakfast, lunch,
                                and dinner.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setActiveTab("itinerary")}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" /> Previous: Itinerary
                  </Button>
                  <Button type="button" onClick={() => setActiveTab("extras")}>
                    Next: Extras <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              {/* Extras Tab */}
              <TabsContent
                key="extras"
                value="extras"
                className="mt-6 space-y-6"
              >
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="border-none shadow-premium bg-zinc-50/50 dark:bg-zinc-900/50">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl">Trip Extras</CardTitle>
                        <CardDescription>
                          Optional activities, kitties, or local fees.
                        </CardDescription>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() =>
                          exAppend({
                            type: "Optional",
                            name: "",
                            price: 0,
                            notes: "",
                          })
                        }
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add Extra
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {exFields.map((field, index) => (
                          <div
                            key={field.id}
                            className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl border bg-background/50 relative"
                          >
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-1 top-1 md:-right-2 md:-top-2 bg-background border shadow-sm rounded-full"
                              onClick={() => exRemove(index)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                            <FormField
                              control={form.control}
                              name={`tripExtras.${index}.type`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Type</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Type" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Optional">
                                        Optional Activity
                                      </SelectItem>
                                      <SelectItem value="Kitty">
                                        Mandatory Kitty
                                      </SelectItem>
                                      <SelectItem value="Fee">
                                        Local Fee
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`tripExtras.${index}.name`}
                              render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                  <FormLabel>Name</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Hot Air Balloon Ride"
                                      {...field}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`tripExtras.${index}.price`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Price ({form.watch("currency")})
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(Number(e.target.value))
                                      }
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <div className="flex justify-between items-center bg-zinc-100 dark:bg-zinc-800 p-6 rounded-2xl">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setActiveTab("details")}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" /> Previous: Details
                  </Button>
                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      className="rounded-full px-12 h-12 text-lg font-bold shadow-xl shadow-primary/20 transition-transform active:scale-95"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                          Saving...
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-5 w-5" />{" "}
                          {params.id === "new" ? "Create Tour" : "Update Tour"}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}
