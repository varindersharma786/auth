"use client";

import { useEffect, useState } from "react";
import { Article, api } from "@/lib/api";
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
import { RichTextEditor } from "../editor/rich-text-editor";
import { ArticleCategory } from "@/lib/api";

interface ArticleFormProps {
  id?: string;
}

export default function ArticleForm({ id }: ArticleFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [formData, setFormData] = useState<
    Partial<Article & { categoryId: string }>
  >({
    title: "",
    slug: "",
    categoryId: "",
    content: "",
    isDraft: true,
    isFeatured: false,
  } as any);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, articleRes] = await Promise.all([
          api.get("/api/cms/categories"),
          id
            ? api.get(`/api/cms/admin/articles/${id}`)
            : Promise.resolve({ data: null }),
        ]);

        setCategories(categoriesRes.data);

        if (articleRes.data) {
          setFormData(articleRes.data);
        }
      } catch (error) {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) {
      toast.error("Please select a category");
      return;
    }

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
      className="space-y-8 max-w-5xl mx-auto p-8 bg-white rounded-2xl shadow-sm border"
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
            value={formData.categoryId || formData.category?.id}
            onValueChange={(val) =>
              setFormData({ ...formData, categoryId: val })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Cover Image URL</Label>
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
        <Label className="mb-2 block">Content</Label>
        <RichTextEditor
          content={formData.content || ""}
          onChange={(content) => setFormData({ ...formData, content })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl border">
          <div className="space-y-0.5">
            <Label>Draft Status</Label>
            <p className="text-xs text-muted-foreground">
              Drafts are only visible to admins.
            </p>
          </div>
          <Switch
            checked={formData.isDraft}
            onCheckedChange={(val) =>
              setFormData({ ...formData, isDraft: val })
            }
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl border">
          <div className="space-y-0.5">
            <Label>Featured Article</Label>
            <p className="text-xs text-muted-foreground">
              Highlight this article on the homepage.
            </p>
          </div>
          <Switch
            checked={formData.isFeatured}
            onCheckedChange={(val) =>
              setFormData({ ...formData, isFeatured: val })
            }
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button
          type="submit"
          className="rounded-full px-10 h-12 text-base shadow-lg hover:shadow-xl transition-all"
          disabled={saving}
        >
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
