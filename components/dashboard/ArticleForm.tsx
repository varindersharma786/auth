"use client";

import { useEffect, useState } from "react";
import { Article, api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

interface ArticleFormProps {
  id?: string;
}

const CATEGORIES = ["HIGHLIGHT", "INSPIRATION", "PURPOSE", "NEWS"];

export default function ArticleForm({ id }: ArticleFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Article>>({
    title: "",
    slug: "",
    category: "HIGHLIGHT",
    content: "",
    isDraft: true,
  } as any);

  useEffect(() => {
    if (id) {
      const fetchArticle = async () => {
        try {
          const { data } = await api.get(`/api/cms/articles/${id}`); // We might need a getById admin route or use slug if we have it
          // For simplicity, let's assume we can get by ID or filter from list
          setFormData(data);
        } catch (error) {
          toast.error("Failed to load article");
        } finally {
          setLoading(false);
        }
      };
      fetchArticle();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (id) {
        await api.put(`/api/cms/articles/${id}`, formData);
        toast.success("Article updated");
      } else {
        await api.post("/api/cms/articles", formData);
        toast.success("Article created");
      }
      router.push("/admin/articles");
    } catch (error) {
      toast.error("Failed to save article");
    } finally {
      setSaving(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
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
      className="space-y-8 max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-sm border"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {id ? "Edit Article" : "Create New Article"}
        </h2>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          <X className="h-4 w-4 mr-2" /> Cancel
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            required
            value={formData.title}
            onChange={(e) => {
              const title = e.target.value;
              setFormData({
                ...formData,
                title,
                slug: id ? formData.slug : generateSlug(title),
              });
            }}
            placeholder="Enter article title"
          />
        </div>
        <div className="space-y-2">
          <Label>Slug</Label>
          <Input
            required
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="article-slug"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={formData.category}
            onValueChange={(val) => setFormData({ ...formData, category: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Image URL</Label>
          <div className="flex gap-2">
            <Input
              value={formData.image || ""}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              placeholder="https://images.unsplash.com/..."
            />
            <Button type="button" variant="outline" size="icon">
              <ImageIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Subtitle / Short Description</Label>
        <Input
          value={formData.subtitle || ""}
          onChange={(e) =>
            setFormData({ ...formData, subtitle: e.target.value })
          }
          placeholder="A brief summary of the article"
        />
      </div>

      <div className="space-y-2">
        <Label>Content (Markdown support)</Label>
        <Textarea
          required
          className="min-h-[300px] font-mono text-sm"
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          placeholder="Write your article content here..."
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl">
        <div className="space-y-0.5">
          <Label>Draft Status</Label>
          <p className="text-xs text-muted-foreground">
            Drafts are only visible to admins.
          </p>
        </div>
        {/* @ts-ignore */}
        <Switch
          checked={formData.isDraft}
          onCheckedChange={(val) => setFormData({ ...formData, isDraft: val })}
        />
      </div>

      <div className="flex justify-end gap-4">
        <Button type="submit" className="rounded-full px-10" disabled={saving}>
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {id ? "Update Article" : "Create Article"}
        </Button>
      </div>
    </form>
  );
}
