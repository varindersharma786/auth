"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Globe,
  Image as ImageIcon,
  Layout,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/checkbox"; // Using checkbox as switch proxy if switch not found
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createDestination,
  updateDestination,
  getDestinations,
  getDestinationBySlug,
} from "@/lib/api";
import { toast } from "sonner";

export default function DestinationForm() {
  const router = useRouter();
  const { id, slug } = useParams();
  const isEdit = !!slug || !!id;

  const [isLoading, setIsLoading] = useState(false);
  const [parentDestinations, setParentDestinations] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    longDescription: "",
    image: "",
    bannerImage: "",
    isTop: false,
    parentId: undefined as string | undefined,
  });

  useEffect(() => {
    const fetchSelectData = async () => {
      try {
        const data = await getDestinations();
        setParentDestinations(data);
      } catch (err) {
        console.error("Failed to load parents");
      }
    };
    fetchSelectData();

    if (slug) {
      const fetchDest = async () => {
        setIsLoading(true);
        try {
          const data = await getDestinationBySlug(slug as string);
          setFormData({
            name: data.name,
            slug: data.slug,
            description: data.description || "",
            longDescription: data.longDescription || "",
            image: data.image || "",
            bannerImage: data.bannerImage || "",
            isTop: data.isTop,
            parentId: data.parentId || undefined,
          });
        } catch (err) {
          toast.error("Failed to load destination");
        } finally {
          setIsLoading(false);
        }
      };
      fetchDest();
    }
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (slug) {
        // Need ID to update. Fetching by slug is fine for editing, but update needs ID.
        // Assuming getDestinationBySlug returns ID.
        const dest = await getDestinationBySlug(slug as string);
        await updateDestination(dest.id, formData);
        toast.success("Destination updated successfully");
      } else {
        await createDestination(formData);
        toast.success("Destination created successfully");
      }
      router.push("/admin/destinations");
      router.refresh();
    } catch (err) {
      toast.error("Error saving destination");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/destinations">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">
          {isEdit ? "Edit" : "Create"} Destination
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" /> Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Africa"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="e.g. africa"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="parent">Parent Destination (Optional)</Label>
              <Select
                value={formData.parentId || "none"}
                onValueChange={(val) =>
                  setFormData({
                    ...formData,
                    parentId: val === "none" ? undefined : val,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a parent (continent)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (Top Level)</SelectItem>
                  {parentDestinations.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="isTop"
                checked={formData.isTop}
                onChange={(e) =>
                  setFormData({ ...formData, isTop: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="isTop" className="font-medium">
                Show in "Top Destinations" section
              </Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layout className="h-5 w-5" /> Content & SEO
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Short Description (for cards)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="A brief summary of the destination..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longDescription">
                Long Description (for detail page)
              </Label>
              <Textarea
                id="longDescription"
                value={formData.longDescription}
                onChange={(e) =>
                  setFormData({ ...formData, longDescription: e.target.value })
                }
                placeholder="The main story/intro for the destination page..."
                className="min-h-[150px]"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" /> Visuals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image">Main Image URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bannerImage">
                Banner Image URL (Detail Page Hero)
              </Label>
              <Input
                id="bannerImage"
                value={formData.bannerImage}
                onChange={(e) =>
                  setFormData({ ...formData, bannerImage: e.target.value })
                }
                placeholder="https://..."
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="min-w-[120px]">
            {isLoading ? (
              "Saving..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Destination
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
