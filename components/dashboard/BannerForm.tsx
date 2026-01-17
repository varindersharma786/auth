"use client";

import { useEffect, useState } from "react";
import { Banner, api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface BannerFormProps {
  id?: string;
}

const TYPES = ["HERO", "PROMO", "SUB"];

export default function BannerForm({ id }: BannerFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Banner>>({
    title: "",
    type: "HERO",
    imageUrl: "",
    isActive: true,
    order: 0,
  });

  useEffect(() => {
    if (id) {
      const fetchBanner = async () => {
        try {
          const { data } = await api.get(`/api/cms/banners/${id}`); // Assumes get by ID works
          setFormData(data);
        } catch (err) {
          toast.error("Failed to load banner");
        } finally {
          setLoading(false);
        }
      };
      fetchBanner();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (id) {
        await api.put(`/api/cms/banners/${id}`, formData);
        toast.success("Banner updated");
      } else {
        await api.post("/api/cms/banners", formData);
        toast.success("Banner created");
      }
      router.push("/admin/banners");
    } catch (err) {
      toast.error("Failed to save banner");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-sm border"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {id ? "Edit Banner" : "Create New Banner"}
        </h2>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          <X className="h-4 w-4 mr-2" /> Cancel
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            required
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Enter banner title"
          />
        </div>
        <div className="space-y-2">
          <Label>Subtitle (Optional)</Label>
          <Input
            value={formData.subtitle || ""}
            onChange={(e) =>
              setFormData({ ...formData, subtitle: e.target.value })
            }
            placeholder="Secondary text for the banner"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Type</Label>
          <Select
            value={formData.type}
            onValueChange={(val) => setFormData({ ...formData, type: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Order</Label>
          <Input
            type="number"
            value={formData.order}
            onChange={(e) =>
              setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Image URL</Label>
        <div className="flex gap-2">
          <Input
            required
            value={formData.imageUrl || ""}
            onChange={(e) =>
              setFormData({ ...formData, imageUrl: e.target.value })
            }
            placeholder="https://images.unsplash.com/..."
          />
          <Button type="button" variant="outline" size="icon">
            <ImageIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>CTA Text (Optional)</Label>
          <Input
            value={formData.ctaText || ""}
            onChange={(e) =>
              setFormData({ ...formData, ctaText: e.target.value })
            }
            placeholder="e.g., Shop Now"
          />
        </div>
        <div className="space-y-2">
          <Label>CTA URL (Optional)</Label>
          <Input
            value={formData.ctaUrl || ""}
            onChange={(e) =>
              setFormData({ ...formData, ctaUrl: e.target.value })
            }
            placeholder="e.g., /tours/safari"
          />
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl">
        <div className="space-y-0.5">
          <Label>Active Status</Label>
          <p className="text-xs text-muted-foreground">
            Visible on the website immediately.
          </p>
        </div>
        <Switch
          checked={formData.isActive || false}
          onCheckedChange={(val: boolean) =>
            setFormData({ ...formData, isActive: val })
          }
        />
      </div>

      <div className="flex justify-end gap-4">
        <Button type="submit" className="rounded-full px-10" disabled={saving}>
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {id ? "Update Banner" : "Create Banner"}
        </Button>
      </div>
    </form>
  );
}
